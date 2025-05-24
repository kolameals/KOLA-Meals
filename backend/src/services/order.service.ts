import { PrismaClient, OrderStatus } from '@prisma/client';
import { AppError } from '../types/error.types';
import logger from '../config/logger.config';

export class OrderService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllOrders() {
    try {
      const orders = await this.prisma.order.findMany({
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

      return orders;
    } catch (error) {
      logger.error('Error fetching orders:', { error });
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching orders', 500);
    }
  }

  async getOrderById(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
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
        throw new AppError('Order not found', 404);
      }

      return order;
    } catch (error) {
      logger.error('Error fetching order by ID:', { error, orderId: id });
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching order', 500);
    }
  }

  async createOrder(data: any, userId: string) {
    try {
      const { items, deliveryAddress, deliveryInstructions } = data;

      // Validate user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Calculate total amount and validate meals
      const orderItems = await Promise.all(
        items.map(async (item: any) => {
          const meal = await this.prisma.meal.findUnique({
            where: { id: item.mealId }
          });

          if (!meal) {
            throw new AppError(`Meal with ID ${item.mealId} not found`, 404);
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

      // Create order with items in a transaction
      const order = await this.prisma.$transaction(async (prisma) => {
        const newOrder = await prisma.order.create({
          data: {
            userId,
            status: OrderStatus.PENDING,
            amount: totalAmount,
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.phoneNumber,
            deliveryAddress,
            deliveryInstructions,
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

      return order;
    } catch (error) {
      logger.error('Error creating order:', { error });
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating order', 500);
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id }
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      // Validate status transition
      if (!this.isValidStatusTransition(order.status, status)) {
        throw new AppError('Invalid status transition', 400);
      }

      const updatedOrder = await this.prisma.order.update({
        where: { id },
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
        await this.updateInventoryForDeliveredOrder(id);
      }

      return updatedOrder;
    } catch (error) {
      logger.error('Error updating order status:', { error, orderId: id, status });
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating order status', 500);
    }
  }

  async deleteOrder(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id }
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      await this.prisma.order.delete({
        where: { id }
      });
    } catch (error) {
      logger.error('Error deleting order:', { error, orderId: id });
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting order', 500);
    }
  }

  // Helper methods
  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
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

  private async updateInventoryForDeliveredOrder(orderId: string) {
    try {
      const order = await this.prisma.order.findUnique({
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
        throw new AppError('Order not found', 404);
      }

      // Update inventory for each item
      for (const item of order.items) {
        const inventoryItem = await this.prisma.inventoryItem.findFirst({
          where: { name: item.meal.name }
        });

        if (inventoryItem) {
          await this.prisma.inventoryItem.update({
            where: { id: inventoryItem.id },
            data: {
              currentStock: {
                decrement: item.quantity
              }
            }
          });
        }
      }
    } catch (error) {
      logger.error('Error updating inventory for delivered order:', { error, orderId });
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating inventory', 500);
    }
  }
} 