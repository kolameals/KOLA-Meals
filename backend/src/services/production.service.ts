import { AppError } from '../types/error.types.js';
import prisma from '../lib/prisma.js';
import { MealType, ProductionStatus, ProductionItemStatus } from '@prisma/client';

export class ProductionService {
  async createSchedule(data: {
    date: Date;
    mealType: MealType;
    mealId: string;
    startTime: Date;
    endTime: Date;
    items: Array<{
      rawMaterialId: string;
      requiredQuantity: number;
    }>;
  }) {
    return prisma.productionSchedule.create({
      data: {
        date: data.date,
        mealType: data.mealType,
        mealId: data.mealId,
        startTime: data.startTime,
        endTime: data.endTime,
        status: ProductionStatus.PENDING,
        items: {
          create: data.items.map(item => ({
            rawMaterialId: item.rawMaterialId,
            requiredQuantity: item.requiredQuantity,
            status: ProductionItemStatus.PENDING
          }))
        }
      },
      include: {
        items: {
          include: {
            rawMaterial: true
          }
        },
        meal: true
      }
    });
  }

  async getSchedules(filters?: {
    startDate?: Date;
    endDate?: Date;
    mealType?: MealType;
    status?: ProductionStatus;
  }) {
    return prisma.productionSchedule.findMany({
      where: {
        date: {
          gte: filters?.startDate,
          lte: filters?.endDate
        },
        mealType: filters?.mealType,
        status: filters?.status
      },
      include: {
        items: {
          include: {
            rawMaterial: true
          }
        },
        meal: true
      },
      orderBy: {
        date: 'asc'
      }
    });
  }

  async getScheduleById(id: string) {
    return prisma.productionSchedule.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            rawMaterial: true
          }
        },
        meal: true
      }
    });
  }

  async updateSchedule(id: string, data: {
    date?: Date;
    mealType?: MealType;
    status?: ProductionStatus;
    startTime?: Date;
    endTime?: Date;
  }) {
    return prisma.productionSchedule.update({
      where: { id },
      data,
      include: {
        items: {
          include: {
            rawMaterial: true
          }
        },
        meal: true
      }
    });
  }

  async deleteSchedule(id: string) {
    // Delete production items first
    await prisma.productionItem.deleteMany({
      where: { productionScheduleId: id }
    });

    // Then delete the schedule
    return prisma.productionSchedule.delete({
      where: { id }
    });
  }

  async updateProductionItem(id: string, data: {
    actualQuantity?: number;
    status?: ProductionItemStatus;
  }) {
    return prisma.productionItem.update({
      where: { id },
      data,
      include: {
        rawMaterial: true
      }
    });
  }

  async autoGenerateSchedule(date: Date, mealType: MealType) {
    // Get all meals for the specified meal type
    const meals = await prisma.meal.findMany({
      where: { type: mealType },
      include: {
        recipe: {
          include: {
            recipeItems: {
              include: {
                rawMaterial: true
              }
            }
          }
        }
      }
    });

    if (!meals.length) {
      throw new Error(`No meals found for type ${mealType}`);
    }

    // Create a production schedule for each meal
    const schedules = await Promise.all(
      meals.map(meal => {
        if (!meal.recipe) {
          throw new Error(`No recipe found for meal ${meal.name}`);
        }

        return this.createSchedule({
          date,
          mealType,
          mealId: meal.id,
          startTime: new Date(date.setHours(8, 0, 0, 0)), // 8 AM
          endTime: new Date(date.setHours(12, 0, 0, 0)), // 12 PM
          items: meal.recipe.recipeItems.map(item => ({
            rawMaterialId: item.rawMaterialId,
            requiredQuantity: item.quantity
          }))
        });
      })
    );

    return schedules;
  }
}

export const productionService = new ProductionService(); 