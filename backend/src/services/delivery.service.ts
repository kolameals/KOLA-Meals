import { AppError } from '../types/error.types';
import prisma from '../lib/prisma';

interface CreateDeliveryData {
  orderId: string;
  userId: string;
  addressId: string;
  address: string;
}

export const createDelivery = async (data: CreateDeliveryData) => {
  return prisma.delivery.create({
    data: {
      ...data,
      status: 'PENDING'
    },
    include: {
      order: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true
        }
      },
      addressRel: true
    }
  });
};

export const getDelivery = async (deliveryId: string) => {
  return prisma.delivery.findUnique({
    where: { id: deliveryId },
    include: {
      order: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true
        }
      },
      addressRel: true
    }
  });
};

export const updateDeliveryStatus = async (deliveryId: string, status: string) => {
  const data: any = { status };
  return prisma.delivery.update({
    where: { id: deliveryId },
    data,
    include: {
      order: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true
        }
      },
      addressRel: true
    }
  });
};

export const getDeliveriesByUser = async (userId: string) => {
  return prisma.delivery.findMany({
    where: { userId },
    include: {
      order: true,
      addressRel: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getPendingDeliveries = async () => {
  return prisma.delivery.findMany({
    where: {
      status: {
        in: ['PENDING', 'ASSIGNED']
      }
    },
    include: {
      order: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true
        }
      },
      addressRel: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
}; 