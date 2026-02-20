const PDFDocument = require('pdfkit');
const Course = require('../models/Course');

// @desc    Download certificate
// @route   GET /api/certificate/:courseId
// @access  Student
const downloadCertificate = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollment = course.enrolled.find(
      e => e.studentId.toString() === req.user._id.toString()
    );

    if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });
    if (!enrollment.completed) return res.status(400).json({ message: 'Course not completed yet' });

    // All validation passed — safe to begin streaming PDF response
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${course.C_title}.pdf`);

    // Handle stream errors after piping has started
    doc.on('error', (err) => {
      console.error('PDF generation error:', err);
      // Cannot send HTTP error at this point since headers are sent
    });

    doc.pipe(res);

    // Certificate design
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f4ff');

    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .stroke('#2563eb');

    doc.fillColor('#1e3a5f').fontSize(40).font('Helvetica-Bold')
      .text('Certificate of Completion', 0, 80, { align: 'center' });

    doc.moveDown();
    doc.fillColor('#555').fontSize(18).font('Helvetica')
      .text('This is to certify that', { align: 'center' });

    doc.moveDown(0.5);
    doc.fillColor('#2563eb').fontSize(32).font('Helvetica-Bold')
      .text(req.user.name, { align: 'center' });

    doc.moveDown(0.5);
    doc.fillColor('#555').fontSize(18).font('Helvetica')
      .text('has successfully completed the course', { align: 'center' });

    doc.moveDown(0.5);
    doc.fillColor('#1e3a5f').fontSize(28).font('Helvetica-Bold')
      .text(course.C_title, { align: 'center' });

    doc.moveDown(0.5);
    doc.fillColor('#555').fontSize(14).font('Helvetica')
      .text(`Educator: ${course.C_educator}`, { align: 'center' });

    doc.moveDown(0.5);
    doc.fillColor('#555').fontSize(14).font('Helvetica')
      .text(`Date: ${new Date(enrollment.completedAt).toLocaleDateString()}`, { align: 'center' });

    doc.moveDown(2);
    doc.fillColor('#2563eb').fontSize(14).font('Helvetica-Bold')
      .text('LearnHub - Your Center for Skill Enhancement', { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { downloadCertificate };
