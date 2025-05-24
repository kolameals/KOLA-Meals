import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { AppError } from '../types/error.types';
import logger from '../config/logger.config';
import { AuthenticatedUser } from '../types';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  getAllOrders = async (req: Request, res: Response) => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      logger.error('Error fetching orders:', { error });
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getOrderById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id);
      if (!order) {
        throw new AppError('Order not found', 404);
      }
      res.json(order);
    } catch (error) {
      logger.error('Error fetching order:', { error, orderId: req.params.id });
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  createOrder = async (req: Request, res: Response) => {
    try {
      const orderData = req.body;
      const userId = (req.user as AuthenticatedUser).id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }
      const order = await this.orderService.createOrder(orderData, userId);
      res.status(201).json(order);
    } catch (error) {
      logger.error('Error creating order:', { error });
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await this.orderService.updateOrderStatus(id, status);
      if (!order) {
        throw new AppError('Order not found', 404);
      }
      res.json(order);
    } catch (error) {
      logger.error('Error updating order status:', { error, orderId: req.params.id });
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  deleteOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.orderService.deleteOrder(id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting order:', { error, orderId: req.params.id });
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
} 