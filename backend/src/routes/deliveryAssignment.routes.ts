import { Router, Request, Response } from 'express';
import { deliveryAssignmentController } from '../controllers/deliveryAssignment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

// Get all assignments
router.get(
  '/',
  authMiddleware([Role.ADMIN, Role.DELIVERY_PARTNER]),
  deliveryAssignmentController.getAssignments
);

// Create team assignment
router.post(
  '/team',
  authMiddleware([Role.ADMIN]),
  deliveryAssignmentController.createTeamAssignment
);

// Update assignment
router.put(
  '/:id',
  authMiddleware([Role.ADMIN]),
  deliveryAssignmentController.updateAssignment
);

// Delete assignment
router.delete(
  '/:id',
  authMiddleware([Role.ADMIN]),
  deliveryAssignmentController.deleteAssignment
);

// Get current assignments
router.get(
  '/current',
  authMiddleware([Role.ADMIN, Role.DELIVERY_PARTNER]),
  deliveryAssignmentController.getCurrentAssignments
);

// Get team assignments
router.get(
  '/apartment/:apartmentId',
  authMiddleware([Role.ADMIN, Role.DELIVERY_PARTNER]),
  deliveryAssignmentController.getTeamAssignments
);

export default router; 