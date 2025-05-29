import { Request, Response } from 'express';
import { Prisma, CostFrequency } from '@prisma/client';
import prisma from '../lib/prisma';

// Define types for our cost models
type StaffCost = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  baseSalary: Prisma.Decimal;
  allowances: Prisma.Decimal;
  deductions: Prisma.Decimal;
  paymentFrequency: CostFrequency;
  bankDetails: Prisma.JsonValue;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
};

type EquipmentCost = {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  purchaseDate: Date | null;
  purchaseAmount: Prisma.Decimal | null;
  emiAmount: Prisma.Decimal | null;
  emiFrequency: CostFrequency | null;
  totalEmis: number | null;
  remainingEmis: number | null;
};

type FacilityCost = {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  rentAmount: Prisma.Decimal | null;
  maintenanceAmount: Prisma.Decimal | null;
  utilitiesAmount: Prisma.Decimal | null;
  frequency: CostFrequency;
};

// Get delivery cost configuration
export const getDeliveryCostConfig = async (req: Request, res: Response) => {
  try {
    const config = await prisma.deliveryCostConfig.findFirst();
    if (!config) {
      return res.status(404).json({ error: 'Delivery cost configuration not found' });
    }
    res.json(config);
  } catch (error) {
    console.error('Error fetching delivery cost config:', error);
    res.status(500).json({ error: 'Failed to fetch delivery cost configuration' });
  }
};

// Update delivery cost configuration
export const updateDeliveryCostConfig = async (req: Request, res: Response) => {
  try {
    const { costPerAgent } = req.body;
    
    if (typeof costPerAgent !== 'number' || costPerAgent <= 0) {
      return res.status(400).json({ error: 'Invalid cost per agent value' });
    }

    const config = await prisma.deliveryCostConfig.upsert({
      where: { id: 1 },
      update: { costPerAgent: new Prisma.Decimal(costPerAgent) },
      create: { costPerAgent: new Prisma.Decimal(costPerAgent) }
    });

    res.json(config);
  } catch (error) {
    console.error('Error updating delivery cost config:', error);
    res.status(500).json({ error: 'Failed to update delivery cost configuration' });
  }
};

// Staff Costs
export const getStaffCosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get the current delivery cost configuration
    const costConfig = await prisma.deliveryCostConfig.findFirst();
    const costPerAgent = costConfig ? Number(costConfig.costPerAgent) : 8000;

    const [deliveryPartners, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: 'DELIVERY_PARTNER'
        },
        include: {
          deliveryAgent: {
            include: {
              apartment: {
                include: {
                  towers: true
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({
        where: {
          role: 'DELIVERY_PARTNER'
        }
      })
    ]);

    // Transform the response to match the frontend's expected StaffCost structure
    const staffCosts = deliveryPartners.map(partner => {
      return {
        id: partner.id,
        userId: partner.id,
        baseSalary: costPerAgent,
        allowances: 0,
        deductions: 0,
        paymentFrequency: 'MONTHLY',
        bankDetails: {
          accountNumber: '',
          bankName: '',
          ifscCode: ''
        },
        createdAt: partner.createdAt,
        updatedAt: partner.updatedAt,
        user: {
          id: partner.id,
          name: partner.name,
          email: partner.email,
          phoneNumber: partner.phoneNumber || '',
          role: partner.role
        }
      };
    });

    res.json(staffCosts);
  } catch (error) {
    console.error('Error fetching staff costs:', error);
    res.status(500).json({ error: 'Failed to fetch staff costs' });
  }
};

export const getStaffCostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const costId = parseInt(id, 10);
    
    if (isNaN(costId)) {
      return res.status(400).json({ error: 'Invalid cost ID' });
    }

    const cost = await prisma.staffCost.findUnique({
      where: { id: costId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            role: true
          }
        }
      }
    });

    if (!cost) {
      return res.status(404).json({ error: 'Staff cost not found' });
    }

    res.json(cost);
  } catch (error) {
    console.error('Error fetching staff cost:', error);
    res.status(500).json({ error: 'Failed to fetch staff cost' });
  }
};

export const createStaffCost = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      baseSalary,
      allowances,
      deductions,
      paymentFrequency,
      bankDetails
    } = req.body;

    const cost = await prisma.staffCost.create({
      data: {
        userId,
        baseSalary: new Prisma.Decimal(baseSalary),
        allowances: new Prisma.Decimal(allowances),
        deductions: new Prisma.Decimal(deductions),
        paymentFrequency,
        bankDetails
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            role: true
          }
        }
      }
    });

    res.status(201).json(cost);
  } catch (error) {
    console.error('Error creating staff cost:', error);
    res.status(500).json({ error: 'Failed to create staff cost' });
  }
};

// Equipment Costs
export const getEquipmentCosts = async (req: Request, res: Response) => {
  try {
    const costs = await prisma.equipmentCost.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(costs);
  } catch (error) {
    console.error('Error fetching equipment costs:', error);
    res.status(500).json({ error: 'Failed to fetch equipment costs' });
  }
};

