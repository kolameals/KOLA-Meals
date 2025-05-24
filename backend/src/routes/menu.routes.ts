import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { menuService } from '../services/menu.service';
import {
  createMenuItemSchema,
  updateMenuItemSchema,
  createDailyMenuSchema,
  updateDailyMenuSchema,
  createMenuCalendarSchema,
  updateMenuCalendarSchema,
} from '../types/menu.types';
import { ZodError } from 'zod';

const router = express.Router();

// Menu Item Routes
router.post(
  '/items',
  authMiddleware(['ADMIN']),
  async (req, res) => {
    try {
      const data = createMenuItemSchema.parse(req.body);
      const menuItem = await menuService.createMenuItem(data);
      res.status(201).json(menuItem);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);

router.put(
  '/items/:id',
  authMiddleware(['ADMIN']),
  async (req, res) => {
    try {
      const data = updateMenuItemSchema.parse(req.body);
      const menuItem = await menuService.updateMenuItem(req.params.id, data);
      res.json(menuItem);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);

router.delete(
  '/items/:id',
  authMiddleware(['ADMIN']),
  async (req, res) => {
    try {
      await menuService.deleteMenuItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Daily Menu Routes
router.post(
  '/daily',
  authMiddleware(['ADMIN']),
  async (req, res) => {
    try {
      const data = createDailyMenuSchema.parse(req.body);
      const dailyMenu = await menuService.createDailyMenu(data);
      res.status(201).json(dailyMenu);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);

router.put(
  '/daily/:id',
  authMiddleware(['ADMIN']),
  async (req, res) => {
    try {
      const data = updateDailyMenuSchema.parse(req.body);
      const dailyMenu = await menuService.updateDailyMenu(req.params.id, data);
      res.json(dailyMenu);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);

router.get(
  '/daily/:id',
  authMiddleware(['ADMIN', 'CUSTOMER']),
  async (req, res) => {
    try {
      const dailyMenu = await menuService.getDailyMenuById(req.params.id);
      if (!dailyMenu) {
        return res.status(404).json({ error: 'Daily menu not found' });
      }
      res.json(dailyMenu);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get(
  '/daily/date/:date',
  authMiddleware(['ADMIN', 'CUSTOMER']),
  async (req, res) => {
    try {
      const date = new Date(req.params.date);
      const dailyMenu = await menuService.getDailyMenuByDate(date);
      if (!dailyMenu) {
        return res.status(404).json({ error: 'Daily menu not found' });
      }
      res.json(dailyMenu);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Menu Calendar Routes
router.post(
  '/',
  authMiddleware(['ADMIN']),
  async (req, res) => {
    try {
      const data = createMenuCalendarSchema.parse(req.body);
      const menuCalendar = await menuService.createMenuCalendar(data);
      res.status(201).json(menuCalendar);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);

router.put(
  '/:id',
  authMiddleware(['ADMIN']),
  async (req, res) => {
    try {
      const data = updateMenuCalendarSchema.parse(req.body);
      const menuCalendar = await menuService.updateMenuCalendar(req.params.id, data);
      res.json(menuCalendar);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);

router.get(
  '/:id',
  authMiddleware(['ADMIN', 'CUSTOMER']),
  async (req, res) => {
    try {
      const menuCalendar = await menuService.getMenuCalendarById(req.params.id);
      if (!menuCalendar) {
        return res.status(404).json({ error: 'Menu calendar not found' });
      }
      res.json(menuCalendar);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get(
  '/',
  authMiddleware(['ADMIN', 'CUSTOMER']),
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }
      const menuCalendar = await menuService.getMenuCalendarByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      if (!menuCalendar) {
        return res.status(404).json({ error: 'Menu calendar not found' });
      }
      res.json(menuCalendar);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router; 