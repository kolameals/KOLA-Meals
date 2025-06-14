import { Router, Request, Response } from 'express';
import { productionService } from '../services/production.service.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import prisma from '../lib/prisma.js';

const router = Router();

// Get all production schedules (optionally filter by date/mealType)
router.get('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { date, mealType } = req.query;
    const schedules = await productionService.getSchedules({
      startDate: date ? new Date(date as string) : undefined,
      mealType: mealType as any
    });
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching production schedules:', error);
    res.status(500).json({ error: 'Failed to fetch production schedules' });
  }
});

// Get a single production schedule by ID
router.get('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const schedule = await productionService.getScheduleById(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    res.json(schedule);
  } catch (error) {
    console.error('Error fetching production schedule:', error);
    res.status(500).json({ error: 'Failed to fetch production schedule' });
  }
});

// Create a new production schedule
router.post('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const schedule = await productionService.createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating production schedule:', error);
    res.status(500).json({ error: 'Failed to create production schedule' });
  }
});

// Update a production schedule
router.put('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const schedule = await productionService.updateSchedule(req.params.id, req.body);
    res.json(schedule);
  } catch (error) {
    console.error('Error updating production schedule:', error);
    res.status(500).json({ error: 'Failed to update production schedule' });
  }
});

// Delete a production schedule
router.delete('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    await productionService.deleteSchedule(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting production schedule:', error);
    res.status(500).json({ error: 'Failed to delete production schedule' });
  }
});

// Update a production item (actual quantity, status)
router.patch('/item/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const item = await productionService.updateProductionItem(req.params.id, req.body);
    res.json(item);
  } catch (error) {
    console.error('Error updating production item:', error);
    res.status(500).json({ error: 'Failed to update production item' });
  }
});

// Auto-generate a production schedule for a date/mealType
router.post('/auto-generate', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { date, mealType, startTime, endTime } = req.body;
    const schedule = await productionService.autoGenerateSchedule(date, mealType);
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error auto-generating production schedule:', error);
    const message = error instanceof Error ? error.message : 'Failed to auto-generate production schedule';
    res.status(500).json({ error: message });
  }
});

export default router; 