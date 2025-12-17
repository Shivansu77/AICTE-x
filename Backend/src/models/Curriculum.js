const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    content: { type: String } // Optional: detailed content if needed
});

const UnitSchema = new mongoose.Schema({
    title: { type: String, required: true },
    unitNumber: { type: Number, required: true },
    hours: { type: Number, required: true },
    topics: [{ type: String }] // Array of strings as per UI
});

const CurriculumSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "Data Structures & Algorithms"
    code: { type: String, required: true, unique: true }, // e.g., "CSE-301"
    description: { type: String, required: true },
    credits: { type: Number, required: true },
    semester: { type: Number, required: true }, // 1-8
    program: { type: String, default: "B.Tech CSE" }, // Branch
    color: { type: String, default: "blue" }, // UI Color theme
    units: [UnitSchema],
    status: { type: String, enum: ['draft', 'pending', 'approved'], default: 'draft' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Curriculum', CurriculumSchema);