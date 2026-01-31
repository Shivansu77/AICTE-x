const aiService = require('../services/ai-service');
const UpdateReq = require('../models/UpdateReq');
const Curriculum = require('../models/Curriculum');

exports.analyzeSyllabus = async (req, res) => {
    try {
        const { justification, proposedChanges, baselineCurriculum } = req.body;

        if (!justification) {
            return res.status(400).json({ message: "Justification is required." });
        }

        const result = await aiService.analyzeSyllabus(justification, proposedChanges, baselineCurriculum);
        res.status(200).json(result);

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ message: "AI Analysis failed", error: error.message });
    }
};

/**
 * Score a single proposal and save AI scores to database
 */
exports.scoreProposal = async (req, res) => {
    try {
        const { requestId } = req.params;
        
        const request = await UpdateReq.findById(requestId)
            .populate('courseId', 'title code')
            .populate('curriculumId')
            .populate('facultyId', 'firstName lastName');

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Get baseline curriculum if available
        const baselineCurriculum = request.curriculumId ? request.curriculumId.toObject() : null;

        // Score the proposal
        const aiScore = await aiService.scoreSyllabusProposal(request.toObject(), baselineCurriculum);

        // Save scores to the request
        request.aiScore = aiScore;
        await request.save();

        res.status(200).json({
            message: "Proposal scored successfully",
            requestId: request._id,
            aiScore
        });

    } catch (error) {
        console.error("Score Proposal Error:", error);
        res.status(500).json({ message: "AI Scoring failed", error: error.message });
    }
};

/**
 * Analyze and rank all competing proposals for a curriculum
 * This is the main endpoint for comparing multiple teacher submissions
 */
exports.analyzeCompetingProposals = async (req, res) => {
    try {
        const { curriculumId } = req.params;

        // Find all pending proposals for this curriculum
        const proposals = await UpdateReq.find({ 
            curriculumId, 
            status: 'pending' 
        })
        .populate('courseId', 'title code')
        .populate('curriculumId')
        .populate('facultyId', 'firstName lastName email')
        .sort({ createdAt: -1 });

        if (!proposals || proposals.length === 0) {
            return res.status(404).json({ message: "No pending proposals found for this curriculum" });
        }

        // Get baseline curriculum
        const curriculum = await Curriculum.findById(curriculumId);
        const baselineCurriculum = curriculum ? curriculum.toObject() : null;

        // Analyze and rank all competing proposals
        const result = await aiService.analyzeCompetingProposals(
            proposals.map(p => p.toObject()), 
            baselineCurriculum
        );

        // Update all proposals with their scores and rankings
        await Promise.all(result.proposals.map(async (scoredProposal) => {
            await UpdateReq.findByIdAndUpdate(scoredProposal._id, {
                aiScore: scoredProposal.aiScore,
                competingRank: scoredProposal.competingRank,
                totalCompeting: scoredProposal.totalCompeting
            });
        }));

        res.status(200).json({
            message: "Competing proposals analyzed and ranked",
            totalProposals: result.proposals.length,
            comparison: result.comparison,
            rankedProposals: result.proposals.map(p => ({
                _id: p._id,
                faculty: p.facultyId,
                requestType: p.requestType,
                justification: p.justification,
                proposedChanges: p.proposedChanges,
                aiScore: p.aiScore,
                competingRank: p.competingRank,
                totalCompeting: p.totalCompeting,
                createdAt: p.createdAt
            }))
        });

    } catch (error) {
        console.error("Analyze Competing Error:", error);
        res.status(500).json({ message: "Competing analysis failed", error: error.message });
    }
};

/**
 * Get all pending proposals grouped by curriculum with AI scores
 * Perfect for admin dashboard to see competing proposals at a glance
 */
exports.getPendingGroupedByCurriculum = async (req, res) => {
    try {
        const proposals = await UpdateReq.find({ status: 'pending' })
            .populate('courseId', 'title code')
            .populate('curriculumId', 'title code description')
            .populate('facultyId', 'firstName lastName email')
            .sort({ 'aiScore.overallScore': -1, createdAt: -1 });

        // Group by curriculum
        const grouped = {};
        proposals.forEach(p => {
            const currId = p.curriculumId?._id?.toString() || 'unknown';
            if (!grouped[currId]) {
                grouped[currId] = {
                    curriculum: p.curriculumId,
                    course: p.courseId,
                    proposals: [],
                    hasCompeting: false
                };
            }
            grouped[currId].proposals.push(p);
        });

        // Mark groups with competing proposals and sort by score
        Object.keys(grouped).forEach(key => {
            const group = grouped[key];
            group.hasCompeting = group.proposals.length > 1;
            group.proposals.sort((a, b) => (b.aiScore?.overallScore || 0) - (a.aiScore?.overallScore || 0));
        });

        res.status(200).json({
            totalPending: proposals.length,
            curriculumGroups: Object.values(grouped),
            competingCount: Object.values(grouped).filter(g => g.hasCompeting).length
        });

    } catch (error) {
        console.error("Grouped Fetch Error:", error);
        res.status(500).json({ message: "Failed to fetch grouped proposals", error: error.message });
    }
};

/**
 * Batch analyze all unscored pending proposals
 */
exports.batchScoreAllPending = async (req, res) => {
    try {
        // Find all pending proposals without AI scores
        const unscoredProposals = await UpdateReq.find({ 
            status: 'pending',
            $or: [
                { aiScore: { $exists: false } },
                { 'aiScore.overallScore': { $exists: false } }
            ]
        })
        .populate('courseId', 'title code')
        .populate('curriculumId')
        .populate('facultyId', 'firstName lastName');

        if (unscoredProposals.length === 0) {
            return res.status(200).json({ 
                message: "All proposals already scored",
                scored: 0 
            });
        }

        // Score each proposal (with rate limiting)
        let scored = 0;
        let failed = 0;

        for (const proposal of unscoredProposals) {
            try {
                const baselineCurriculum = proposal.curriculumId ? proposal.curriculumId.toObject() : null;
                const aiScore = await aiService.scoreSyllabusProposal(proposal.toObject(), baselineCurriculum);
                
                await UpdateReq.findByIdAndUpdate(proposal._id, { aiScore });
                scored++;
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (err) {
                console.error(`Failed to score ${proposal._id}:`, err.message);
                failed++;
            }
        }

        // Update rankings for each curriculum
        const curriculumIds = [...new Set(unscoredProposals.map(p => p.curriculumId?._id?.toString()).filter(Boolean))];
        
        for (const currId of curriculumIds) {
            const currProposals = await UpdateReq.find({ 
                curriculumId: currId, 
                status: 'pending',
                'aiScore.overallScore': { $exists: true }
            }).sort({ 'aiScore.overallScore': -1 });

            for (let i = 0; i < currProposals.length; i++) {
                await UpdateReq.findByIdAndUpdate(currProposals[i]._id, {
                    competingRank: i + 1,
                    totalCompeting: currProposals.length
                });
            }
        }

        res.status(200).json({
            message: "Batch scoring complete",
            scored,
            failed,
            total: unscoredProposals.length
        });

    } catch (error) {
        console.error("Batch Score Error:", error);
        res.status(500).json({ message: "Batch scoring failed", error: error.message });
    }
};
