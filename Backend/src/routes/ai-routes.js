const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai-controller');
const auth = require('../middleware/AuthMiddleware');

// Protect this route so only authenticated users (or just faculty/admin) can use it
router.post('/analyze-syllabus', auth, aiController.analyzeSyllabus);

module.exports = router;
