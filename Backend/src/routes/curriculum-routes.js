const express = require('express');
const router = express.Router();
const curriculumController = require('../controllers/curriculum-controller');

router.get('/', curriculumController.getAllCurricula);
router.get('/seed', curriculumController.seedCurriculum); // Dev only
router.get('/:id', curriculumController.getCurriculumById);
router.post('/', curriculumController.createCurriculum);

module.exports = router;
