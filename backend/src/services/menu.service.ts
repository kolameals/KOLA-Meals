import { PrismaClient } from '@prisma/client';
import type {
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateDailyMenuDto,
  UpdateDailyMenuDto,
  CreateMenuCalendarDto,
  UpdateMenuCalendarDto,
} from '../types/menu.types';

const prisma = new PrismaClient();

export const menuService = {
  // Menu Item Operations
  async createMenuItem(data: CreateMenuItemDto) {
    return prisma.menuItem.create({
      data: {
        mealId: data.mealId,
        dailyMenuId: data.dailyMenuId,
        mealType: data.mealType,
        price: data.price,
      },
      include: {
        meal: true,
      },
    });
  },

  async updateMenuItem(id: string, data: UpdateMenuItemDto) {
    return prisma.menuItem.update({
      where: { id },
      data: {
        mealId: data.mealId,
        mealType: data.mealType,
        price: data.price,
      },
      include: {
        meal: true,
      },
    });
  },

  async deleteMenuItem(id: string) {
    await prisma.menuItem.delete({
      where: { id },
    });
  },

  // Daily Menu Operations
  async createDailyMenu(data: CreateDailyMenuDto) {
    return prisma.dailyMenu.create({
      data: {
        date: new Date(data.date),
        items: {
          create: data.items?.map(item => ({
            mealId: item.mealId,
            dailyMenuId: item.dailyMenuId,
            mealType: item.mealType,
            price: item.price,
          })) || [],
        },
      },
      include: {
        items: {
          include: {
            meal: true,
          },
        },
      },
    });
  },

  async updateDailyMenu(id: string, data: UpdateDailyMenuDto) {
    return prisma.dailyMenu.update({
      where: { id },
      data: {
        date: data.date ? new Date(data.date) : undefined,
        items: data.items ? {
          deleteMany: {},
          create: data.items.map(item => ({
            mealId: item.mealId,
            dailyMenuId: item.dailyMenuId,
            mealType: item.mealType,
            price: item.price,
          })),
        } : undefined,
      },
      include: {
        items: {
          include: {
            meal: true,
          },
        },
      },
    });
  },

  async getDailyMenuById(id: string) {
    return prisma.dailyMenu.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            meal: true,
          },
        },
      },
    });
  },

  async getDailyMenuByDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.dailyMenu.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        items: {
          include: {
            meal: true,
          },
        },
      },
    });
  },

  // Menu Calendar Operations
  async createMenuCalendar(data: CreateMenuCalendarDto) {
    return prisma.menuCalendar.create({
      data: {
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        dailyMenus: {
          create: data.dailyMenus?.map(menu => ({
            date: new Date(menu.date),
            items: {
              create: menu.items?.map(item => ({
                mealId: item.mealId,
                dailyMenuId: item.dailyMenuId,
                mealType: item.mealType,
                price: item.price,
              })) || [],
            },
          })) || [],
        },
      },
      include: {
        dailyMenus: {
          include: {
            items: {
              include: {
                meal: true,
              },
            },
          },
        },
      },
    });
  },

  async updateMenuCalendar(id: string, data: UpdateMenuCalendarDto) {
    return prisma.menuCalendar.update({
      where: { id },
      data: {
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        dailyMenus: data.dailyMenus ? {
          deleteMany: {},
          create: data.dailyMenus.map(menu => ({
            date: new Date(menu.date),
            items: {
              create: menu.items?.map(item => ({
                mealId: item.mealId,
                dailyMenuId: item.dailyMenuId,
                mealType: item.mealType,
                price: item.price,
              })) || [],
            },
          })),
        } : undefined,
      },
      include: {
        dailyMenus: {
          include: {
            items: {
              include: {
                meal: true,
              },
            },
          },
        },
      },
    });
  },

  async getMenuCalendarById(id: string) {
    return prisma.menuCalendar.findUnique({
      where: { id },
      include: {
        dailyMenus: {
          include: {
            items: {
              include: {
                meal: true,
              },
            },
          },
        },
      },
    });
  },

  async getMenuCalendarByDateRange(startDate: Date, endDate: Date) {
    return prisma.menuCalendar.findFirst({
      where: {
        startDate: {
          lte: new Date(endDate),
        },
        endDate: {
          gte: new Date(startDate),
        },
      },
      include: {
        dailyMenus: {
          include: {
            items: {
              include: {
                meal: true,
              },
            },
          },
        },
      },
    });
  },
}; 