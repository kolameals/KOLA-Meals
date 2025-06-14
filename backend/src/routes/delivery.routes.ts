import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  createDelivery,
  getDelivery,
  updateDeliveryStatus,
  getDeliveriesByUser,
  getPendingDeliveries
} from '../services/delivery.service.js';
import prisma from '../lib/prisma.js';

const router = Router();

// Create delivery (admin only)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const delivery = await createDelivery(req.body);
    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ error: 'Error creating delivery' });
  }
});

// Get delivery details
router.get('/:deliveryId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const delivery = await getDelivery(req.params.deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching delivery' });
  }
});

// Update delivery status (admin and delivery partner)
router.patch('/:deliveryId/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const delivery = await updateDeliveryStatus(req.params.deliveryId, status);
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: 'Error updating delivery status' });
  }
});

// Get user's deliveries
router.get('/my-deliveries', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userObj = req.user as import('../types/index.js').AuthenticatedUser;
    const deliveries = await getDeliveriesByUser(userObj.id);
    res.json({ success: true, data: deliveries });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching deliveries' });
  }
});

// Get pending deliveries (admin and delivery partner)
router.get('/pending', authMiddleware, async (req: Request, res: Response) => {
  try {
    const deliveries = await getPendingDeliveries();
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pending deliveries' });
  }
});

// Get all deliveries
router.get('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  // ... existing code ...
});

export default router; 