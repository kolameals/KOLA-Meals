import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { UserRole, CreateUserData, UpdateUserData } from '../types/user.types.js';

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const userManagementService = {
  async getUsers(page: number = 1, limit: number = 10, search?: string) {
    try {
      const skip = (page - 1) * limit;
      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
              { phoneNumber: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      console.log('Query parameters:', { page, limit, skip, search, where });

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { id: 'asc' },
          select: {
            id: true,
            email: true,
            phoneNumber: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            addresses: {
              select: {
                id: true,
                apartment: true,
                tower: true,
                floor: true,
                roomNumber: true,
                street: true,
                city: true,
                state: true,
                postalCode: true,
                country: true,
                isDefault: true,
                createdAt: true,
                updatedAt: true
              }
            },
            subscription: {
              select: {
                id: true,
                status: true,
                startDate: true,
                endDate: true,
                plan: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    mealsPerDay: true,
                    description: true
                  }
                }
              }
            }
          }
        }),
        prisma.user.count({ where })
      ]);

      // Ensure each user has addresses and subscription fields
      const usersWithRelations = users.map(user => ({
        ...user,
        addresses: user.addresses || [],
        subscription: user.subscription || null
      }));

      // Debug: Log the first user's complete data
      if (usersWithRelations.length > 0) {
        console.log('First user complete data:', {
          id: usersWithRelations[0].id,
          email: usersWithRelations[0].email,
          name: usersWithRelations[0].name,
          addresses: usersWithRelations[0].addresses,
          subscription: usersWithRelations[0].subscription
        });
      }

      return {
        data: usersWithRelations,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw error;
    }
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
      },
      include: {
        addresses: true,
        subscription: {
          include: {
            plan: true
          }
        }
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
      data: updateData,
      include: {
        addresses: true,
        subscription: {
          include: {
            plan: true
          }
        }
      }
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
        orderBy: { createdAt: 'desc' },
        include: {
          deliveryAgent: true
        }
      }),
      prisma.user.count({
        where: { role: UserRole.DELIVERY_PARTNER }
      })
    ]);

    return {
      data: deliveryPartners,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
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
  },

  async getUsersByApartment() {
    try {
      const users = await prisma.user.findMany({
        where: {
          addresses: {
            some: {} // Has at least one address
          }
        },
        include: {
          addresses: {
            select: {
              id: true,
              apartment: true,
              tower: true,
              floor: true,
              roomNumber: true,
              isDefault: true
            }
          },
          subscription: {
            select: {
              id: true,
              status: true,
              plan: {
                select: {
                  id: true,
                  name: true,
                  mealsPerDay: true
                }
              }
            }
          }
        }
      });

      // Group users by apartment and tower
      const apartmentGroups = users.reduce((acc, user) => {
        user.addresses.forEach(address => {
          if (address.apartment && address.tower) {
            const key = `${address.apartment}-${address.tower}`;
            if (!acc[key]) {
              acc[key] = {
                apartment: address.apartment,
                tower: address.tower,
                users: [],
                totalUsers: 0,
                activeSubscribers: 0
              };
            }
            acc[key].users.push({
              id: user.id,
              name: user.name,
              email: user.email,
              phoneNumber: user.phoneNumber,
              floor: address.floor,
              roomNumber: address.roomNumber,
              hasActiveSubscription: user.subscription?.status === 'ACTIVE'
            });
            acc[key].totalUsers++;
            if (user.subscription?.status === 'ACTIVE') {
              acc[key].activeSubscribers++;
            }
          }
        });
        return acc;
      }, {} as Record<string, any>);

      return {
        success: true,
        data: Object.values(apartmentGroups)
      };
    } catch (error) {
      console.error('Error in getUsersByApartment:', error);
      throw error;
    }
  },

  async getNonSubscribedUsers() {
    try {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { subscription: null },
            { subscription: { status: { not: 'ACTIVE' } } }
          ]
        },
        include: {
          addresses: {
            select: {
              id: true,
              apartment: true,
              tower: true,
              floor: true,
              roomNumber: true,
              isDefault: true
            }
          },
          subscription: {
            select: {
              id: true,
              status: true,
              startDate: true,
              endDate: true,
              plan: {
                select: {
                  id: true,
                  name: true,
                  mealsPerDay: true,
                  price: true
                }
              }
            }
          }
        }
      });

      return {
        success: true,
        data: users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          addresses: user.addresses,
          subscription: user.subscription
        }))
      };
    } catch (error) {
      console.error('Error in getNonSubscribedUsers:', error);
      throw error;
    }
  },

  async getActiveSubscribers() {
    try {
      const users = await prisma.user.findMany({
        where: {
          subscription: {
            status: 'ACTIVE'
          }
        },
        include: {
          addresses: {
            select: {
              id: true,
              apartment: true,
              tower: true,
              floor: true,
              roomNumber: true,
              isDefault: true
            }
          },
          subscription: {
            select: {
              id: true,
              status: true,
              startDate: true,
              endDate: true,
              plan: {
                select: {
                  id: true,
                  name: true,
                  mealsPerDay: true,
                  price: true
                }
              }
            }
          }
        }
      });

      return {
        success: true,
        data: users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          addresses: user.addresses,
          subscription: user.subscription
        }))
      };
    } catch (error) {
      console.error('Error in getActiveSubscribers:', error);
      throw error;
    }
  }
}; 