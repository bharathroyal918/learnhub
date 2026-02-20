const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all enrolled students across all courses
// @route   GET /api/admin/enrollments
// @access  Admin
const getAllEnrollments = async (req, res) => {
  try {
    const courses = await Course.find().populate('enrolled.studentId', 'name email');
    const enrollments = [];
    courses.forEach(course => {
      course.enrolled.forEach(e => {
        enrollments.push({
          courseId: course._id,
          courseTitle: course.C_title,
          student: e.studentId,
          enrolledAt: e.enrolledAt,
          completed: e.completed
        });
      });
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ type: 'student' });
    const totalTeachers = await User.countDocuments({ type: 'teacher' });
    const totalCourses = await Course.countDocuments();
    const courses = await Course.find();
    const totalEnrollments = courses.reduce((sum, c) => sum + c.enrolled.length, 0);

    res.json({ totalUsers, totalStudents, totalTeachers, totalCourses, totalEnrollments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all courses (admin view with enrollment info)
// @route   GET /api/admin/courses
// @access  Admin
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('userID', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, deleteUser, getAllEnrollments, getStats, getAllCourses };
