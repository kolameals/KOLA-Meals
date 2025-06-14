import { z } from 'zod';
import { CostType, CostFrequency } from '../types/cost.types.js';

export const costSchema = z.object({
  category_id: z.number(),
  amount: z.number().positive(),
  description: z.string().optional(),
  date: z.string().transform((str) => new Date(str)),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional()
});

export type CostSchema = z.infer<typeof costSchema>;

export const staffCostSchema = z.object({
  user_id: z.number(),
  base_salary: z.number().positive(),
  allowances: z.number().min(0).optional(),
  deductions: z.number().min(0).optional(),
  payment_frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ONE_TIME'] as const),
  bank_details: z.record(z.any()).optional()
});

export const equipmentCostSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  purchase_date: z.string().transform(str => new Date(str)).optional(),
  purchase_amount: z.number().positive().optional(),
  emi_amount: z.number().positive().optional(),
  emi_frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ONE_TIME'] as const).optional(),
  total_emis: z.number().int().positive().optional(),
  remaining_emis: z.number().int().min(0).optional()
});

export const facilityCostSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  rent_amount: z.number().positive().optional(),
  maintenance_amount: z.number().min(0).optional(),
  utilities_amount: z.number().min(0).optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ONE_TIME'] as const)
});

export const costCategorySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(['FIXED', 'VARIABLE', 'RAW_MATERIAL', 'STAFF', 'EQUIPMENT', 'FACILITY'] as const),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ONE_TIME'] as const)
}); 