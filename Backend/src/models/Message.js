const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String, // 'Faculty', 'Student', 'Admin'
        required: true
    },
    channel: {
        type: String,
        enum: ['governance', 'academic'], // governance = Admin-Faculty, academic = Faculty-Student
        required: true,
        default: 'academic'
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
