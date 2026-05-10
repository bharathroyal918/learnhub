import express, { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.emailPasswordLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);

export default router;
