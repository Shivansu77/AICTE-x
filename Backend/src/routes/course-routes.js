const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course-controller');
const auth = require('../middleware/AuthMiddleware');

// Protect all routes? For now, yes.
// In future, getCourses might be public.
router.post('/', auth, courseController.createCourse);
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', auth, courseController.updateCourse);
router.delete('/:id', auth, courseController.deleteCourse);

router.post('/seed', auth, courseController.seedCourses);
module.exports = router;
