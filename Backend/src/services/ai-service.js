const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DEPRECATED_GEMINI_MODELS = new Set(['gemini-2.5-flash', 'gemini-2.5-flash-lite']);
// TODO: gemini-2.5-flash family is planned for EOL; migrate any pinned deployments before deprecation date.
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3-flash';

if (process.env.GEMINI_MODEL && DEPRECATED_GEMINI_MODELS.has(process.env.GEMINI_MODEL)) {
    console.warn(
        `[AI Service] GEMINI_MODEL is set to deprecated value "${process.env.GEMINI_MODEL}". ` +
        'Please migrate to a supported model (e.g., gemini-3-flash) before the planned EOL.'
    );
}

let genAI;
const getAiClient = () => {
    if (!genAI) {
        if (!GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not set in environment variables.');
        }
        genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    }
    return genAI;
};

exports.analyzeSyllabus = async (justification, proposedChanges, baselineCurriculum) => {
    try {
        const prompt = `
                You are an academic curriculum reviewer. Compare the baseline syllabus with the proposed changes.

                Baseline Curriculum: ${JSON.stringify(baselineCurriculum)}
                Proposed Changes: ${JSON.stringify(proposedChanges)}
                Justification: "${justification}"

                Tasks:
                1. Produce an AI-recommended syllabus based on baseline + proposed changes + 2025 industry trends.
                2. Provide a relevance score (0-100) for the proposed changes.
                3. Provide a concise reason and a summary of strengths, risks, and missing topics.

                Output ONLY valid JSON:
                {
                    "score": number,
                    "reason": "string",
                    "alignment": "string",
                    "gaps": "string",
                    "aiSyllabus": {
                        "description": "string",
                        "units": [
                            {
                                "unitNumber": number,
                                "title": "string",
                                "hours": number,
                                "topics": ["string"],
                                "topicDetails": {"topic": ["detail"]}
                            }
                        ]
                    },
                    "comparison": {
                        "strengths": ["string"],
                        "risks": ["string"],
                        "missingTopics": ["string"]
                    }
                }
                `;

        const model = getAiClient().getGenerativeModel({ model: DEFAULT_GEMINI_MODEL });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = textResponse.replace(/^```json\n|\n```$/g, '').replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("AI Service Error:", error.message);
        throw error;
    }
};

/**
 * Deep AI Analysis for Syllabus Scoring
 * Analyzes a single syllabus proposal and returns comprehensive scores
 */
exports.scoreSyllabusProposal = async (proposal, baselineCurriculum = null) => {
    try {
        const { justification, proposedChanges, requestType, industryReference } = proposal;

        const prompt = `
You are an expert academic curriculum evaluator and industry analyst. Your job is to score a syllabus change proposal with extreme precision.

=== PROPOSAL DETAILS ===
Request Type: ${requestType}
Justification: "${justification}"
Industry Reference: "${industryReference || 'Not provided'}"
Proposed Changes: ${JSON.stringify(proposedChanges, null, 2)}
${baselineCurriculum ? `Baseline Curriculum: ${JSON.stringify(baselineCurriculum, null, 2)}` : ''}

=== EVALUATION CRITERIA ===
Score each dimension from 0-100 based on:

1. **Content Quality (0-100)**: 
   - Topic clarity and specificity
   - Appropriate depth for academic level
   - Logical organization within units
   - Clear learning objectives implied

2. **Industry Relevance (0-100)**:
   - Alignment with 2025-2026 industry demands
   - Coverage of in-demand skills and technologies
   - Job market applicability
   - Real-world project potential

3. **Structural Consistency (0-100)**:
   - Balanced hour distribution across units
   - Proper progression from basic to advanced
   - No topic duplication
   - Coherent unit flow

4. **Pedagogical Flow (0-100)**:
   - Prerequisites properly ordered
   - Concepts build upon each other
   - Practical exercises follow theory
   - Assessment readiness

5. **Modern Coverage (0-100)**:
   - Inclusion of latest technologies/methodologies
   - Future-proof content
   - Emerging trends coverage
   - Innovation potential

6. **Market Alignment (0-100)**:
   - Employability enhancement
   - Skill gap reduction
   - Industry certification alignment
   - Startup/enterprise relevance

=== OUTPUT FORMAT ===
Return ONLY valid JSON (no markdown, no explanation outside JSON):
{
    "overallScore": <weighted average 0-100>,
    "contentQuality": <0-100>,
    "industryRelevance": <0-100>,
    "structuralConsistency": <0-100>,
    "pedagogicalFlow": <0-100>,
    "modernCoverage": <0-100>,
    "marketAlignment": <0-100>,
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "missingTopics": ["topic1", "topic2", "topic3"],
    "recommendations": ["recommendation1", "recommendation2"],
    "aiExplanation": "2-3 sentence summary of why this score was given",
    "aiRecommendation": "Highly Recommend" | "Recommend" | "Neutral" | "Needs Revision" | "Reject",
    "confidence": "High" | "Medium" | "Low",
    "subjectArea": "detected subject area",
    "predictedEmployability": <0-100>,
    "skillGapReduction": <0-100>
}

Be precise, fair, and consistent. Higher scores should reflect genuinely better proposals.`;

        const model = getAiClient().getGenerativeModel({ model: DEFAULT_GEMINI_MODEL });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up markdown code blocks if present
        let jsonStr = textResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const parsedResult = JSON.parse(jsonStr);
        parsedResult.analyzedAt = new Date();
        parsedResult.modelUsed = DEFAULT_GEMINI_MODEL;

        return parsedResult;

    } catch (error) {
        console.error("AI Scoring Error:", error.message);
        throw error;
    }
};

