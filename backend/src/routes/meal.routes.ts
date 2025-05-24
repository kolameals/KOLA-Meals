import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import prisma from '../lib/prisma';

const router = Router();

/**
 * Get all meals
 */
router.get('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const meals = await prisma.meal.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json({ success: true, data: meals });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching meals' });
  }
});

/**
 * Create a new meal (admin only)
 */
router.post('/', authMiddleware(['ADMIN']), validateRequest({
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
      category: { type: 'string' },
      image: { type: 'string' },
      type: { type: 'string', enum: ['BREAKFAST', 'LUNCH', 'DINNER'] }
    },
    required: ['name', 'description', 'price', 'category', 'type']
  }
}), async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, image, type } = req.body;

    const meal = await prisma.meal.create({
      data: {
        name,
        description,
        price,
        category,
        image,
        type
      }
    });

    res.status(201).json({ success: true, data: meal });
  } catch (error) {
    res.status(500).json({ error: 'Error creating meal' });
  }
});

/**
 * Update a meal (admin only)
 */
router.put('/:id', authMiddleware(['ADMIN']), validateRequest({
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
      category: { type: 'string' },
      image: { type: 'string' },
      type: { type: 'string', enum: ['BREAKFAST', 'LUNCH', 'DINNER'] }
    }
  }
}), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image, type } = req.body;

    const meal = await prisma.meal.update({
      where: { id },
      data: {
        name,
        description,
        price,
        category,
        image,
        type
      }
    });

    res.json({ success: true, data: meal });
  } catch (error) {
    res.status(500).json({ error: 'Error updating meal' });
  }
});

/**
 * Delete a meal (admin only)
 */
router.delete('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.meal.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting meal' });
  }
});

export default router; 