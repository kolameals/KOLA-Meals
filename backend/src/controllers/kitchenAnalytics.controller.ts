import { Request, Response } from 'express';
import { PrismaClient, OrderStatus, Role, Order, OrderItem, Meal } from '@prisma/client';
import { z } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import prisma from '../lib/prisma.js';

interface OrderWithItems extends Order {
  items: (OrderItem & {
    meal: Meal;
  })[];
}

interface PeakHour {
  hour: number;
  orderCount: number;
}

interface CostBreakdown {
  ingredients: number;
  labor: number;
  utilities: number;
  packaging: number;
  other: number;
}

interface CostTrend {
  date: string;
  totalCost: number;
}

interface EfficiencyMetrics {
  totalOrders: number;
  averagePreparationTime: number;
  onTimeDeliveryRate: number;
  kitchenUtilizationRate: number;
  peakHours: PeakHour[];
}

interface CostAnalysis {
  totalCost: number;
  costBreakdown: CostBreakdown;
  costPerOrder: number;
  costTrends: CostTrend[];
}

interface ResourceUtilization {
  staffUtilization: {
    totalStaffHours: number;
    productiveHours: number;
    utilizationRate: number;
  };
  equipmentUtilization: Array<{
    equipmentName: string;
    utilizationRate: number;
    downtime: number;
  }>;
  inventoryUtilization: {
    totalItems: number;
    activeItems: number;
    utilizationRate: number;
  };
}

const analyticsFilterSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  groupBy: z.enum(['day', 'week', 'month']).optional()
});

// Fallback data for when database is not accessible
const fallbackData = {
  efficiencyMetrics: {
    totalOrders: 0,
    averagePreparationTime: 0,
    onTimeDeliveryRate: 0,
    kitchenUtilizationRate: 0,
    peakHours: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      orderCount: 0
    }))
  },
  costAnalysis: {
    totalCost: 0,
    costBreakdown: {
      ingredients: 0,
      labor: 0,
      utilities: 0,
      packaging: 0,
      other: 0
    },
    costPerOrder: 0,
    costTrends: []
  },
  resourceUtilization: {
    staffUtilization: {
      totalStaffHours: 0,
      productiveHours: 0,
      utilizationRate: 0
    },
    equipmentUtilization: [
      { equipmentName: 'Oven', utilizationRate: 0, downtime: 0 },
      { equipmentName: 'Stove', utilizationRate: 0, downtime: 0 },
      { equipmentName: 'Refrigerator', utilizationRate: 0, downtime: 0 }
    ],
    inventoryUtilization: {
      totalItems: 0,
      activeItems: 0,
      utilizationRate: 0
    }
  }
};

