import { AppError } from '../types/error.types.js';
import prisma from '../lib/prisma.js';
import { Prisma, SubscriptionStatus } from '@prisma/client';

interface CreateSubscriptionData {
  userId: string;
  planId: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

interface UpdateSubscriptionData {
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export const createSubscription = async (data: CreateSubscriptionData) => {
  const { userId, planId, status, startDate, endDate } = data;

  // Calculate end date (30 days from now) if not provided
  const calculatedEndDate = endDate || (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d; })();

  return prisma.subscription.create({
    data: {
      userId,
      planId,
      status: (status as SubscriptionStatus) || SubscriptionStatus.ACTIVE,
      startDate: startDate || new Date(),
      endDate: calculatedEndDate
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true
        }
      }
    }
  });
};

export const getSubscription = async (userId: string) => {
  return prisma.subscription.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true
        }
      }
    }
  });
};

export const updateSubscription = async (userId: string, data: UpdateSubscriptionData) => {
  return prisma.subscription.update({
    where: { userId },
    data: {
      ...data,
      status: data.status as SubscriptionStatus,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true
        }
      }
    }
  });
};

export const cancelSubscription = async (userId: string) => {
  return prisma.subscription.update({
    where: { userId },
    data: {
      status: SubscriptionStatus.CANCELLED
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true
        }
      }
    }
  });
};

export const pauseSubscription = async (userId: string) => {
  return prisma.subscription.update({
    where: { userId },
    data: {
      status: SubscriptionStatus.PAUSED
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true
        }
      }
    }
  });
};

export const resumeSubscription = async (userId: string) => {
  return prisma.subscription.update({
    where: { userId },
    data: {
      status: SubscriptionStatus.ACTIVE
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true
        }
      }
    }
  });
}; 