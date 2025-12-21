const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    content: { type: String } // Optional detail
});

const UnitSchema = new mongoose.Schema({
    title: { type: String, required: true },
    unitNumber: { type: Number, required: true },
    hours: { type: Number, required: true },
    topics: [TopicSchema] // Changed from array of strings to TopicSchema for better structure if needed, or keeping simple strings if preferred. Let's stick to simple strings mixed with objects if we want flexibility, but TopicSchema is cleaner.
    // Actually, looking at original file, it was [{type: String}]. The user requirement mentions "Units & topics".
    // Let's support both simple string list or objects.
    // For now, let's keep it simple:
    // topics: [{ type: String }] 
});

const CurriculumSchema = new mongoose.Schema({
    // Link to Master Course
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    // Subject Details
    title: { type: String, required: true }, // e.g., "Data Structures"
    code: { type: String, required: true }, // e.g., "CSE-301", NOT unique globally across all versions, but unique per version/course effectively
    description: { type: String, required: true },
    credits: { type: Number, required: true },
    semester: { type: Number, required: true }, // 1-8
    program: { type: String }, // redundant with courseId but kept for easy display if needed, or used as department filter

    // Syllabus Content
    units: [{
        title: { type: String, required: true },
        unitNumber: { type: Number, required: true },
        hours: { type: Number, required: true },
        topics: [String],
        topicDetails: { type: mongoose.Schema.Types.Mixed, default: {} }
    }],

    courseOutcomes: [{ type: String }], // COs
    references: [{ type: String }], // Textbooks/References

    // Version Control
    version: { type: Number, default: 1 },
    isLatest: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }, // Active for current students
    parentVersionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Curriculum', default: null },

    status: { type: String, enum: ['draft', 'pending_approval', 'approved', 'published', 'archived', 'deprecated'], default: 'draft' },
    publishedAt: { type: Date },

    // Metadata
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updateLog: { type: String } // Reason for change if any
}, { timestamps: true });

// Compound index to ensure unique subject code per course + version? 
// Or just per course+semester? 
// For now, let's just create an index on courseId and code.
CurriculumSchema.index({ courseId: 1, code: 1, version: 1 });

module.exports = mongoose.model('Curriculum', CurriculumSchema);