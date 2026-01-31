const mongoose = require('mongoose');

const AIScoreSchema = new mongoose.Schema({
    overallScore: { type: Number, default: 0 },
    contentQuality: { type: Number, default: 0 },
    industryRelevance: { type: Number, default: 0 },
    structuralConsistency: { type: Number, default: 0 },
    pedagogicalFlow: { type: Number, default: 0 },
    modernCoverage: { type: Number, default: 0 },
    marketAlignment: { type: Number, default: 0 },
    
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingTopics: [{ type: String }],
    recommendations: [{ type: String }],
    
    aiExplanation: { type: String },
    aiRecommendation: { type: String, enum: ['Highly Recommend', 'Recommend', 'Neutral', 'Needs Revision', 'Reject'], default: 'Neutral' },
    confidence: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    
    analyzedAt: { type: Date },
    modelUsed: { type: String }
}, { _id: false });

const UpdateReqSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    curriculumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Curriculum', required: true },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    requestType: { type: String, enum: ['Add Topic', 'Remove Topic', 'Update Content', 'Add Unit', 'Update Unit', 'Add Topic Detail', 'Remove Topic Detail', 'New Tool/Technology', 'Outcome Improvement', 'Bulk Update', 'Other'], required: true },

    justification: { type: String, required: true }, // Academic justification
    industryReference: { type: String }, // Optional industry reference

    // The proposed changes - stored as JSON or string to be parsed
    proposedChanges: { type: mongoose.Schema.Types.Mixed },

    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminRemarks: { type: String }, // If rejected

    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // AI Analysis Results - stored after AI evaluation
    aiScore: AIScoreSchema,
    
    // Rank among competing proposals for same curriculum
    competingRank: { type: Number },
    totalCompeting: { type: Number }
}, { timestamps: true });

// Index for efficient querying of competing proposals
UpdateReqSchema.index({ curriculumId: 1, status: 1, 'aiScore.overallScore': -1 });

module.exports = mongoose.model('UpdateReq', UpdateReqSchema);
