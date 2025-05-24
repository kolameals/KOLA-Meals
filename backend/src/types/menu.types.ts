import { z } from 'zod';
import { MealType } from './meal.types';

// Base Types
export interface MenuItem {
  id: string;
  mealId: string;
  dailyMenuId: string;
  mealType: MealType;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyMenu {
  id: string;
  date: Date;
  items: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCalendar {
  id: string;
  startDate: Date;
  endDate: Date;
  dailyMenus: DailyMenu[];
  createdAt: Date;
  updatedAt: Date;
}

// DTOs
export interface CreateMenuItemDto {
  mealId: string;
  dailyMenuId: string;
  mealType: MealType;
  price: number;
}

export interface UpdateMenuItemDto {
  mealId?: string;
  mealType?: MealType;
  price?: number;
}

export interface CreateDailyMenuDto {
  date: Date;
  items?: CreateMenuItemDto[];
}

export interface UpdateDailyMenuDto {
  date?: Date;
  items?: CreateMenuItemDto[];
}

export interface CreateMenuCalendarDto {
  startDate: Date;
  endDate: Date;
  dailyMenus?: CreateDailyMenuDto[];
}

export interface UpdateMenuCalendarDto {
  startDate?: Date;
  endDate?: Date;
  dailyMenus?: CreateDailyMenuDto[];
}

// Zod Schemas
export const createMenuItemSchema = z.object({
  mealId: z.string(),
  dailyMenuId: z.string(),
  mealType: z.nativeEnum(MealType),
  price: z.number().positive(),
});

export const updateMenuItemSchema = z.object({
  mealId: z.string().optional(),
  mealType: z.nativeEnum(MealType).optional(),
  price: z.number().positive().optional(),
});

export const createDailyMenuSchema = z.object({
  date: z.date(),
  items: z.array(createMenuItemSchema).optional(),
});

export const updateDailyMenuSchema = z.object({
  date: z.date().optional(),
  items: z.array(createMenuItemSchema).optional(),
});

export const createMenuCalendarSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  dailyMenus: z.array(createDailyMenuSchema).optional(),
});

export const updateMenuCalendarSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  dailyMenus: z.array(createDailyMenuSchema).optional(),
}); 