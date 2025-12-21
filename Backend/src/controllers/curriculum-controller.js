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
        // Clear existing data
        await Curriculum.deleteMany({});
        await Course.deleteMany({});

        // Sample Courses
        const courses = [
            {
                title: "B.Tech Computer Science & Engineering",
                code: "BTECH-CSE",
                type: "Degree",
                department: "Computer Science",
                durationYears: 4,
                totalSemesters: 8,
                totalCredits: 160,
                isLocked: false
            },
            {
                title: "B.Tech Mechanical Engineering",
                code: "BTECH-ME",
                type: "Degree",
                department: "Mechanical Engineering",
                durationYears: 4,
                totalSemesters: 8,
                totalCredits: 160,
                isLocked: false
            },
            {
                title: "B.Tech Electrical Engineering",
                code: "BTECH-EE",
                type: "Degree",
                department: "Electrical Engineering",
                durationYears: 4,
                totalSemesters: 8,
                totalCredits: 160,
                isLocked: false
            }
        ];

        const createdCourses = await Course.insertMany(courses);

        // Sample Curricula
        const curricula = [
            // CSE Semester 3
            {
                courseId: createdCourses[0]._id,
                title: "Data Structures",
                code: "CSE-301",
                description: "Fundamental data structures and algorithms for efficient programming",
                credits: 4,
                semester: 3,
                program: "Computer Science",
                color: "blue",
                units: [
                    {
                        title: "Introduction to Data Structures",
                        unitNumber: 1,
                        hours: 8,
                        topics: ["Arrays", "Linked Lists", "Stacks", "Queues"]
                    },
                    {
                        title: "Trees and Graphs",
                        unitNumber: 2,
                        hours: 10,
                        topics: ["Binary Trees", "BST", "AVL Trees", "Graphs", "DFS", "BFS"]
                    },
                    {
                        title: "Sorting and Searching",
                        unitNumber: 3,
                        hours: 12,
                        topics: ["Bubble Sort", "Quick Sort", "Merge Sort", "Binary Search", "Hashing"]
                    }
                ],
                courseOutcomes: [
                    "Understand fundamental data structures",
                    "Implement efficient algorithms",
                    "Analyze algorithm complexity"
                ],
                references: [
                    "Introduction to Algorithms by Cormen",
                    "Data Structures by Seymour Lipschutz"
                ],
                version: 1,
                isLatest: true,
                isActive: true,
                status: 'approved'
            },
            {
                courseId: createdCourses[0]._id,
                title: "Database Management Systems",
                code: "CSE-302",
                description: "Database design, SQL, and management systems",
                credits: 4,
                semester: 3,
                program: "Computer Science",
                color: "blue",
                units: [
                    {
                        title: "Database Concepts",
                        unitNumber: 1,
                        hours: 8,
                        topics: ["DBMS Architecture", "Data Models", "ER Diagrams"]
                    },
                    {
                        title: "SQL and Query Processing",
                        unitNumber: 2,
                        hours: 12,
                        topics: ["DDL", "DML", "Joins", "Subqueries", "Query Optimization"]
                    },
                    {
                        title: "Normalization and Transactions",
                        unitNumber: 3,
                        hours: 10,
                        topics: ["Normal Forms", "ACID Properties", "Concurrency Control"]
                    }
                ],
                courseOutcomes: [
                    "Design database schemas",
                    "Write complex SQL queries",
                    "Understand transaction management"
                ],
                references: [
                    "Database System Concepts by Silberschatz",
                    "SQL for Dummies"
                ],
                version: 1,
                isLatest: true,
                isActive: true,
                status: 'approved'
            },
            // CSE Semester 4
            {
                courseId: createdCourses[0]._id,
                title: "Operating Systems",
                code: "CSE-401",
                description: "Operating system principles and implementation",
                credits: 4,
                semester: 4,
                program: "Computer Science",
                color: "blue",
                units: [
                    {
                        title: "Process Management",
                        unitNumber: 1,
                        hours: 10,
                        topics: ["Processes", "Threads", "Scheduling", "Synchronization"]
                    },
                    {
                        title: "Memory Management",
                        unitNumber: 2,
                        hours: 12,
                        topics: ["Virtual Memory", "Paging", "Segmentation", "Page Replacement"]
                    },
                    {
                        title: "File Systems and I/O",
                        unitNumber: 3,
                        hours: 8,
                        topics: ["File Organization", "Directories", "Disk Scheduling", "I/O Devices"]
                    }
                ],
                courseOutcomes: [
                    "Understand OS concepts",
                    "Implement process scheduling",
                    "Manage memory efficiently"
                ],
                references: [
                    "Operating System Concepts by Silberschatz",
                    "Modern Operating Systems by Tanenbaum"
                ],
                version: 1,
                isLatest: true,
                isActive: true,
                status: 'approved'
            },
            // ME Semester 3
            {
                courseId: createdCourses[1]._id,
                title: "Thermodynamics",
                code: "ME-301",
                description: "Principles of thermodynamics and heat transfer",
                credits: 4,
                semester: 3,
                program: "Mechanical Engineering",
                color: "peach",
                units: [
                    {
                        title: "Basic Concepts",
                        unitNumber: 1,
                        hours: 8,
                        topics: ["System", "Surroundings", "Properties", "State", "Process"]
                    },
                    {
                        title: "First Law of Thermodynamics",
                        unitNumber: 2,
                        hours: 12,
                        topics: ["Energy", "Work", "Heat", "Internal Energy", "Enthalpy"]
                    },
                    {
                        title: "Second Law and Entropy",
                        unitNumber: 3,
                        hours: 10,
                        topics: ["Reversibility", "Irreversibility", "Carnot Cycle", "Entropy"]
                    }
                ],
                courseOutcomes: [
                    "Apply thermodynamic principles",
                    "Analyze energy systems",
                    "Understand heat transfer mechanisms"
                ],
                references: [
                    "Thermodynamics by Cengel",
                    "Engineering Thermodynamics by Rajput"
                ],
                version: 1,
                isLatest: true,
                isActive: true,
                status: 'approved'
            },
            // EE Semester 3
            {
                courseId: createdCourses[2]._id,
                title: "Electrical Machines",
                code: "EE-301",
                description: "DC and AC machines fundamentals",
                credits: 4,
                semester: 3,
                program: "Electrical Engineering",
                color: "yellow",
                units: [
                    {
                        title: "DC Machines",
                        unitNumber: 1,
                        hours: 12,
                        topics: ["DC Generators", "DC Motors", "Characteristics", "Efficiency"]
                    },
                    {
                        title: "Transformers",
                        unitNumber: 2,
                        hours: 10,
                        topics: ["Working Principle", "Equivalent Circuit", "Phasor Diagram", "Efficiency"]
                    },
                    {
                        title: "AC Machines",
                        unitNumber: 3,
                        hours: 8,
                        topics: ["Induction Motors", "Synchronous Machines", "Speed Control"]
                    }
                ],
                courseOutcomes: [
                    "Analyze electrical machines",
                    "Understand machine characteristics",
                    "Design simple electrical systems"
                ],
                references: [
                    "Electrical Machines by Nagarath",
                    "Electric Machinery by Fitzgerald"
                ],
                version: 1,
                isLatest: true,
                isActive: true,
                status: 'approved'
            }
        ];

        await Curriculum.insertMany(curricula);

        res.json({
            message: 'Sample curriculum data seeded successfully!',
            coursesCreated: createdCourses.length,
            curriculaCreated: curricula.length
        });
    } catch (error) {
        console.error('Seeding error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a subject (Admin only)
exports.deleteSubject = async (req, res) => {
    try {
        const subject = await Curriculum.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        await Curriculum.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getCurriculumById = exports.getSubjectById;
exports.createCurriculum = exports.createSubject;
