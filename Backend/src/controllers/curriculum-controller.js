const Curriculum = require('../models/Curriculum');

exports.getAllCurricula = async (req, res) => {
    try {
        const curricula = await Curriculum.find({ status: 'approved' });
        res.status(200).json(curricula);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCurriculumById = async (req, res) => {
    try {
        const curriculum = await Curriculum.findOne({ code: req.params.id });
        // Note: Frontend passes ID or Code. Using Code for URL friendliness usually, but let's support both or stick to standard ID. 
        // The frontend Link is /curriculum/:id. If we use mongo ID:
        // const curriculum = await Curriculum.findById(req.params.id);

        if (!curriculum) return res.status(404).json({ message: 'Curriculum not found' });
        res.status(200).json(curriculum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCurriculum = async (req, res) => {
    try {
        const newCurriculum = new Curriculum(req.body);
        const savedCurriculum = await newCurriculum.save();
        res.status(201).json(savedCurriculum);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Seed function for initial data (Optional but helpful)
exports.seedCurriculum = async (req, res) => {
    try {
        const dummyData = [
            {
                title: "Data Structures & Algorithms",
                code: "CSE-301",
                credits: 4,
                semester: 3,
                color: "blue",
                description: "Fundamental concepts of data organization and manipulation. Arrays, Linked Lists, Trees, and Graphs.",
                status: "approved",
                units: [
                    { title: "Introduction", unitNumber: 1, hours: 8, topics: ["Arrays", "Linked Lists", "Complexity"] },
                    { title: "Trees", unitNumber: 2, hours: 10, topics: ["Binary Trees", "BST", "AVL"] }
                ]
            },
            {
                title: "Database Management Systems",
                code: "CSE-302",
                credits: 3,
                semester: 3,
                color: "peach",
                description: "Design and implementation of database systems. SQL, Normalization, and Transaction Management.",
                status: "approved",
                units: [
                    { title: "Intro to DBMS", unitNumber: 1, hours: 6, topics: ["ER Models", "Relational Model"] },
                    { title: "SQL", unitNumber: 2, hours: 12, topics: ["Queries", "Joins", "Procedures"] }
                ]
            }
        ];

        await Curriculum.deleteMany({});
        await Curriculum.insertMany(dummyData);
        res.json({ message: "Seeded successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
