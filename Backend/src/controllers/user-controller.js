const bcrypt = require('bcrypt');
const User = require('../models/User');
const StudentQuery = require('../models/StudentQuery');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user (password will be hashed by pre-save hook)
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            // Allow role to be passed from frontend for demo purposes
            // In production, this would be stricter
            role: role || 'student',
            isActive: true
        });

        await newUser.save();
        const token = await newUser.generateToken();

        // Use toJSON method to exclude password and tokens
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser.toJSON(),
            token
        });

    } catch (error) {
        console.error('Register Error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// Log in user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Use the static method defined in model
        const user = await User.findByEmailAndPasswordForAuth(email, password);
        const token = await user.generateToken();

        res.json({
            message: 'Login successful',
            token,
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(400).json({ message: 'Invalid email or password' });
    }
};

// Get current user info
const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.toJSON());
    } catch (error) {
        console.error('Get user info error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all students
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student', isActive: true })
            .select('firstName lastName email role')
            .sort({ firstName: 1 });
        res.json(students);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all teachers
const getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher', isActive: true })
            .select('firstName lastName email role')
            .sort({ firstName: 1 });
        res.json(teachers);
    } catch (error) {
        console.error('Get teachers error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all users by role
const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        if (!['student', 'teacher', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const users = await User.find({ role, isActive: true })
            .select('firstName lastName email role')
            .sort({ firstName: 1 });
        res.json(users);
    } catch (error) {
        console.error('Get users by role error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        console.log('=== UPDATE PROFILE REQUEST ===');
        console.log('User ID:', req.user.userId);
        console.log('Request Body:', req.body);

        const { firstName, lastName, avatar, college, department, designation, location, bio } = req.body;

        // Build update object
        const updateFields = {};
        if (firstName !== undefined) updateFields.firstName = firstName;
        if (lastName !== undefined) updateFields.lastName = lastName;
        if (avatar !== undefined) updateFields.avatar = avatar;
        if (college !== undefined) updateFields.college = college;
        if (department !== undefined) updateFields.department = department;
        if (designation !== undefined) updateFields.designation = designation;
        if (location !== undefined) updateFields.location = location;
        if (bio !== undefined) updateFields.bio = bio;

        console.log('Update Fields:', updateFields);

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            console.log('ERROR: User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Updated User:', user.toJSON());
        console.log('=== PROFILE UPDATE SUCCESS ===');

        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Student Query functions
const submitStudentQuery = async (req, res) => {
    try {
        const { subject, message, category } = req.body;
        const studentId = req.user.userId;

        const query = new StudentQuery({
            studentId,
            subject,
            message,
            category: category || 'general_query'
        });

        await query.save();
        res.status(201).json({ message: 'Query submitted successfully', query });
    } catch (error) {
        console.error('Submit query error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getStudentQueries = async (req, res) => {
    try {
        const queries = await StudentQuery.find()
            .populate('studentId', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(queries);
    } catch (error) {
        console.error('Get queries error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const respondToStudentQuery = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminResponse, status } = req.body;
        const adminId = req.user.userId;

        const query = await StudentQuery.findByIdAndUpdate(
            id,
            {
                adminResponse,
                respondedBy: adminId,
                responseDate: new Date(),
                status: status || 'resolved'
            },
            { new: true }
        ).populate('studentId', 'firstName lastName email');

        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        res.json({ message: 'Response sent successfully', query });
    } catch (error) {
        console.error('Respond to query error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMyQueries = async (req, res) => {
    try {
        const studentId = req.user.userId;
        const queries = await StudentQuery.find({ studentId })
            .sort({ createdAt: -1 });
        res.json(queries);
    } catch (error) {
        console.error('Get my queries error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    getAllStudents,
    getAllTeachers,
    getUsersByRole,
    updateProfile,
    submitStudentQuery,
    getStudentQueries,
    respondToStudentQuery,
    getMyQueries
};
