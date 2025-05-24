import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { analyticsController } from '../controllers/analytics.controller';

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