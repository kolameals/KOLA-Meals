import { Router } from 'express';
import { kitchenAnalyticsController } from '../controllers/kitchenAnalytics.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication and admin role check to all routes
router.use(authMiddleware(['ADMIN']));

// Get efficiency metrics
router.get('/efficiency-metrics', async (req, res) => {
  await kitchenAnalyticsController.getEfficiencyMetrics(req, res);
});

// Get cost analysis
router.get('/cost-analysis', async (req, res) => {
  await kitchenAnalyticsController.getCostAnalysis(req, res);
});

// Get resource utilization
router.get('/resource-utilization', async (req, res) => {
  await kitchenAnalyticsController.getResourceUtilization(req, res);
});

export default router; 