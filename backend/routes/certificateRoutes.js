const express = require('express');
const router = express.Router();
const { downloadCertificate } = require('../controllers/certificateController');
const { protect, isStudent } = require('../middleware/authMiddleware');

router.get('/:courseId', protect, isStudent, downloadCertificate);

module.exports = router;
