import { AppError } from '../types/error.types';
import prisma from '../lib/prisma';
import logger from '../config/logger.config';
import { DeliveryStatusEnum, OldTiffinStatusEnum } from '@prisma/client';

export const deliveryStatusService = {
  async getDeliveryStatus(orderId: string) {
    try {
      const deliveryStatus = await prisma.deliveryStatus.findUnique({
        where: { orderId },
        include: {
          deliveryPartner: {
            select: {
              id: true,
              name: true,
              phoneNumber: true
            }
          }
        }
      });

      if (!deliveryStatus) {
        throw new AppError('Delivery status not found', 404);
      }

      return deliveryStatus;
    } catch (error) {
      logger.error('Error fetching delivery status:', { error, orderId });
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching delivery status', 500);
    }
  },

  async updateDeliveryStatus(
    orderId: string,
    status: DeliveryStatusEnum,
    oldTiffinStatus: OldTiffinStatusEnum,
    deliveryPartnerId: string
  ) {
    try {
      const deliveryStatus = await prisma.deliveryStatus.upsert({
        where: { orderId },
        update: {
          status,
          oldTiffinStatus,
          deliveryTime: new Date(),
          deliveryPartnerId
        },
        create: {
          orderId,
          status,
          oldTiffinStatus,
          deliveryTime: new Date(),
          deliveryPartnerId
        }
      });

      return deliveryStatus;
    } catch (error) {
      logger.error('Error updating delivery status:', { error, orderId, status });
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating delivery status', 500);
    }
  },

  async getDeliveryPartnerDeliveries(deliveryPartnerId: string, date: Date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const deliveries = await prisma.deliveryStatus.findMany({
        where: {
          deliveryPartnerId,
          deliveryTime: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        include: {
          order: {
            include: {
              user: {
                select: {
                  name: true,
                  phoneNumber: true
                }
              }
            }
          }
        }
      });

      return deliveries;
    } catch (error) {
      logger.error('Error fetching delivery partner deliveries:', { error, deliveryPartnerId, date });
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching delivery partner deliveries', 500);
    }
  }
}; 