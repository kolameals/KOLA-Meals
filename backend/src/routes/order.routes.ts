import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import prisma from '../lib/prisma.js';
import { OrderStatus } from '@prisma/client';
import { AuthenticatedUser } from '../types/index.js';

const router = Router();

/**
 * Get all orders (admin only)
 */
router.get('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

/**
 * Get order by ID (admin and customer)
 */
router.get('/:orderId', authMiddleware(['ADMIN', 'CUSTOMER']), validateRequest({
  params: {
    type: 'object',
    required: ['orderId'],
    properties: {
      orderId: { type: 'string', format: 'uuid' }
    }
  }
}), async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // If user is customer, verify they own the order
    const user = req.user as AuthenticatedUser;
    if (user?.role === 'CUSTOMER' && order.userId !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order' });
  }
});

/**
 * Create new order (customer only)
 */
router.post('/', authMiddleware(['CUSTOMER']), validateRequest({
  body: {
    type: 'object',
    required: ['items'],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['mealId', 'quantity'],
          properties: {
            mealId: { type: 'string', format: 'uuid' },
            quantity: { type: 'integer', minimum: 1 }
          }
        }
      }
    }
  }
}), async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    const user = req.user as AuthenticatedUser;
    const userId = user.id;

    // Calculate total amount and validate meals
    const orderItems = await Promise.all(
      items.map(async (item: any) => {
        const meal = await prisma.meal.findUnique({
          where: { id: item.mealId }
        });

        if (!meal) {
          throw new Error(`Meal with ID ${item.mealId} not found`);
        }

        return {
          mealId: item.mealId,
          name: meal.name,
          quantity: item.quantity,
          price: meal.price
        };
      })
    );

    const totalAmount = orderItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Get user details
    const dbUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          amount: totalAmount,
          customerName: dbUser.name,
          customerEmail: dbUser.email,
          customerPhone: dbUser.phoneNumber,
          items: {
            create: orderItems
          }
        },
        include: {
          items: true,
          user: {
            select: {
              name: true,
              email: true,
              phoneNumber: true
            }
          }
        }
      });

      return newOrder;
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: 'Error creating order' });
  }
});

/**
 * Update order status (admin only)
 */
router.patch('/:orderId/status', authMiddleware(['ADMIN']), validateRequest({
  params: {
    type: 'object',
    required: ['orderId'],
    properties: {
      orderId: { type: 'string', format: 'uuid' }
    }
  },
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { 
        type: 'string',
        enum: Object.values(OrderStatus)
      }
    }
  }
}), async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Validate status transition
    if (!isValidStatusTransition(order.status, status)) {
      return res.status(400).json({ error: 'Invalid status transition' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        updatedAt: new Date()
      },
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true
          }
        }
      }
    });

    // If order is delivered, update inventory
    if (status === OrderStatus.DELIVERED) {
      await updateInventoryForDeliveredOrder(orderId);
    }

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: 'Error updating order status' });
  }
});

/**
 * Cancel order (admin and customer)
 */
router.post('/:orderId/cancel', authMiddleware(['ADMIN', 'CUSTOMER']), validateRequest({
  params: {
    type: 'object',
    required: ['orderId'],
    properties: {
      orderId: { type: 'string', format: 'uuid' }
    }
  }
}), async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const user = req.user as AuthenticatedUser;
    // If user is customer, verify they own the order
    if (user?.role === 'CUSTOMER' && order.userId !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only allow cancellation of pending or confirmed orders
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
      return res.status(400).json({ error: 'Cannot cancel order in current status' });
    }

    const cancelledOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        updatedAt: new Date()
      },
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true
          }
        }
      }
    });

    res.json({ success: true, data: cancelledOrder });
  } catch (error) {
    res.status(500).json({ error: 'Error cancelling order' });
  }
});

// Helper functions
function isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
    [OrderStatus.PREPARING]: [OrderStatus.READY_FOR_DELIVERY],
    [OrderStatus.READY_FOR_DELIVERY]: [OrderStatus.OUT_FOR_DELIVERY],
    [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: []
  };

  return validTransitions[currentStatus].includes(newStatus);
}

async function updateInventoryForDeliveredOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { 
      items: {
        include: {
          meal: true
        }
      }
    }
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Update inventory for each item
  for (const item of order.items) {
    const inventoryItem = await prisma.inventoryItem.findFirst({
      where: { name: item.meal.name }
    });

    if (inventoryItem) {
      await prisma.inventoryItem.update({
        where: { id: inventoryItem.id },
        data: {
          currentStock: {
            decrement: item.quantity
          }
        }
      });
    }
  }
}

export default router; 