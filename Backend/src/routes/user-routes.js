const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getAllStudents, 
    getAllTeachers, 
    getUsersByRole, 
    getAllUsers, 
    updateProfile, 
    getUserInfo, 
    submitStudentQuery, 
    getStudentQueries, 
    respondToStudentQuery, 
    getMyQueries,
    changePassword,
    updateNotificationPreferences,
    updateAppearancePreferences,
    updatePrivacyPreferences,
    getAllPreferences,
    deleteAccount,
    exportUserData
} = require('../controllers/user-controller');
const authMiddleware = require('../middleware/AuthMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserInfo);
router.put('/profile', authMiddleware, updateProfile);
router.get('/students', authMiddleware, getAllStudents);
router.get('/teachers', authMiddleware, getAllTeachers);
router.get('/role/:role', authMiddleware, getUsersByRole);
router.get('/all', authMiddleware, getAllUsers);

// Student Query routes
router.post('/student-query', authMiddleware, submitStudentQuery);
router.get('/student-queries', authMiddleware, getStudentQueries);
router.put('/student-query/:id/respond', authMiddleware, respondToStudentQuery);
router.get('/my-queries', authMiddleware, getMyQueries);

// Settings routes
router.put('/change-password', authMiddleware, changePassword);
router.get('/preferences', authMiddleware, getAllPreferences);
router.put('/preferences/notifications', authMiddleware, updateNotificationPreferences);
router.put('/preferences/appearance', authMiddleware, updateAppearancePreferences);
router.put('/preferences/privacy', authMiddleware, updatePrivacyPreferences);
router.delete('/account', authMiddleware, deleteAccount);
router.get('/export-data', authMiddleware, exportUserData);

module.exports = router;
