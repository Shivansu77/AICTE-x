const express= require('express');
const router= express.Router();
const { registerUser, loginUser, getAllStudents } = require('../controllers/user-controller');
const authMiddleware = require('../middleware/AuthMiddleware');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/students', authMiddleware, getAllStudents);

module.exports=router;