const fs = require('fs');
const path = require('path');
const UpdateReq = require('../models/UpdateReq');
const Curriculum = require('../models/Curriculum');
const Course = require('../models/Course');

exports.createRequest = async (req, res) => {
    try {
        const { courseId, curriculumId, requestType, justification, industryReference, proposedChanges } = req.body;

        const newReq = new UpdateReq({
            courseId,
            curriculumId,
            facultyId: req.user.userId,
            requestType,
            justification,
            industryReference,
            proposedChanges
        });

        await newReq.save();
        res.status(201).json(newReq);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await UpdateReq.find({ status: 'pending' })
            .populate('courseId', 'title code')
            .populate('curriculumId', 'title code')
            .populate('facultyId', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getRequestById = async (req, res) => {
    try {
        const request = await UpdateReq.findById(req.params.id)
            .populate('courseId', 'title code')
            .populate('curriculumId', 'title code')
            .populate('facultyId', 'firstName lastName');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateRequestStatus = async (req, res) => {
    const log = (msg) => {
        try {
            fs.appendFileSync(path.join(__dirname, '../../debug.log'), new Date().toISOString() + ' ' + msg + '\n');
        } catch (e) { console.error(e); }
    };

    log(`Start updateRequestStatus: ${req.params.id} Status: ${req.body.status}`);

    try {
        const { status, adminRemarks } = req.body;
        const request = await UpdateReq.findById(req.params.id);

        if (!request) {
            log('Request not found');
            return res.status(404).json({ message: 'Request not found' });
        }

        log(`Found Request: ${request._id}, Type: ${request.requestType}`);

        request.status = status;
        request.adminRemarks = adminRemarks;
        request.reviewedBy = req.user.userId;

        log(`Reviewer: ${req.user.userId}`);

        // If Approved, Trigger New Version Creation (Publishing)
        if (status === 'approved') {
            log('Status is approved. Fetching Curriculum: ' + request.curriculumId);
            const oldSubject = await Curriculum.findById(request.curriculumId);

            if (oldSubject) {
                log('Found oldSubject: ' + oldSubject._id);
                // Archive Old Version
                oldSubject.isLatest = false;
                oldSubject.status = 'archived';
                await oldSubject.save();

                // Prepare New Data
                const newSubjectData = { ...oldSubject.toObject() };
                delete newSubjectData._id;
                delete newSubjectData.createdAt;
                delete newSubjectData.updatedAt;

                newSubjectData.version = oldSubject.version + 1;
                newSubjectData.isLatest = true;
                newSubjectData.status = 'published';
                newSubjectData.publishedAt = new Date();
                newSubjectData.parentVersionId = oldSubject._id;
                newSubjectData.approvedBy = req.user.userId;
                newSubjectData.updateLog = `[${request.requestType}] ${request.justification}`;

                log('Prepared newSubjectData, applying changes...');

                // APPLY PROPOSED CHANGES
                const changes = request.proposedChanges || {};
                log('Changes: ' + JSON.stringify(changes));

                if (request.requestType === 'Update Content' && changes.description) {
                    newSubjectData.description = changes.description;
                }

                if (request.requestType === 'Add Topic' && changes.unitNumber && changes.newTopic) {
                    const unitIndex = newSubjectData.units.findIndex(u => u.unitNumber == changes.unitNumber);
                    if (unitIndex !== -1) {
                        newSubjectData.units[unitIndex].topics.push(changes.newTopic);
                    }
                }

                if (request.requestType === 'Remove Topic' && changes.unitNumber && changes.newTopic) {
                    const unitIndex = newSubjectData.units.findIndex(u => u.unitNumber == changes.unitNumber);
                    if (unitIndex !== -1) {
                        // Filter out the topic (exact match)
                        newSubjectData.units[unitIndex].topics = newSubjectData.units[unitIndex].topics.filter(t => t !== changes.newTopic);
                    }
                }

                if (request.requestType === 'Add Unit' && changes.unitNumber && changes.unitTitle) {
                    const existingIndex = newSubjectData.units.findIndex(u => u.unitNumber == changes.unitNumber);
                    if (existingIndex === -1) {
                        newSubjectData.units.push({
                            title: changes.unitTitle,
                            unitNumber: parseInt(changes.unitNumber),
                            hours: parseInt(changes.unitHours) || 0,
                            topics: []
                        });
                        // Sort units by unitNumber to keep curriculum organized
                        newSubjectData.units.sort((a, b) => a.unitNumber - b.unitNumber);
                    }
                }

                if (request.requestType === 'Add Topic Detail' && changes.unitNumber && changes.newTopic && changes.description) {
                    console.log('[DEBUG] Processing Add Topic Detail...');
                    const unitIndex = newSubjectData.units.findIndex(u => u.unitNumber == changes.unitNumber);
                    if (unitIndex !== -1) {
                        const unit = newSubjectData.units[unitIndex];
                        console.log('[DEBUG] Found Unit:', unit.unitNumber);

                        // Ensure topicDetails is an object
                        let currentDetails = unit.topicDetails || {};
                        if (typeof currentDetails !== 'object') currentDetails = {};

                        // Get existing array or init
                        let topicArr = currentDetails[changes.newTopic] || [];
                        if (!Array.isArray(topicArr)) topicArr = [];

                        console.log(`[DEBUG] Current details for "${changes.newTopic}":`, topicArr);

                        // Push new detail
                        topicArr.push(changes.description);

                        // Reassign strictly to ensure update
                        unit.topicDetails = {
                            ...currentDetails,
                            [changes.newTopic]: topicArr
                        };

                        console.log(`[DEBUG] Updated unit.topicDetails:`, JSON.stringify(unit.topicDetails));
                    } else {
                        console.error(`[DEBUG] Unit ${changes.unitNumber} NOT FOUND`);
                    }
                }

                if (request.requestType === 'Remove Topic Detail' && changes.unitNumber && changes.newTopic && changes.description) {
                    const unitIndex = newSubjectData.units.findIndex(u => u.unitNumber == changes.unitNumber);
                    if (unitIndex !== -1) {
                        const unit = newSubjectData.units[unitIndex];
                        if (unit.topicDetails && unit.topicDetails[changes.newTopic]) {
                            unit.topicDetails = {
                                ...unit.topicDetails,
                                [changes.newTopic]: unit.topicDetails[changes.newTopic].filter(d => d !== changes.description)
                            };
                        }
                    }
                }

                if (request.requestType === 'Update Unit' && changes.unitNumber) {
                    const unitIndex = newSubjectData.units.findIndex(u => u.unitNumber == changes.unitNumber);
                    if (unitIndex !== -1) {
                        if (changes.unitTitle) newSubjectData.units[unitIndex].title = changes.unitTitle;
                        if (changes.unitHours) newSubjectData.units[unitIndex].hours = parseInt(changes.unitHours);
                    }
                }

                // Handle Bulk Update - Apply all changes from the form
                if (request.requestType === 'Bulk Update') {
                    log('Processing Bulk Update...');
                    
                    // Update basic info if provided
                    if (changes.title) {
                        newSubjectData.title = changes.title;
                    }
                    if (changes.description) {
                        newSubjectData.description = changes.description;
                    }
                    if (changes.credits !== undefined) {
                        newSubjectData.credits = changes.credits;
                    }
                    
                    // Update course outcomes if provided
                    if (changes.courseOutcomes && Array.isArray(changes.courseOutcomes)) {
                        newSubjectData.courseOutcomes = changes.courseOutcomes.filter(co => co && co.trim() !== '');
                    }
                    
                    // Update units if provided
                    if (changes.units && Array.isArray(changes.units)) {
                        newSubjectData.units = changes.units.map((unit, idx) => ({
                            unitNumber: unit.unitNumber || idx + 1,
                            title: unit.title || '',
                            hours: parseInt(unit.hours) || 0,
                            topics: (unit.topics || []).filter(t => t && t.trim() !== ''),
                            topicDetails: unit.topicDetails || {}
                        }));
                    }
                    
                    log('Bulk Update applied: ' + JSON.stringify({
                        title: newSubjectData.title,
                        unitsCount: newSubjectData.units?.length,
                        outcomesCount: newSubjectData.courseOutcomes?.length
                    }));
                }

                // Create and Save New Version
                const newSubject = new Curriculum(newSubjectData);
                await newSubject.save();
                log('Saved newSubject');
            } else {
                log('Old Subject Not Found');
            }
        }

        await request.save();
        log('Request saved');
        res.json(request);
    } catch (error) {
        log('Exception: ' + error.stack);
        console.error(error); // Log for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await UpdateReq.find({ facultyId: req.user.userId })
            .populate('courseId', 'title code')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
