const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String },
  duration: { type: Number, default: 0 } // in minutes
});

const enrolledStudentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enrolledAt: { type: Date, default: Date.now },
  completedSections: [{ type: mongoose.Schema.Types.ObjectId }],
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  lastSection: { type: mongoose.Schema.Types.ObjectId } // last section accessed
});

const courseSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Teacher's ID
  C_educator: { type: String, required: true },
  C_categories: { type: String, required: true },
  C_title: { type: String, required: true },
  C_description: { type: String, required: true },
  sections: [sectionSchema],
  C_price: { type: Number, default: 0 }, // 0 = free
  enrolled: [enrolledStudentSchema],
  thumbnail: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
