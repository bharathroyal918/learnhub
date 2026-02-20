const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPaymentAndEnroll } = require('../controllers/paymentController');
const { protect, isStudent } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', protect, isStudent, createPaymentIntent);
router.post('/confirm', protect, isStudent, confirmPaymentAndEnroll);

module.exports = router;
