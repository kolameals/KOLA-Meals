import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { UserRole } from '../types/user.types';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getDeliveryPartners,
  createDeliveryPartner
} from '../controllers/userManagement.controller';

const router = express.Router();

// User Management Routes
router.get(
  '/users',
  authMiddleware([UserRole.ADMIN]),
  getUsers
);

router.post(
  '/users',
  authMiddleware([UserRole.ADMIN]),
  createUser
);

router.put(
  '/users/:id',
  authMiddleware([UserRole.ADMIN]),
  updateUser
);

router.delete(
  '/users/:id',
  authMiddleware([UserRole.ADMIN]),
  deleteUser
);

// Delivery Partner Routes
router.get(
  '/users/delivery-partners',
  authMiddleware([UserRole.ADMIN]),
  getDeliveryPartners
);

router.post(
  '/users/delivery-partners',
  authMiddleware([UserRole.ADMIN]),
  createDeliveryPartner
);

export default router; 