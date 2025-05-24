import { z } from 'zod';

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  type: MealType;
  price: number;
  imageUrl?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  allergens: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMealDto {
  name: string;
  description: string;
  type: MealType;
  price: number;
  imageUrl?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  allergens: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface UpdateMealDto {
  name?: string;
  description?: string;
  type?: MealType;
  price?: number;
  imageUrl?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  allergens?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Zod Schemas
export const createMealSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.nativeEnum(MealType),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  isVegetarian: z.boolean(),
  isVegan: z.boolean(),
  isGlutenFree: z.boolean(),
  allergens: z.array(z.string()),
  nutritionalInfo: z.object({
    calories: z.number().positive(),
    protein: z.number().positive(),
    carbs: z.number().positive(),
    fat: z.number().positive(),
  }).optional(),
});

export const updateMealSchema = createMealSchema.partial(); 