export const getEquipmentCostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const costId = parseInt(id, 10);
    
    if (isNaN(costId)) {
      return res.status(400).json({ error: 'Invalid cost ID' });
    }

    const cost = await prisma.equipmentCost.findUnique({
      where: { id: costId }
    });

    if (!cost) {
      return res.status(404).json({ error: 'Equipment cost not found' });
    }

    res.json(cost);
  } catch (error) {
    console.error('Error fetching equipment cost:', error);
    res.status(500).json({ error: 'Failed to fetch equipment cost' });
  }
};

export const createEquipmentCost = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      paymentType,
      purchaseDate,
      purchaseAmount,
      emiAmount,
      emiFrequency,
      totalEmis,
      remainingEmis,
      monthlyRent,
      securityDeposit,
      rentDuration
    } = req.body;

    const cost = await prisma.equipmentCost.create({
      data: {
        name,
        description,
        paymentType,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        purchaseAmount: purchaseAmount ? new Prisma.Decimal(purchaseAmount) : null,
        emiAmount: emiAmount ? new Prisma.Decimal(emiAmount) : null,
        emiFrequency,
        totalEmis,
        remainingEmis,
        monthlyRent: monthlyRent ? new Prisma.Decimal(monthlyRent) : null,
        securityDeposit: securityDeposit ? new Prisma.Decimal(securityDeposit) : null,
        rentDuration
      }
    });

    res.status(201).json(cost);
  } catch (error) {
    console.error('Error creating equipment cost:', error);
    res.status(500).json({ error: 'Failed to create equipment cost' });
  }
};

// Facility Costs
export const getFacilityCosts = async (req: Request, res: Response) => {
  try {
    const costs = await prisma.facilityCost.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(costs);
  } catch (error) {
    console.error('Error fetching facility costs:', error);
    res.status(500).json({ error: 'Failed to fetch facility costs' });
  }
};

export const getFacilityCostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const costId = parseInt(id, 10);
    
    if (isNaN(costId)) {
      return res.status(400).json({ error: 'Invalid cost ID' });
    }

    const cost = await prisma.facilityCost.findUnique({
      where: { id: costId }
    });

    if (!cost) {
      return res.status(404).json({ error: 'Facility cost not found' });
    }

    res.json(cost);
  } catch (error) {
    console.error('Error fetching facility cost:', error);
    res.status(500).json({ error: 'Failed to fetch facility cost' });
  }
};

export const createFacilityCost = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      type,
      rentAmount,
      maintenanceAmount,
      utilitiesAmount,
      frequency,
      startDate,
      endDate
    } = req.body;

    const cost = await prisma.facilityCost.create({
      data: {
        name,
        description,
        type,
        rentAmount: rentAmount ? new Prisma.Decimal(rentAmount) : null,
        maintenanceAmount: maintenanceAmount ? new Prisma.Decimal(maintenanceAmount) : null,
        utilitiesAmount: utilitiesAmount ? new Prisma.Decimal(utilitiesAmount) : null,
        frequency,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null
      }
    });

    res.status(201).json(cost);
  } catch (error) {
    console.error('Error creating facility cost:', error);
    res.status(500).json({ error: 'Failed to create facility cost' });
  }
};

// Cost Summary
export const getCostSummary = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate as string) : new Date();

    // Get the current delivery cost configuration
    const costConfig = await prisma.deliveryCostConfig.findFirst();
    const costPerAgent = costConfig ? Number(costConfig.costPerAgent) : 8000;

    // Get all delivery partners to calculate total staff cost
    const deliveryPartners = await prisma.user.findMany({
      where: {
        role: 'DELIVERY_PARTNER'
      }
    });

    const [equipmentCosts, facilityCosts] = await Promise.all([
      prisma.equipmentCost.findMany({
        where: {
          createdAt: {
            gte: start,
            lte: end
          }
        }
      }),
      prisma.facilityCost.findMany({
        where: {
          createdAt: {
            gte: start,
            lte: end
          }
        }
      })
    ]);

    // Calculate total staff cost using the configured cost per agent
    const totalStaffCost = deliveryPartners.length * costPerAgent;

    const summary = {
      staffCosts: {
        total: totalStaffCost,
        count: deliveryPartners.length,
        costPerAgent
      },
      equipmentCosts: {
        total: equipmentCosts.reduce((sum, cost) => sum + (cost.purchaseAmount ? Number(cost.purchaseAmount) : 0) + (cost.emiAmount ? Number(cost.emiAmount) : 0), 0),
        count: equipmentCosts.length
      },
      facilityCosts: {
        total: facilityCosts.reduce((sum, cost) => sum + (cost.rentAmount ? Number(cost.rentAmount) : 0) + (cost.maintenanceAmount ? Number(cost.maintenanceAmount) : 0) + (cost.utilitiesAmount ? Number(cost.utilitiesAmount) : 0), 0),
        count: facilityCosts.length
      }
    };

    res.json(summary);
  } catch (error) {
    console.error('Error fetching cost summary:', error);
    res.status(500).json({ error: 'Failed to fetch cost summary' });
  }
};

// Get cost categories
export const getCostCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.costCategory.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching cost categories:', error);
    res.status(500).json({ error: 'Failed to fetch cost categories' });
  }
}; 