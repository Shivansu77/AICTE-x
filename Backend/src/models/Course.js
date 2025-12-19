const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true }, // e.g., "B.Tech Computer Science & Engineering"
    code: { type: String, required: true, unique: true, trim: true, uppercase: true }, // e.g., "BTECH-CSE"
    type: { type: String, enum: ['Degree', 'Diploma', 'Certificate'], default: 'Degree' },
    department: { type: String, required: true }, // e.g., "Computer Science"
    durationYears: { type: Number, required: true }, // e.g., 4
    totalSemesters: { type: Number, required: true }, // e.g., 8
    totalCredits: { type: Number, required: true }, // e.g., 160
    isLocked: { type: Boolean, default: false }, // If locked, structure cannot be changed easily
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
