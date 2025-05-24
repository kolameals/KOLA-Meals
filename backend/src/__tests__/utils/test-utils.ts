import { PrismaClient } from '@prisma/client';
import jwt, { SignOptions } from 'jsonwebtoken';
import { authConfig } from '../../config/auth.config';

const prisma = new PrismaClient();

export const testUtils = {
  // Create a test user
  async createTestUser(data: {
    email?: string;
    phoneNumber?: string;
    password?: string;
    role?: 'ADMIN' | 'CUSTOMER' | 'DELIVERY_PARTNER';
    name?: string;
  }) {
    const unique = Date.now();
    return prisma.user.create({
      data: {
        email: data.email || `test${unique}@example.com`,
        phoneNumber: data.phoneNumber || `+1234567890${unique}`,
        password: data.password || 'password123',
        role: data.role || 'CUSTOMER',
        name: data.name || 'Test User',
      },
    });
  },

  // Generate JWT token for testing
  generateTestToken(userId: string, role: string = 'CUSTOMER') {
    const options: SignOptions = { expiresIn: authConfig.jwt.expiresIn as unknown as SignOptions['expiresIn'] };
    return jwt.sign(
      { id: userId, role },
      authConfig.jwt.secret,
      options
    );
  },

  // Create test meal
  async createTestMeal(data: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
  }) {
    return prisma.meal.create({
      data: {
        name: data.name || 'Test Meal',
        description: data.description || 'Test Description',
        price: data.price || 10.99,
        category: data.category || 'Test Category',
      },
    });
  },

  // Create test subscription
  async createTestSubscription(data: {
    userId: string;
    status?: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';
    startDate?: Date;
    endDate?: Date;
  }) {
    return prisma.subscription.create({
      data: {
        userId: data.userId,
        status: data.status || 'ACTIVE',
        startDate: data.startDate || new Date(),
        endDate: data.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  },

  // Create test order
  async createTestOrder(data: {
    userId: string;
    amount: number;
    status?: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
    subscriptionId?: string;
  }) {
    return prisma.order.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        currency: 'INR',
        status: data.status || 'PENDING',
        paymentStatus: 'PENDING',
        subscriptionId: data.subscriptionId,
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '+1234567890',
      },
    });
  },

  // Clean up test data
  async cleanupTestData() {
    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.meal.deleteMany(),
      prisma.subscription.deleteMany(),
      prisma.order.deleteMany(),
      prisma.delivery.deleteMany(),
    ]);
  },
}; 