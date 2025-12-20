const mongoose = require('mongoose');

const UpdateReqSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    curriculumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Curriculum', required: true },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    requestType: { type: String, enum: ['Add Topic', 'Remove Topic', 'Update Content', 'Add Unit', 'Update Unit', 'Add Tool', 'Outcome Improvement', 'Other'], required: true },

    justification: { type: String, required: true }, // Academic justification
    industryReference: { type: String }, // Optional industry reference

    // The proposed changes - stored as JSON or string to be parsed
    proposedChanges: { type: mongoose.Schema.Types.Mixed },

    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminRemarks: { type: String }, // If rejected

    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('UpdateReq', UpdateReqSchema);
