import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { UserRole, CreateUserData, UpdateUserData } from '../types/user.types';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export const userManagementService = {
  async getUsers(page: number, limit: number): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count()
    ]);

    return {
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },

  async createUser(userData: CreateUserData): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        password: hashedPassword,
        role: userData.role
      }
    });
  },

  async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    const updateData: any = {};
    
    if (userData.name) updateData.name = userData.name;
    if (userData.email !== undefined) updateData.email = userData.email || '';
    if (userData.phoneNumber !== undefined) updateData.phoneNumber = userData.phoneNumber || '';
    if (userData.role) updateData.role = userData.role;
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }

    return prisma.user.update({
      where: { id: userId },
      data: updateData
    });
  },

  async deleteUser(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId }
    });
  },

  async getDeliveryPartners(page: number, limit: number): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * limit;
    const [deliveryPartners, total] = await Promise.all([
      prisma.user.findMany({
        where: { role: UserRole.DELIVERY_PARTNER },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({
        where: { role: UserRole.DELIVERY_PARTNER }
      })
    ]);

    return {
      data: deliveryPartners,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },

  async createDeliveryPartner(userData: Omit<CreateUserData, 'role'>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        password: hashedPassword,
        role: UserRole.DELIVERY_PARTNER
      }
    });
  }
}; 