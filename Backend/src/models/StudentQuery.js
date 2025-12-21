const mongoose = require('mongoose');

const StudentQuerySchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['subject_request', 'general_query', 'technical_issue', 'other'],
        default: 'general_query'
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    },
    adminResponse: {
        type: String
    },
    respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    responseDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('StudentQuery', StudentQuerySchema);
