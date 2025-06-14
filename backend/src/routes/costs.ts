import { Router, Request, Response } from 'express';
import {
  getStaffCosts,
  getStaffCostById,
  createStaffCost,
  getEquipmentCosts,
  getEquipmentCostById,
  createEquipmentCost,
  getFacilityCosts,
  getFacilityCostById,
  createFacilityCost,
  getCostSummary,
  getCostCategories,
  getDeliveryCostConfig,
  updateDeliveryCostConfig
} from '../controllers/cost.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';

const router = Router();

// Delivery cost configuration
router.get('/delivery-cost-config', authMiddleware(['ADMIN']), getDeliveryCostConfig);
router.put('/delivery-cost-config', authMiddleware(['ADMIN']), updateDeliveryCostConfig);

// Staff costs
router.get('/staff', authMiddleware(['ADMIN']), getStaffCosts);
router.get('/staff/:id', authMiddleware(['ADMIN']), getStaffCostById);
router.post('/staff', authMiddleware(['ADMIN']), createStaffCost);

// Equipment costs
router.get('/equipment', authMiddleware(['ADMIN']), getEquipmentCosts);
router.get('/equipment/:id', authMiddleware(['ADMIN']), getEquipmentCostById);
router.post('/equipment', authMiddleware(['ADMIN']), createEquipmentCost);

// Facility costs
router.get('/facility', authMiddleware(['ADMIN']), getFacilityCosts);
router.get('/facility/:id', authMiddleware(['ADMIN']), getFacilityCostById);
router.post('/facility', authMiddleware(['ADMIN']), createFacilityCost);

// Cost summary and categories
router.get('/summary', authMiddleware(['ADMIN']), getCostSummary);
router.get('/categories', authMiddleware(['ADMIN']), getCostCategories);

export default router; 