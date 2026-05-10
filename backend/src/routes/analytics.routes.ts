import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

// Admin analytics
router.get('/dashboard', authMiddleware, adminOnly, analyticsController.getDashboardAnalytics);

// Student analytics
router.get('/student', authMiddleware, analyticsController.getStudentAnalytics);

// Course analytics
router.get('/courses', authMiddleware, adminOnly, analyticsController.getCourseAnalytics);

export default router;