export const kitchenAnalyticsController = {
  async getEfficiencyMetrics(req: Request, res: Response) {
    try {
      const { startDate, endDate } = analyticsFilterSchema.parse(req.query);
      
      try {
        // Calculate efficiency metrics
        const orders = await prisma.order.findMany({
          where: {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            },
            status: OrderStatus.DELIVERED
          },
          include: {
            items: true
          }
        }) as OrderWithItems[];

        const totalOrders = orders.length;
        
        // Handle empty orders case
        if (totalOrders === 0) {
          return res.json(fallbackData.efficiencyMetrics);
        }

        const averagePreparationTime = orders.reduce((acc: number, order: OrderWithItems) => {
          const prepTime = order.updatedAt ? 
            (order.updatedAt.getTime() - order.createdAt.getTime()) / (1000 * 60) : 0;
          return acc + prepTime;
        }, 0) / totalOrders;

        const onTimeDeliveryRate = orders.filter(order => {
          const deliveryTime = order.updatedAt ? 
            (order.updatedAt.getTime() - order.createdAt.getTime()) / (1000 * 60) : 0;
          return deliveryTime <= 45; // Assuming 45 minutes is the target delivery time
        }).length / totalOrders;

        // Calculate peak hours
        const peakHours: PeakHour[] = Array.from({ length: 24 }, (_, hour) => ({
          hour,
          orderCount: orders.filter(order => 
            order.createdAt.getHours() === hour
          ).length
        }));

        res.json({
          totalOrders,
          averagePreparationTime,
          onTimeDeliveryRate,
          kitchenUtilizationRate: 0.85,
          peakHours
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P1001') {
          console.error('Database connection error:', error);
          return res.json(fallbackData.efficiencyMetrics);
        }
        throw error;
      }
    } catch (error) {
      console.error('Error fetching efficiency metrics:', error);
      res.status(500).json({ error: 'Failed to fetch efficiency metrics' });
    }
  },

  async getCostAnalysis(req: Request, res: Response) {
    try {
      const { startDate, endDate } = analyticsFilterSchema.parse(req.query);
      
      try {
        // Calculate cost analysis
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

        // Handle empty orders case
        if (orders.length === 0) {
          return res.json(fallbackData.costAnalysis);
        }

        const totalCost = orders.reduce((acc: number, order: OrderWithItems) => {
          const orderCost = order.items.reduce((itemAcc: number, item: OrderItem & { meal: Meal }) => {
            return itemAcc + (item.meal.price * 0.6 * item.quantity);
          }, 0);
          return acc + orderCost;
        }, 0);

        const costBreakdown: CostBreakdown = {
          ingredients: totalCost * 0.6,
          labor: totalCost * 0.25,
          utilities: totalCost * 0.05,
          packaging: totalCost * 0.05,
          other: totalCost * 0.05
        };

        const costPerOrder = totalCost / orders.length;

        // Calculate cost trends
        const costTrends = orders.reduce((acc: CostTrend[], order: OrderWithItems) => {
          const date = order.createdAt.toISOString().split('T')[0];
          const existingDate = acc.find(item => item.date === date);
          
          if (existingDate) {
            existingDate.totalCost += order.items.reduce((sum: number, item: OrderItem & { meal: Meal }) => 
              sum + (item.meal.price * 0.6 * item.quantity), 0);
          } else {
            acc.push({
              date,
              totalCost: order.items.reduce((sum: number, item: OrderItem & { meal: Meal }) => 
                sum + (item.meal.price * 0.6 * item.quantity), 0)
            });
          }
          return acc;
        }, []);

        res.json({
          totalCost,
          costBreakdown,
          costPerOrder,
          costTrends
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P1001') {
          console.error('Database connection error:', error);
          return res.json(fallbackData.costAnalysis);
        }
        throw error;
      }
    } catch (error) {
      console.error('Error fetching cost analysis:', error);
      res.status(500).json({ error: 'Failed to fetch cost analysis' });
    }
  },

  async getResourceUtilization(req: Request, res: Response) {
    try {
      const { startDate, endDate } = analyticsFilterSchema.parse(req.query);
      
      try {
        // Get inventory data
        const inventory = await prisma.inventoryItem.findMany();
        const activeItems = inventory.filter(item => item.currentStock > 0).length;

        // Get staff data (no KITCHEN_STAFF role in schema, so count all users for now)
        const staff = await prisma.user.findMany();

        // Calculate staff utilization
        const totalStaffHours = staff.length * 8 * 30; // Assuming 8 hours per day, 30 days per month
        const productiveHours = totalStaffHours * 0.85; // Assuming 85% productivity

        // Get equipment data
        const equipment = await prisma.equipmentCost.findMany();
        const equipmentUtilization = equipment.map(eq => ({
          equipmentName: eq.name,
          utilizationRate: 0.75, // Placeholder value
          downtime: 0.25 // Placeholder value
        }));

        res.json({
          staffUtilization: {
            totalStaffHours,
            productiveHours,
            utilizationRate: productiveHours / totalStaffHours
          },
          equipmentUtilization,
          inventoryUtilization: {
            totalItems: inventory.length,
            activeItems,
            utilizationRate: activeItems / inventory.length
          }
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P1001') {
          console.error('Database connection error:', error);
          return res.json(fallbackData.resourceUtilization);
        }
        throw error;
      }
    } catch (error) {
      console.error('Error fetching resource utilization:', error);
      res.status(500).json({ error: 'Failed to fetch resource utilization' });
    }
  }
}; 