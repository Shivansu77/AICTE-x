const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings-controller');
const { protect, adminOnly } = require('../middleware/AuthMiddleware');

// All routes require admin authentication
router.use(protect);
router.use(adminOnly);

// AI Configuration
router.get('/ai-config', settingsController.getAiConfig);
router.put('/ai-config', settingsController.updateAiConfig);
router.post('/ai-config/test', settingsController.testAiConnection);

module.exports = router;
