import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { analyticsController } from '../controllers/analytics.controller.js';

const router = express.Router();

// Apply authentication middleware to all analytics routes
router.use(authMiddleware(['ADMIN']));

// Revenue data endpoint
router.get('/revenue', analyticsController.getRevenueData);

// Sales trends endpoint
router.get('/sales-trends', analyticsController.getSalesTrends);

// Performance metrics endpoint
router.get('/performance', analyticsController.getPerformanceMetrics);

export default router; 