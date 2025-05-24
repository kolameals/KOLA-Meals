import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthenticatedUser } from '../types';
import {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription
} from '../services/subscription.service';
import prisma from '../lib/prisma';

const router = Router();

// Create subscription
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    const subscription = await createSubscription({
      userId: user.id,
      ...req.body
    });
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Error creating subscription' });
  }
});

// Get subscription
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    const subscription = await getSubscription(user.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subscription' });
  }
});

// Update subscription
router.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    const subscription = await updateSubscription(user.id, req.body);
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Error updating subscription' });
  }
});

// Cancel subscription
router.delete('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    const subscription = await cancelSubscription(user.id);
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Error canceling subscription' });
  }
});

// Pause subscription
router.post('/pause', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    const subscription = await pauseSubscription(user.id);
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Error pausing subscription' });
  }
});

// Resume subscription
router.post('/resume', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    const subscription = await resumeSubscription(user.id);
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Error resuming subscription' });
  }
});

// Get all subscriptions
router.get('/all', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  // ... existing code ...
});

export default router; 