import { Router, Request, Response, NextFunction } from 'express';
import { feedbackService } from '../services/feedback.service.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { z } from 'zod';
import type { FeedbackType, FeedbackStatus, IssuePriority, IssueStatus } from '../services/feedback.service.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = Router();

// Get all feedbacks with optional filters
router.get(
  '/',
  authMiddleware(['ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = {
        type: req.query.type as FeedbackType | undefined,
        status: req.query.status as FeedbackStatus | undefined,
        userId: req.query.userId as string | undefined,
      };
      const feedbacks = await feedbackService.getFeedbacks(filters);
      res.json(feedbacks);
    } catch (error) {
      next(error);
    }
  }
);

// Get feedback by ID
router.get(
  '/:id',
  authMiddleware(['ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feedback = await feedbackService.getFeedbackById(req.params.id);
      res.json(feedback);
    } catch (error) {
      next(error);
    }
  }
);

// Create new feedback
router.post(
  '/',
  authMiddleware(['CUSTOMER', 'ADMIN']),
  validateRequest({
    body: z.object({
      type: z.enum(['GENERAL', 'MEAL_QUALITY', 'DELIVERY', 'SERVICE', 'OTHER'] as const),
      title: z.string(),
      description: z.string(),
      rating: z.number().optional(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feedback = await feedbackService.createFeedback({
        userId: (req as AuthenticatedRequest).user!.id,
        type: req.body.type,
        title: req.body.title,
        description: req.body.description,
        rating: req.body.rating,
      });
      res.json(feedback);
    } catch (error) {
      next(error);
    }
  }
);

// Update feedback status
router.patch(
  '/:id/status',
  authMiddleware(['ADMIN']),
  validateRequest({
    body: z.object({
      status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feedback = await feedbackService.updateFeedbackStatus(
        req.params.id,
        req.body.status
      );
      res.json(feedback);
    } catch (error) {
      next(error);
    }
  }
);

// Add response to feedback
router.post(
  '/:id/responses',
  authMiddleware(['ADMIN']),
  validateRequest({
    body: z.object({
      message: z.string(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await feedbackService.addResponse({
        feedbackId: req.params.id,
        userId: (req as AuthenticatedRequest).user!.id,
        message: req.body.message,
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// Create issue from feedback
router.post(
  '/:id/issues',
  authMiddleware(['ADMIN']),
  validateRequest({
    body: z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const),
      assignedTo: z.string().optional(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const issue = await feedbackService.createIssue({
        feedbackId: req.params.id,
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        assignedTo: req.body.assignedTo,
      });
      res.json(issue);
    } catch (error) {
      next(error);
    }
  }
);

// Update issue status
router.patch(
  '/issues/:id/status',
  authMiddleware(['ADMIN']),
  validateRequest({
    body: z.object({
      status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const issue = await feedbackService.updateIssueStatus(
        req.params.id,
        req.body.status
      );
      res.json(issue);
    } catch (error) {
      next(error);
    }
  }
);

// Assign issue
router.patch(
  '/issues/:id/assign',
  authMiddleware(['ADMIN']),
  validateRequest({
    body: z.object({
      userId: z.string(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const issue = await feedbackService.assignIssue(
        req.params.id,
        req.body.userId
      );
      res.json(issue);
    } catch (error) {
      next(error);
    }
  }
);

export default router; 