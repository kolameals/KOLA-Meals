import { z } from 'zod';
import { MealType } from './meal.types';

// Base Types
export interface MenuItem {
  id: string;
  mealId: string;
  meal: {
    id: string;
    name: string;
    description?: string;
    type: MealType;
  };
  price: number;
  isAvailable: boolean;
  mealType: MealType;
  dayOfWeek: number;
  dailyMenuId: string;
}

export interface Menu {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyMenu {
  id: string;
  date: string; // Store as ISO string
  items: MenuItem[];
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
  price?: number;
  isAvailable?: boolean;
  mealType?: MealType;
  dayOfWeek?: number;
}

export interface CreateDailyMenuDto {
  date: string; // Store as ISO string
  items: MenuItem[];
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

export interface CreateMenuDto {
  name: string;
  description: string;
  items: string[]; // Array of menu item IDs
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface UpdateMenuDto {
  name?: string;
  description?: string;
  items?: string[]; // Array of menu item IDs
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
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