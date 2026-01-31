const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai-controller');
const auth = require('../middleware/AuthMiddleware');

// Protect this route so only authenticated users (or just faculty/admin) can use it
router.post('/analyze-syllabus', auth, aiController.analyzeSyllabus);

// Score a single proposal
router.post('/score/:requestId', auth, aiController.scoreProposal);

// Analyze all competing proposals for a curriculum
router.post('/analyze-competing/:curriculumId', auth, aiController.analyzeCompetingProposals);

// Get all pending proposals grouped by curriculum with scores
router.get('/pending-grouped', auth, aiController.getPendingGroupedByCurriculum);

// Batch score all unscored pending proposals
router.post('/batch-score', auth, aiController.batchScoreAllPending);

module.exports = router;
