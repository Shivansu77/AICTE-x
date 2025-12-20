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

// Get history of versions for a specific curriculum code
exports.getCurriculumHistory = async (req, res) => {
    try {
        const { code } = req.params;
        // Find all versions of this subject code
        const history = await Curriculum.find({ code })
            .select('title code version status publishedAt updatedAt updateLog isLatest')
            .sort({ version: -1 }); // Newest first

        res.status(200).json(history);
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
        // Find Courses (Assumes they exist or were seeded by course-controller)
        const cseCourse = await Course.findOne({ code: 'BTECH-CSE' });
        const aimlCourse = await Course.findOne({ code: 'BTECH-AIML' });
        const eceCourse = await Course.findOne({ code: 'BTECH-ECE' });

        const newSubjects = [];

        if (cseCourse) {
            // ... existing CSE logic ...
            newSubjects.push(
                {
                    courseId: cseCourse._id,
                    title: "Data Structures & Algorithms",
                    code: "CS-301",
                    description: "Fundamental concepts of data organization and manipulation.",
                    credits: 4,
                    semester: 3,
                    units: [
                        { title: "Introduction", unitNumber: 1, hours: 8, topics: ["Arrays", "Linked Lists"] },
                        { title: "Trees", unitNumber: 2, hours: 10, topics: ["Binary Trees", "BST"] }
                    ],
                    version: 1, isLatest: true, isActive: true, status: 'approved'
                },
                {
                    courseId: cseCourse._id,
                    title: "Database Management Systems",
                    code: "CS-302",
                    description: "Design and implementation of database systems.",
                    credits: 3,
                    semester: 3,
                    units: [{ title: "Intro", unitNumber: 1, hours: 6, topics: ["ER Models"] }],
                    version: 1, isLatest: true, isActive: true, status: 'approved'
                },
                {
                    courseId: cseCourse._id,
                    title: "Operating Systems",
                    code: "CS-401",
                    description: "Process management and memory management.",
                    credits: 4,
                    semester: 4,
                    units: [{ title: "Processes", unitNumber: 1, hours: 10, topics: ["Threads", "Scheduling"] }],
                    version: 1, isLatest: true, isActive: true, status: 'approved'
                }
            );
        }

        if (aimlCourse) {
            newSubjects.push(
                {
                    courseId: aimlCourse._id,
                    title: "Neural Networks",
                    code: "AI-301",
                    description: "Introduction to deep learning and neural networks.",
                    credits: 4,
                    semester: 3,
                    units: [
                        { title: "Perceptrons", unitNumber: 1, hours: 8, topics: ["Activation Functions", "Backprop"] },
                        { title: "CNNs", unitNumber: 2, hours: 10, topics: ["Convolution", "Pooling"] }
                    ],
                    version: 1, isLatest: true, isActive: true, status: 'approved'
                },
                {
                    courseId: aimlCourse._id,
                    title: "Machine Learning Fundamentals",
                    code: "AI-302",
                    description: "Supervised and unsupervised learning.",
                    credits: 3,
                    semester: 3,
                    units: [{ title: "Regression", unitNumber: 1, hours: 8, topics: ["Linear", "Logistic"] }],
                    version: 1, isLatest: true, isActive: true, status: 'approved'
                }
            );
        }

        if (eceCourse) {
            newSubjects.push(
                {
                    courseId: eceCourse._id,
                    title: "Digital Electronics",
                    code: "EC-301",
                    description: "Logic gates, combinational and sequential circuits.",
                    credits: 4,
                    semester: 3,
                    units: [
                        { title: "Logic Gates", unitNumber: 1, hours: 8, topics: ["AND, OR, NOT", "NAND/NOR"] },
                        { title: "Combinational Circuits", unitNumber: 2, hours: 10, topics: ["Adders", "Multiplexers"] }
                    ],
                    version: 1, isLatest: true, isActive: true, status: 'approved'
                },
                {
                    courseId: eceCourse._id,
                    title: "Signals and Systems",
                    code: "EC-302",
                    description: "Analysis of continuous and discrete time signals.",
                    credits: 3,
                    semester: 3,
                    units: [{ title: "Introduction", unitNumber: 1, hours: 6, topics: ["CT Signals", "DT Signals"] }],
                    version: 1, isLatest: true, isActive: true, status: 'approved'
                },
                {
                    courseId: eceCourse._id,
                    title: "Microprocessors",
                    code: "EC-401",
                    description: "Architecture and programming of microprocessors.",
                    credits: 4,
                    semester: 4,
                    units: [{ title: "8085 Architecture", unitNumber: 1, hours: 10, topics: ["Registers", "ALU"] }],
                    version: 1, isLatest: true, isActive: true, status: 'approved'
                }
            );
        }

        // Get default admin for createdBy if no user logged in
        const User = require('../models/User');
        const adminUser = await User.findOne({ role: 'admin' });
        const creatorId = req.user ? req.user.userId : (adminUser ? adminUser._id : null);

        let count = 0;
        for (const sub of newSubjects) {
            const exists = await Curriculum.findOne({ code: sub.code, courseId: sub.courseId });
            if (!exists) {
                await new Curriculum({ ...sub, createdBy: creatorId }).save();
                count++;
            }
        }

        res.json({ message: `Seeded ${count} subjects successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCurriculumById = exports.getSubjectById;
exports.createCurriculum = exports.createSubject;
