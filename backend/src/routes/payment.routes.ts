import { Router, Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';

const router = Router();

// Create payment
router.post(
  '/create',
  authMiddleware(['CUSTOMER']),
  validateRequest({
    body: {
      type: 'object',
      required: ['amount', 'currency', 'customerName', 'customerEmail', 'customerPhone'],
      properties: {
        amount: { type: 'number', minimum: 1 },
        currency: { type: 'string', enum: ['INR'] },
        customerName: { type: 'string', minLength: 1 },
        customerEmail: { type: 'string', format: 'email' },
        customerPhone: { type: 'string', pattern: '^[0-9]{10}$' }
      }
    }
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as { id: string };
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const paymentDetails = {
        orderId,
        ...req.body
      };
      const payment = await paymentService.createPayment(user.id, paymentDetails);
      res.json(payment);
    } catch (error) {
      next(error);
    }
  }
);

// Verify payment
router.post(
  '/verify',
  authMiddleware(['CUSTOMER']),
  validateRequest({
    body: {
      type: 'object',
      required: ['orderId', 'paymentSessionId'],
      properties: {
        orderId: { type: 'string' },
        paymentSessionId: { type: 'string' }
      }
    }
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as { id: string };
      const result = await paymentService.verifyPayment(user.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Webhook endpoint
router.post(
  '/webhook',
  async (req, res, next) => {
    try {
      await paymentService.handleWebhook(req.body);
      res.status(200).send('OK');
    } catch (error) {
      next(error);
    }
  }
);

export default router; 