/**
 * Batch analyze and rank multiple competing proposals
 * Returns proposals sorted by AI score with comparative analysis
 */
exports.analyzeCompetingProposals = async (proposals, baselineCurriculum = null) => {
    try {
        if (!proposals || proposals.length === 0) {
            return { proposals: [], comparison: null };
        }

        // If only one proposal, just score it
        if (proposals.length === 1) {
            const score = await exports.scoreSyllabusProposal(proposals[0], baselineCurriculum);
            return {
                proposals: [{
                    ...proposals[0],
                    aiScore: score,
                    competingRank: 1,
                    totalCompeting: 1
                }],
                comparison: null
            };
        }

        // Batch score all proposals
        const scoredProposals = await Promise.all(
            proposals.map(async (proposal) => {
                try {
                    const score = await exports.scoreSyllabusProposal(proposal, baselineCurriculum);
                    return { ...proposal, aiScore: score };
                } catch (err) {
                    console.error(`Failed to score proposal ${proposal._id}:`, err.message);
                    return {
                        ...proposal,
                        aiScore: {
                            overallScore: 0,
                            aiExplanation: 'Analysis failed',
                            aiRecommendation: 'Neutral',
                            confidence: 'Low'
                        }
                    };
                }
            })
        );

        // Sort by overall score descending
        scoredProposals.sort((a, b) => (b.aiScore?.overallScore || 0) - (a.aiScore?.overallScore || 0));

        // Add ranking
        const rankedProposals = scoredProposals.map((p, index) => ({
            ...p,
            competingRank: index + 1,
            totalCompeting: scoredProposals.length
        }));

        // Generate comparative analysis
        const comparisonPrompt = `
You are comparing ${proposals.length} competing syllabus proposals for the same course.

=== SCORED PROPOSALS (ranked by AI score) ===
${rankedProposals.map((p, i) => `
#${i + 1} (Score: ${p.aiScore?.overallScore || 0}/100) - By Faculty: ${p.facultyId?.firstName || 'Unknown'}
Type: ${p.requestType}
Justification: ${p.justification}
Key Strengths: ${(p.aiScore?.strengths || []).slice(0, 2).join(', ')}
`).join('\n')}

=== TASK ===
Provide a brief comparative analysis helping the admin understand:
1. Why the top-ranked proposal is best
2. Key differences between proposals
3. Any concerns about the top choice

Return ONLY valid JSON:
{
    "topChoiceReason": "Why #1 is recommended",
    "keyDifferences": ["difference1", "difference2"],
    "concerns": ["concern1"] or [],
    "adminGuidance": "One sentence guidance for final decision"
}`;

        let comparison = null;
        try {
            const model = getAiClient().getGenerativeModel({ model: DEFAULT_GEMINI_MODEL });
            const result = await model.generateContent(comparisonPrompt);
            const compResponse = await result.response;
            let compJson = compResponse.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            comparison = JSON.parse(compJson);
        } catch (compErr) {
            console.error("Comparison analysis failed:", compErr.message);
            comparison = {
                topChoiceReason: "Based on overall AI score",
                keyDifferences: ["Score-based ranking"],
                concerns: [],
                adminGuidance: "Review individual scores for detailed comparison"
            };
        }

        return {
            proposals: rankedProposals,
            comparison
        };

    } catch (error) {
        console.error("Batch Analysis Error:", error.message);
        throw error;
    }
};
