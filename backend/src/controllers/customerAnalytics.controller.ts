import { Request, Response } from 'express';
import { PrismaClient, OrderStatus, Role, Order, OrderItem, Meal, MealFeedback } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

interface OrderWithItems extends Order {
  items: (OrderItem & {
    meal: Meal;
  })[];
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface OrderFrequencyDistribution {
  '1-2 orders': number;
  '3-5 orders': number;
  '6-10 orders': number;
  '10+ orders': number;
}

interface PeakHour {
  hour: number;
  orderCount: number;
}

interface TopItem {
  name: string;
  count: number;
}

interface SentimentAnalysis {
  positive: number;
  neutral: number;
  negative: number;
}

const analyticsFilterSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  groupBy: z.enum(['day', 'week', 'month']).optional()
});

export const customerAnalyticsController = {
  async getCustomerBehavior(req: Request, res: Response) {
    try {
      const { startDate, endDate } = analyticsFilterSchema.parse(req.query);

      // Get all orders within date range
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        include: {
          items: {
            include: {
              meal: true
            }
          },
          user: true
        }
      }) as OrderWithItems[];

      // Calculate customer behavior metrics
      const totalCustomers = new Set(orders.map(order => order.userId)).size;
      const totalOrders = orders.length;
      const averageOrderValue = orders.reduce((acc: number, order: OrderWithItems) => {
        return acc + order.items.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0);
      }, 0) / totalOrders;

      // Calculate order frequency distribution
      const customerOrderCounts = orders.reduce((acc: { [key: string]: number }, order: OrderWithItems) => {
        acc[order.userId] = (acc[order.userId] || 0) + 1;
        return acc;
      }, {});

      const orderFrequencyDistribution: OrderFrequencyDistribution = {
        '1-2 orders': 0,
        '3-5 orders': 0,
        '6-10 orders': 0,
        '10+ orders': 0
      };

      Object.values(customerOrderCounts).forEach(count => {
        if (count <= 2) orderFrequencyDistribution['1-2 orders']++;
        else if (count <= 5) orderFrequencyDistribution['3-5 orders']++;
        else if (count <= 10) orderFrequencyDistribution['6-10 orders']++;
        else orderFrequencyDistribution['10+ orders']++;
      });

      // Calculate peak ordering hours
      const peakHours: PeakHour[] = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        orderCount: orders.filter(order => order.createdAt.getHours() === hour).length
      }));

      // Calculate repeat customer rate
      const repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
      const repeatCustomerRate = totalCustomers > 0 ? repeatCustomers / totalCustomers : 0;

      res.json({
        totalCustomers,
        totalOrders,
        averageOrderValue,
        orderFrequencyDistribution,
        peakHours,
        repeatCustomerRate
      });
    } catch (error) {
      console.error('Error fetching customer behavior:', error);
      res.status(500).json({ error: 'Failed to fetch customer behavior data' });
    }
  },

  async getCustomerPreferences(req: Request, res: Response) {
    try {
      const { startDate, endDate } = analyticsFilterSchema.parse(req.query);

      // Get all orders within date range
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        include: {
          items: {
            include: {
              meal: true
            }
          }
        }
      }) as OrderWithItems[];

      // Calculate category preferences
      const categoryPreferences = orders.reduce((acc: { [key: string]: number }, order: OrderWithItems) => {
        order.items.forEach(item => {
          const category = item.meal.category;
          acc[category] = (acc[category] || 0) + item.quantity;
        });
        return acc;
      }, {});

      // Calculate popular items
      const popularItems = orders.reduce((acc: { [key: string]: number }, order: OrderWithItems) => {
        order.items.forEach(item => {
          const itemName = item.meal.name;
          acc[itemName] = (acc[itemName] || 0) + item.quantity;
        });
        return acc;
      }, {});

      // Sort and get top 10 items
      const topItems: TopItem[] = Object.entries(popularItems)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      // Calculate dietary preferences
      const dietaryPreferences = orders.reduce((acc: { [key: string]: number }, order: OrderWithItems) => {
        order.items.forEach(item => {
          const dietaryType = item.meal.type || 'Regular';
          acc[dietaryType] = (acc[dietaryType] || 0) + item.quantity;
        });
        return acc;
      }, {});

      res.json({
        categoryPreferences,
        topItems,
        dietaryPreferences
      });
    } catch (error) {
      console.error('Error fetching customer preferences:', error);
      res.status(500).json({ error: 'Failed to fetch customer preferences data' });
    }
  },

  async getFeedbackAnalysis(req: Request, res: Response) {
    try {
      const { startDate, endDate } = analyticsFilterSchema.parse(req.query);

      // Get all feedback within date range
      const feedback = await prisma.mealFeedback.findMany({
        where: {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        include: {
          meal: true
        }
      });

      // Calculate overall satisfaction metrics
      const totalFeedback = feedback.length;
      const averageRating = feedback.reduce((acc: number, f: MealFeedback) => acc + f.rating, 0) / totalFeedback;

      // Calculate rating distribution
      const ratingDistribution = feedback.reduce((acc: { [key: number]: number }, f: MealFeedback) => {
        acc[f.rating] = (acc[f.rating] || 0) + 1;
        return acc;
      }, {});

      // Analyze feedback sentiment
      const sentimentAnalysis = feedback.reduce((acc: SentimentAnalysis, f: MealFeedback) => {
        if (f.rating >= 4) acc.positive++;
        else if (f.rating >= 3) acc.neutral++;
        else acc.negative++;
        return acc;
      }, { positive: 0, neutral: 0, negative: 0 });

      // Calculate common themes in feedback
      const commonThemes = feedback.reduce((acc: { [key: string]: number }, f: MealFeedback) => {
        const themes = f.comments?.toLowerCase().split(' ') || [];
        themes.forEach(theme => {
          if (theme.length > 3) { // Ignore short words
            acc[theme] = (acc[theme] || 0) + 1;
          }
        });
        return acc;
      }, {});

      // Get top themes
      const topThemes = Object.entries(commonThemes)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 10)
        .map(([theme, count]) => ({ theme, count }));

      res.json({
        totalFeedback,
        averageRating,
        ratingDistribution,
        sentimentAnalysis,
        topThemes
      });
    } catch (error) {
      console.error('Error fetching feedback analysis:', error);
      res.status(500).json({ error: 'Failed to fetch feedback analysis data' });
    }
  }
}; 