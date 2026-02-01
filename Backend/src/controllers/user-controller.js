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



        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {

            return res.status(404).json({ message: 'User not found' });
        }



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

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Block/Unblock a user (admin only)
const toggleUserBlock = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminId = req.user.userId;

        // Check if the requesting user is an admin
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can block/unblock users' });
        }

        // Prevent admin from blocking themselves
        if (userId === adminId) {
            return res.status(400).json({ message: 'You cannot block yourself' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle the isActive status
        user.isActive = !user.isActive;
        await user.save();

        res.json({
            message: user.isActive ? 'User unblocked successfully' : 'User blocked successfully',
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Toggle user block error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a user (admin only)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminId = req.user.userId;

        // Check if the requesting user is an admin
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete users' });
        }

        // Prevent admin from deleting themselves
        if (userId === adminId) {
            return res.status(400).json({ message: 'You cannot delete yourself' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        // Also delete related data (queries, etc.)
        await StudentQuery.deleteMany({ studentId: userId });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.userId;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash and update new password
        user.password = newPassword; // Will be hashed by pre-save hook
        user.lastPasswordChange = new Date();
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update notification preferences
const updateNotificationPreferences = async (req, res) => {
    try {
        const userId = req.user.userId;
        const preferences = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { notificationPreferences: preferences } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Notification preferences updated', preferences: user.notificationPreferences });
    } catch (error) {
        console.error('Update notification preferences error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update appearance preferences
const updateAppearancePreferences = async (req, res) => {
    try {
        const userId = req.user.userId;
        const preferences = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { appearancePreferences: preferences } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Appearance preferences updated', preferences: user.appearancePreferences });
    } catch (error) {
        console.error('Update appearance preferences error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update privacy preferences
const updatePrivacyPreferences = async (req, res) => {
    try {
        const userId = req.user.userId;
        const preferences = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { privacyPreferences: preferences } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Privacy preferences updated', preferences: user.privacyPreferences });
    } catch (error) {
        console.error('Update privacy preferences error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all preferences
const getAllPreferences = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId).select('notificationPreferences appearancePreferences privacyPreferences lastPasswordChange twoFactorEnabled');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            notificationPreferences: user.notificationPreferences,
            appearancePreferences: user.appearancePreferences,
            privacyPreferences: user.privacyPreferences,
            lastPasswordChange: user.lastPasswordChange,
            twoFactorEnabled: user.twoFactorEnabled
        });
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete account
const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }

        // Soft delete - mark as inactive
        user.isActive = false;
        user.email = `deleted_${Date.now()}_${user.email}`; // Prevent email conflicts
        await user.save();

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Export user data (GDPR compliance)
const exportUserData = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's related data
        const queries = await StudentQuery.find({ studentId: userId });

        const exportData = {
            profile: user.toJSON(),
            queries: queries,
            exportDate: new Date().toISOString()
        };

        res.json(exportData);
    } catch (error) {
        console.error('Export data error:', error);
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
    getAllUsers,
    updateProfile,
    submitStudentQuery,
    getStudentQueries,
    respondToStudentQuery,
    getMyQueries,
    // New exports
    changePassword,
    updateNotificationPreferences,
    updateAppearancePreferences,
    updatePrivacyPreferences,
    getAllPreferences,
    deleteAccount,
    exportUserData,
    // Admin user management
    toggleUserBlock,
    deleteUser
};
