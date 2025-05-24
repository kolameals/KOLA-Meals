import { TiffinBoxStatusEnum } from '@prisma/client';
import { AppError } from '../types/error.types';
import prisma from '../lib/prisma';
import logger from '../config/logger.config';

export const tiffinBoxService = {
  async getAvailableTiffinBoxes() {
    try {
      const boxes = await prisma.tiffinBox.findMany({
        where: {
          status: TiffinBoxStatusEnum.AVAILABLE
        },
        orderBy: {
          lastUsed: 'asc'
        }
      });

      return boxes;
    } catch (error) {
      logger.error('Error fetching available tiffin boxes:', { error });
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching available tiffin boxes', 500);
    }
  },

  async reportDamage(boxId: string, damageReport: string) {
    try {
      const box = await prisma.tiffinBox.findUnique({
        where: { id: boxId }
      });

      if (!box) {
        throw new AppError('Tiffin box not found', 404);
      }

      const updatedBox = await prisma.tiffinBox.update({
        where: { id: boxId },
        data: {
          status: TiffinBoxStatusEnum.DAMAGED,
          damageReport,
          lastUsed: new Date()
        }
      });

      return updatedBox;
    } catch (error) {
      logger.error('Error reporting tiffin box damage:', { error, boxId });
      if (error instanceof AppError) throw error;
      throw new AppError('Error reporting tiffin box damage', 500);
    }
  },

  async updateStatus(boxId: string, status: TiffinBoxStatusEnum) {
    try {
      const box = await prisma.tiffinBox.findUnique({
        where: { id: boxId }
      });

      if (!box) {
        throw new AppError('Tiffin box not found', 404);
      }

      const updatedBox = await prisma.tiffinBox.update({
        where: { id: boxId },
        data: {
          status,
          lastUsed: new Date()
        }
      });

      return updatedBox;
    } catch (error) {
      logger.error('Error updating tiffin box status:', { error, boxId, status });
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating tiffin box status', 500);
    }
  },

  async getDamagedBoxes() {
    try {
      const boxes = await prisma.tiffinBox.findMany({
        where: {
          status: TiffinBoxStatusEnum.DAMAGED
        },
        orderBy: {
          lastUsed: 'desc'
        }
      });

      return boxes;
    } catch (error) {
      logger.error('Error fetching damaged tiffin boxes:', { error });
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching damaged tiffin boxes', 500);
    }
  },

  async createTiffinBox() {
    try {
      const box = await prisma.tiffinBox.create({
        data: {
          status: TiffinBoxStatusEnum.AVAILABLE,
          lastUsed: new Date()
        }
      });

      return box;
    } catch (error) {
      logger.error('Error creating tiffin box:', { error });
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating tiffin box', 500);
    }
  }
}; 