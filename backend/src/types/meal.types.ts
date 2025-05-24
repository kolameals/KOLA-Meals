import { z } from 'zod';

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER'
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  price: number;
  type: MealType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealDto {
  name: string;
  description: string;
  image?: string;
  category: string;
  price: number;
  type: MealType;
}

export interface UpdateMealDto {
  name?: string;
  description?: string;
  image?: string;
  category?: string;
  price?: number;
  type?: MealType;
}

// Zod Schemas
export const CreateMealDtoSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().optional(),
  category: z.string(),
  price: z.number().positive(),
  type: z.enum(['BREAKFAST', 'LUNCH', 'DINNER'])
});

export const UpdateMealDtoSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  category: z.string().optional(),
  price: z.number().positive().optional(),
  type: z.enum(['BREAKFAST', 'LUNCH', 'DINNER']).optional()
}); 