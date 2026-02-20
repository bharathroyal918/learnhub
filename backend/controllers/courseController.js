const Course = require('../models/Course');

// @desc    Get all courses (with optional filters)
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const { name, category } = req.query;
    const query = {};

    if (name) query.C_title = { $regex: name, $options: 'i' };
    if (category) query.C_categories = { $regex: category, $options: 'i' };

    const courses = await Course.find(query).select('-enrolled');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select('-enrolled');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Teacher
const createCourse = async (req, res) => {
  try {
    const { C_title, C_description, C_categories, C_price, thumbnail } = req.body;

    const course = await Course.create({
      userID: req.user._id,
      C_educator: req.user.name,
      C_title,
      C_description,
      C_categories,
      C_price: C_price || 0,
      thumbnail,
      sections: []
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Teacher (owner) / Admin
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.type !== 'admin' && course.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Teacher (owner, no enrolled students) / Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.type !== 'admin') {
      if (course.userID.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      if (course.enrolled.length > 0) {
        return res.status(400).json({ message: 'Cannot delete course with enrolled students' });
      }
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add section to course
// @route   POST /api/courses/:id/sections
// @access  Teacher (owner) / Admin
const addSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.type !== 'admin' && course.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, videoUrl, duration } = req.body;
    course.sections.push({ title, content, videoUrl, duration });
    await course.save();

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Student
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const alreadyEnrolled = course.enrolled.find(
      e => e.studentId.toString() === req.user._id.toString()
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    if (course.C_price > 0) {
      return res.status(402).json({ message: 'Payment required', price: course.C_price });
    }

    course.enrolled.push({ studentId: req.user._id });
    await course.save();

    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student progress
// @route   PUT /api/courses/:id/progress
// @access  Student
const updateProgress = async (req, res) => {
  try {
    const { sectionId } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollment = course.enrolled.find(
      e => e.studentId.toString() === req.user._id.toString()
    );
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });

    if (!enrollment.completedSections.includes(sectionId)) {
      enrollment.completedSections.push(sectionId);
    }
    enrollment.lastSection = sectionId;

    // Check if all sections completed
    if (enrollment.completedSections.length === course.sections.length) {
      enrollment.completed = true;
      enrollment.completedAt = new Date();
    }

    await course.save();
    res.json({ message: 'Progress updated', completed: enrollment.completed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's enrolled courses
// @route   GET /api/courses/enrolled/me
// @access  Student
const getMyEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      'enrolled.studentId': req.user._id
    }).select('-enrolled');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get teacher's courses
// @route   GET /api/courses/teacher/me
// @access  Teacher
const getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ userID: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addSection,
  enrollCourse,
  updateProgress,
  getMyEnrolledCourses,
  getTeacherCourses
};
