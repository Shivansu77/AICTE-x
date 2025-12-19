const Course = require('../models/Course');

// Create a new Master Course
exports.createCourse = async (req, res) => {
    try {
        const { title, code, type, department, durationYears, totalSemesters, totalCredits } = req.body;

        const existingCourse = await Course.findOne({ code });
        if (existingCourse) {
            return res.status(400).json({ message: 'Course with this code already exists' });
        }

        const course = new Course({
            title,
            code,
            type,
            department,
            durationYears,
            totalSemesters,
            totalCredits,
            createdBy: req.user.userId
        });

        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all courses (with simple filtering)
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single course
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Course (e.g., lock status)
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
