const Curriculum = require('../models/Curriculum');
const Course = require('../models/Course');

// Create a new Subject (Initial Version 1)
exports.createSubject = async (req, res) => {
    try {
        const { courseId, title, code, description, credits, semester, units, courseOutcomes, references } = req.body;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const subject = new Curriculum({
            courseId,
            title,
            code,
            description,
            credits,
            semester,
            units,
            courseOutcomes,
            references,
            version: 1,
            isLatest: true,
            isActive: true, // Only for demo simplicity, usually might start as draft
            createdBy: req.user.userId,
            status: 'approved' // Initial creation by admin is auto-approved
        });

        await subject.save();
        res.status(201).json(subject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all subjects for a course (Latest versions only)
exports.getSubjectsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const subjects = await Curriculum.find({
            courseId,
            isLatest: true
        }).sort({ semester: 1, code: 1 });

        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get specific subject details
exports.getSubjectById = async (req, res) => {
    try {
        const subject = await Curriculum.findById(req.params.id).populate('courseId');
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new version (Update) - usually via Request Approval, but Admin can do directly
exports.updateSubjectDirectly = async (req, res) => {
    try {
        const oldSubjectId = req.params.id;
        const oldSubject = await Curriculum.findById(oldSubjectId);
        if (!oldSubject) return res.status(404).json({ message: 'Subject not found' });

        // Mark old version as not latest 
        oldSubject.isLatest = false;
        await oldSubject.save();

        const newVersion = oldSubject.version + 1;

        const newSubject = new Curriculum({
            ...oldSubject.toObject(),
            _id: undefined, // New ID
            createdAt: undefined,
            updatedAt: undefined,
            ...req.body, // Overwrite with new data
            version: newVersion,
            isLatest: true,
            parentVersionId: oldSubject._id,
            requestType: undefined,
            updateLog: req.body.updateLog || 'Direct update by Admin'
        });

        await newSubject.save();
        res.status(201).json(newSubject);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- Legacy Support & Generic Getters ---

exports.getAllCurricula = async (req, res) => {
    try {
        // Return only latest versions
        const curricula = await Curriculum.find({ isLatest: true }).populate('courseId');
        res.status(200).json(curricula);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.seedCurriculum = async (req, res) => {
    try {
        await Course.deleteMany({});
        await Curriculum.deleteMany({});

        // Create Course
        const cseCourse = await Course.create({
            title: "B.Tech Computer Science & Engineering",
            code: "BTECH-CSE",
            department: "Computer Science",
            durationYears: 4,
            totalSemesters: 8,
            totalCredits: 160,
            type: "Degree"
        });

        // Create Subjects
        const subjects = [
            {
                courseId: cseCourse._id,
                title: "Data Structures & Algorithms",
                code: "CSE-301",
                description: "Fundamental concepts of data organization and manipulation.",
                credits: 4,
                semester: 3,
                units: [
                    { title: "Introduction", unitNumber: 1, hours: 8, topics: ["Arrays", "Linked Lists"] },
                    { title: "Trees", unitNumber: 2, hours: 10, topics: ["Binary Trees", "BST"] }
                ],
                version: 1,
                isLatest: true,
                isActive: true,
                status: 'approved'
            },
            {
                courseId: cseCourse._id,
                title: "Database Management Systems",
                code: "CSE-302",
                description: "Design and implementation of database systems.",
                credits: 3,
                semester: 3,
                units: [
                    { title: "Intro", unitNumber: 1, hours: 6, topics: ["ER Models"] }
                ],
                version: 1,
                isLatest: true,
                isActive: true,
                status: 'approved'
            }
        ];

        await Curriculum.insertMany(subjects);
        res.json({ message: "Seeded successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCurriculumById = exports.getSubjectById;
exports.createCurriculum = exports.createSubject;
