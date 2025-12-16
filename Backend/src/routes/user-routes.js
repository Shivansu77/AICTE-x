const express= require('express');
const router= express.Router();
const { registerUser, loginUser, getAllStudents, getAllTeachers, getUsersByRole } = require('../controllers/user-controller');
const authMiddleware = require('../middleware/AuthMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/students', authMiddleware, getAllStudents);
router.get('/teachers', authMiddleware, getAllTeachers);
router.get('/role/:role', authMiddleware, getUsersByRole);

module.exports=router;