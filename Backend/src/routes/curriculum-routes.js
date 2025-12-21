const express = require('express');
const router = express.Router();
const curriculumController = require('../controllers/curriculum-controller');
const auth = require('../middleware/AuthMiddleware');

router.get('/', curriculumController.getAllCurricula);
router.get('/seed', curriculumController.seedCurriculum);

// New Routes
router.get('/course/:courseId', curriculumController.getSubjectsByCourse);
router.get('/history/code/:code', auth, curriculumController.getCurriculumHistory);

router.get('/:id', curriculumController.getCurriculumById);
router.post('/', auth, curriculumController.createSubject);
router.put('/:id', auth, curriculumController.updateSubjectDirectly);
router.delete('/:id', auth, curriculumController.deleteSubject);

module.exports = router;
