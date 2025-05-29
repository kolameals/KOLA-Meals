import { Router } from 'express';
import { deliveryAssignmentController } from '../controllers/deliveryAssignment.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.get(
  '/',
  authenticateToken,
  authorizeRole([Role.ADMIN]),
  deliveryAssignmentController.getAssignments
);

router.get(
  '/current',
  authenticateToken,
  authorizeRole([Role.ADMIN]),
  deliveryAssignmentController.getCurrentAssignments
);

router.post(
  '/',
  authenticateToken,
  authorizeRole([Role.ADMIN]),
  deliveryAssignmentController.createAssignment
);

router.patch(
  '/:id',
  authenticateToken,
  authorizeRole([Role.ADMIN]),
  deliveryAssignmentController.updateAssignment
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole([Role.ADMIN]),
  deliveryAssignmentController.deleteAssignment
);

export default router; 