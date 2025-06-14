import { Router, Request, Response } from 'express';
import { customerAnalyticsController } from '../controllers/customerAnalytics.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware(['ADMIN']));

// Customer behavior analytics
router.get('/behavior', customerAnalyticsController.getCustomerBehavior);

// Customer preferences analytics
router.get('/preferences', customerAnalyticsController.getCustomerPreferences);

// Customer feedback analysis
router.get('/feedback', customerAnalyticsController.getFeedbackAnalysis);

export default router; 