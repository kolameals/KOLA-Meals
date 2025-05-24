import { AppError } from '../types/error.types';
import prisma from '../lib/prisma';
import logger from '../config/logger.config';

interface SkipStatus {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export class DailyMealService {
  async getDailyMeals(date: Date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const dailyMeal = await prisma.dailyMeal.findFirst({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        include: {
          breakfast: true,
          lunch: true,
          dinner: true
        }
      });

      if (!dailyMeal) {
        throw new AppError('No meals found for this date', 404);
      }

      return dailyMeal;
    } catch (error) {
      logger.error('Error in getDailyMeals:', error);
      throw error;
    }
  }

  async skipMeal(userId: string, date: Date, mealType: 'breakfast' | 'lunch' | 'dinner') {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const dailyMeal = await prisma.dailyMeal.findFirst({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      });

      if (!dailyMeal) {
        throw new AppError('No meals found for this date', 404);
      }

      const now = new Date();
      if (now > dailyMeal.cutoffTime) {
        throw new AppError('Cannot skip meal after cutoff time', 400);
      }

      const skipStatus = dailyMeal.skipStatus as unknown as SkipStatus;
      skipStatus[mealType] = true;

      const updatedDailyMeal = await prisma.dailyMeal.update({
        where: { id: dailyMeal.id },
        data: {
          skipStatus: skipStatus as any
        }
      });

      return updatedDailyMeal;
    } catch (error) {
      logger.error('Error in skipMeal:', error);
      throw error;
    }
  }

  async createDailyMeal(date: Date, breakfastId: string, lunchId: string, dinnerId: string) {
    try {
      const cutoffTime = new Date(date);
      cutoffTime.setHours(20, 0, 0, 0); // 8 PM cutoff

      const dailyMeal = await prisma.dailyMeal.create({
        data: {
          date,
          breakfastId,
          lunchId,
          dinnerId,
          cutoffTime,
          skipStatus: {
            breakfast: false,
            lunch: false,
            dinner: false
          } as any
        },
        include: {
          breakfast: true,
          lunch: true,
          dinner: true
        }
      });

      return dailyMeal;
    } catch (error) {
      logger.error('Error in createDailyMeal:', error);
      throw error;
    }
  }
}

export const dailyMealService = new DailyMealService(); 