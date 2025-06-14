import { Request, Response } from 'express';
import { PrismaClient, OrderStatus, Order, OrderItem, Meal } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

interface GroupedOrderData {
  amount: number;
  orderCount: number;
}

interface ItemSales {
  quantity: number;
  revenue: number;
}

interface TopSellingItem {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

interface OrderWithItems extends Order {
  items: OrderItem[];
}

const analyticsFiltersSchema = z.object({
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  groupBy: z.enum(['day', 'week', 'month']).optional(),
});

export const analyticsController = {
  async getRevenueData(req: Request, res: Response) {
    try {
      const { startDate, endDate, groupBy = 'day' } = analyticsFiltersSchema.parse(req.query);

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: OrderStatus.DELIVERED,
        },
        include: {
          items: true,
        },
      }) as OrderWithItems[];

      // Group orders by date
      const groupedOrders = orders.reduce((acc: Record<string, GroupedOrderData>, order: OrderWithItems) => {
        const date = order.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {
            amount: 0,
            orderCount: 0,
          };
        }
        acc[date].amount += order.amount;
        acc[date].orderCount += 1;
        return acc;
      }, {});

      // Calculate average order value
      const revenueData = Object.entries(groupedOrders).map(([date, data]) => ({
        date,
        amount: data.amount,
        orderCount: data.orderCount,
        averageOrderValue: data.amount / data.orderCount,
      }));

      res.json({ success: true, data: { revenue: revenueData } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: error.errors });
      } else {
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
    }
  },

  async getSalesTrends(req: Request, res: Response) {
    try {
      const { startDate, endDate } = analyticsFiltersSchema.parse(req.query);

      // Calculate previous period
      const periodLength = endDate.getTime() - startDate.getTime();
      const previousStartDate = new Date(startDate.getTime() - periodLength);
      const previousEndDate = new Date(endDate.getTime() - periodLength);

      // Get current period orders
      const currentOrders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: OrderStatus.DELIVERED,
        },
      });

      // Get previous period orders
      const previousOrders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: previousStartDate,
            lte: previousEndDate,
          },
          status: OrderStatus.DELIVERED,
        },
      });

      const currentTotal = currentOrders.reduce((sum: number, order: Order) => sum + order.amount, 0);
      const previousTotal = previousOrders.reduce((sum: number, order: Order) => sum + order.amount, 0);
      const growthRate = previousTotal === 0 ? 100 : ((currentTotal - previousTotal) / previousTotal) * 100;

      res.json({
        success: true,
        data: {
          salesTrends: [{
            period: 'Current',
            totalSales: currentTotal,
            previousPeriodSales: previousTotal,
            growthRate,
          }],
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: error.errors });
      } else {
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
    }
  },

  async getPerformanceMetrics(req: Request, res: Response) {
    try {
      const { startDate, endDate } = analyticsFiltersSchema.parse(req.query);

      // Get orders for the period
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: OrderStatus.DELIVERED,
        },
        include: {
          items: true,
        },
      }) as OrderWithItems[];

      // Calculate metrics
      const totalRevenue = orders.reduce((sum: number, order: OrderWithItems) => sum + order.amount, 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders === 0 ? 0 : totalRevenue / totalOrders;

      // Get top selling items
      const itemSales = orders.reduce((acc: Record<string, ItemSales>, order: OrderWithItems) => {
        order.items.forEach((item: OrderItem) => {
          if (!acc[item.mealId]) {
            acc[item.mealId] = {
              quantity: 0,
              revenue: 0,
            };
          }
          acc[item.mealId].quantity += item.quantity;
          acc[item.mealId].revenue += item.price * item.quantity;
        });
        return acc;
      }, {});

      // Get meal details for top selling items
      const topSellingItems = await Promise.all(
        Object.entries(itemSales)
          .sort((a, b) => b[1].quantity - a[1].quantity)
          .slice(0, 5)
          .map(async ([mealId, sales]) => {
            const meal = await prisma.meal.findUnique({
              where: { id: mealId },
            });
            return {
              id: mealId,
              name: meal?.name || 'Unknown',
              quantity: sales.quantity,
              revenue: sales.revenue,
            };
          })
      );

      // Get customer metrics
      const uniqueCustomers = new Set(orders.map(order => order.userId));
      const newCustomers = await prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      res.json({
        success: true,
        data: {
          performanceMetrics: {
            totalRevenue,
            totalOrders,
            averageOrderValue,
            topSellingItems,
            customerMetrics: {
              totalCustomers: uniqueCustomers.size,
              newCustomers,
              returningCustomers: uniqueCustomers.size - newCustomers,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: error.errors });
      } else {
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
    }
  }
}; 