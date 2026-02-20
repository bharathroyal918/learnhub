const Course = require('../models/Course');

// @desc    Create payment intent
// @route   POST /api/payment/create-payment-intent
// @access  Student
const createPaymentIntent = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: 'Payment processing is not configured on this server.' });
    }
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.C_price * 100, // Convert to cents
      currency: 'usd',
      metadata: { courseId: courseId.toString(), userId: req.user._id.toString() }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm payment and enroll student
// @route   POST /api/payment/confirm
// @access  Student
const confirmPaymentAndEnroll = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const alreadyEnrolled = course.enrolled.find(
      e => e.studentId.toString() === req.user._id.toString()
    );
    if (!alreadyEnrolled) {
      course.enrolled.push({ studentId: req.user._id });
      await course.save();
    }

    res.json({ message: 'Payment confirmed and enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentIntent, confirmPaymentAndEnroll };
