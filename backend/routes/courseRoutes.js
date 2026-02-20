const express = require('express');
const router = express.Router();
const {
  getCourses, getCourseById, createCourse, updateCourse, deleteCourse,
  addSection, enrollCourse, updateProgress, getMyEnrolledCourses, getTeacherCourses
} = require('../controllers/courseController');
const { protect, isTeacher, isStudent } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/enrolled/me', protect, isStudent, getMyEnrolledCourses);
router.get('/teacher/me', protect, isTeacher, getTeacherCourses);
router.get('/:id', getCourseById);

router.post('/', protect, isTeacher, createCourse);
router.put('/:id', protect, isTeacher, updateCourse);
router.delete('/:id', protect, isTeacher, deleteCourse);
router.post('/:id/sections', protect, isTeacher, addSection);

router.post('/:id/enroll', protect, isStudent, enrollCourse);
router.put('/:id/progress', protect, isStudent, updateProgress);

module.exports = router;
