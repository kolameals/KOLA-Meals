import { z } from 'zod';

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER'
}

export enum MealCategory {
  VEGETARIAN = 'VEGETARIAN',
  NON_VEGETARIAN = 'NON_VEGETARIAN',
  DESSERT = 'DESSERT',
  SNACKS = 'SNACKS'
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: MealCategory;
  type: MealType;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealDto {
  name: string;
  description: string;
  image?: string;
  category: MealCategory;
  type: MealType;
  price: number;
}

export interface UpdateMealDto {
  name?: string;
  description?: string;
  image?: string;
  category?: MealCategory;
  type?: MealType;
  price?: number;
}

// Zod Schemas
export const CreateMealDtoSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().optional(),
  category: z.nativeEnum(MealCategory),
  type: z.nativeEnum(MealType),
  price: z.number().positive()
});

export const UpdateMealDtoSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  category: z.nativeEnum(MealCategory).optional(),
  type: z.nativeEnum(MealType).optional(),
  price: z.number().positive().optional()
}); 