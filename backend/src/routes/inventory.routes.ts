import { Router, Request, Response, NextFunction } from 'express';
import { inventoryService } from '../services/inventory.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { z } from 'zod';
import prisma from '../lib/prisma';

const router = Router();

// Get all inventory items
router.get(
  '/',
  authMiddleware(['ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await inventoryService.getInventoryItems();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }
);

// Get low stock items
router.get(
  '/low-stock',
  authMiddleware(['ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await inventoryService.getLowStockItems();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }
);

// Create new inventory item
router.post(
  '/',
  authMiddleware(['ADMIN']),
  validateRequest({
    body: z.object({
      name: z.string(),
      currentStock: z.number().min(0),
      minimumStock: z.number().min(0),
      unit: z.string()
    })
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await inventoryService.createInventoryItem(
        req.body.name,
        req.body.currentStock,
        req.body.minimumStock,
        req.body.unit
      );
      res.json(item);
    } catch (error) {
      next(error);
    }
  }
);

// Update stock
router.patch(
  '/:itemId/stock',
  authMiddleware(['ADMIN']),
  validateRequest({
    body: z.object({
      quantity: z.number().min(0)
    })
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await inventoryService.updateStock(
        req.params.itemId,
        req.body.quantity
      );
      res.json(item);
    } catch (error) {
      next(error);
    }
  }
);

// Record waste
router.post(
  '/:itemId/waste',
  authMiddleware(['ADMIN']),
  validateRequest({
    body: z.object({
      quantity: z.number().min(0),
      reason: z.string()
    })
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await inventoryService.recordWaste(
        req.params.itemId,
        req.body.quantity,
        req.body.reason
      );
      res.json(item);
    } catch (error) {
      next(error);
    }
  }
);

// Get waste records
router.get(
  '/waste-records',
  authMiddleware(['ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const records = await inventoryService.getWasteRecords();
      res.json(records);
    } catch (error) {
      next(error);
    }
  }
);

export default router; 