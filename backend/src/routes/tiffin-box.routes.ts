import { Router } from 'express';
import { tiffinBoxService } from '../services/tiffin-box.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

// Get available tiffin boxes
router.get(
  '/available',
  authMiddleware(['ADMIN', 'DELIVERY_PARTNER']),
  async (req, res, next) => {
    try {
      const boxes = await tiffinBoxService.getAvailableTiffinBoxes();
      res.json(boxes);
    } catch (error) {
      next(error);
    }
  }
);

// Get damaged tiffin boxes
router.get(
  '/damaged',
  authMiddleware(['ADMIN']),
  async (req, res, next) => {
    try {
      const boxes = await tiffinBoxService.getDamagedBoxes();
      res.json(boxes);
    } catch (error) {
      next(error);
    }
  }
);

// Report damage
router.post(
  '/:boxId/damage',
  authMiddleware(['ADMIN', 'DELIVERY_PARTNER']),
  validateRequest({
    body: z.object({
      damageReport: z.string()
    })
  }),
  async (req, res, next) => {
    try {
      const box = await tiffinBoxService.reportDamage(
        req.params.boxId,
        req.body.damageReport
      );
      res.json(box);
    } catch (error) {
      next(error);
    }
  }
);

// Update status
router.patch(
  '/:boxId/status',
  authMiddleware(['ADMIN']),
  validateRequest({
    body: z.object({
      status: z.enum(['AVAILABLE', 'IN_USE', 'DAMAGED', 'RETIRED'])
    })
  }),
  async (req, res, next) => {
    try {
      const box = await tiffinBoxService.updateStatus(
        req.params.boxId,
        req.body.status
      );
      res.json(box);
    } catch (error) {
      next(error);
    }
  }
);

// Create new tiffin box
router.post(
  '/',
  authMiddleware(['ADMIN']),
  async (req, res, next) => {
    try {
      const box = await tiffinBoxService.createTiffinBox();
      res.json(box);
    } catch (error) {
      next(error);
    }
  }
);

export default router; 