const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getAllEnrollments, getStats, getAllCourses } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/enrollments', getAllEnrollments);
router.get('/courses', getAllCourses);

module.exports = router;
