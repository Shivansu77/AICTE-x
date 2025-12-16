const bcrypt = require('bcrypt');
const User = require('../models/User');

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
            role: role || 'user',
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
        const students = await User.find({ role: 'user', isActive: true })
            .select('firstName lastName email')
            .sort({ firstName: 1 });
        res.json(students);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    getAllStudents
};