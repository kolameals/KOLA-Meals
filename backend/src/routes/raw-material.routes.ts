import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import prisma from '../lib/prisma.js';

const router = Router();

// Get all raw materials
router.get('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const rawMaterials = await prisma.rawMaterial.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(rawMaterials);
  } catch (error) {
    console.error('Error fetching raw materials:', error);
    res.status(500).json({ error: 'Failed to fetch raw materials' });
  }
});

// Get raw material by ID
router.get('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const rawMaterial = await prisma.rawMaterial.findUnique({
      where: { id: req.params.id }
    });
    if (!rawMaterial) {
      return res.status(404).json({ error: 'Raw material not found' });
    }
    res.json(rawMaterial);
  } catch (error) {
    console.error('Error fetching raw material:', error);
    res.status(500).json({ error: 'Failed to fetch raw material' });
  }
});

// Create raw material (admin only)
router.post('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const rawMaterial = await prisma.rawMaterial.create({
      data: req.body
    });
    res.status(201).json(rawMaterial);
  } catch (error) {
    console.error('Error creating raw material:', error);
    res.status(500).json({ error: 'Failed to create raw material' });
  }
});

// Update raw material (admin only)
router.put('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const rawMaterial = await prisma.rawMaterial.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(rawMaterial);
  } catch (error) {
    console.error('Error updating raw material:', error);
    res.status(500).json({ error: 'Failed to update raw material' });
  }
});

// Delete raw material (admin only)
router.delete('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    await prisma.rawMaterial.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting raw material:', error);
    res.status(500).json({ error: 'Failed to delete raw material' });
  }
});

// Update stock (admin only)
router.patch('/:id/stock', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    const rawMaterial = await prisma.rawMaterial.update({
      where: { id: req.params.id },
      data: {
        currentStock: quantity,
        lastUpdated: new Date()
      }
    });
    res.json(rawMaterial);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

export default router; 