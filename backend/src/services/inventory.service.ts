import { AppError } from '../types/error.types.js';
import prisma from '../lib/prisma.js';
import logger from '../config/logger.config.js';

export const inventoryService = {
  async getInventoryItems() {
    try {
      const items = await prisma.inventoryItem.findMany({
        orderBy: {
          name: 'asc'
        }
      });

      return items;
    } catch (error) {
      logger.error('Error fetching inventory items:', { error });
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching inventory items', 500);
    }
  },

  async updateStock(itemId: string, quantity: number) {
    try {
      const item = await prisma.inventoryItem.findUnique({
        where: { id: itemId }
      });

      if (!item) {
        throw new AppError('Inventory item not found', 404);
      }

      const updatedItem = await prisma.inventoryItem.update({
        where: { id: itemId },
        data: {
          currentStock: quantity,
          lastUpdated: new Date()
        }
      });

      // Check if stock is below minimum
      if (updatedItem.currentStock <= updatedItem.minimumStock) {
        logger.warn('Low stock alert:', {
          itemId,
          itemName: updatedItem.name,
          currentStock: updatedItem.currentStock,
          minimumStock: updatedItem.minimumStock
        });
      }

      return updatedItem;
    } catch (error) {
      logger.error('Error updating inventory stock:', { error, itemId, quantity });
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating inventory stock', 500);
    }
  },

  async createInventoryItem(
    name: string,
    currentStock: number,
    minimumStock: number,
    unit: string
  ) {
    try {
      const item = await prisma.inventoryItem.create({
        data: {
          name,
          currentStock,
          minimumStock,
          unit
        }
      });

      return item;
    } catch (error) {
      logger.error('Error creating inventory item:', { error, name });
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating inventory item', 500);
    }
  },

  async getLowStockItems() {
    try {
      const items = await prisma.inventoryItem.findMany({
        where: {
          currentStock: {
            lte: prisma.inventoryItem.fields.minimumStock
          }
        },
        orderBy: {
          currentStock: 'asc'
        }
      });

      return items;
    } catch (error) {
      logger.error('Error fetching low stock items:', { error });
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching low stock items', 500);
    }
  },

  async recordWaste(itemId: string, quantity: number, reason: string) {
    try {
      const item = await prisma.inventoryItem.findUnique({
        where: { id: itemId }
      });

      if (!item) {
        throw new AppError('Inventory item not found', 404);
      }

      // Create waste record
      const wasteRecord = await prisma.wasteRecord.create({
        data: {
          itemId,
          quantity,
          reason,
          date: new Date()
        }
      });

      // Update inventory stock
      const updatedItem = await prisma.inventoryItem.update({
        where: { id: itemId },
        data: {
          currentStock: item.currentStock - quantity,
          lastUpdated: new Date()
        }
      });

      logger.info('Waste recorded:', {
        itemId,
        itemName: item.name,
        quantity,
        reason
      });

      return {
        wasteRecord,
        updatedItem
      };
    } catch (error) {
      logger.error('Error recording waste:', { error, itemId, quantity, reason });
      if (error instanceof AppError) throw error;
      throw new AppError('Error recording waste', 500);
    }
  },

  async getWasteRecords() {
    try {
      const records = await prisma.wasteRecord.findMany({
        include: {
          item: true
        },
        orderBy: {
          date: 'desc'
        }
      });

      return records;
    } catch (error) {
      logger.error('Error fetching waste records:', { error });
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching waste records', 500);
    }
  }
}; 