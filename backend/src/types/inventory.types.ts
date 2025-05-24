import { z } from 'zod';

// Stock Types
export const StockSchema = z.object({
  id: z.string(),
  rawMaterialId: z.string(),
  quantity: z.number(),
  unit: z.string(),
  minimumQuantity: z.number(),
  reorderPoint: z.number(),
  lastUpdated: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateStockDtoSchema = z.object({
  rawMaterialId: z.string(),
  quantity: z.number(),
  unit: z.string(),
  minimumQuantity: z.number(),
  reorderPoint: z.number(),
});

export const UpdateStockDtoSchema = z.object({
  quantity: z.number().optional(),
  unit: z.string().optional(),
  minimumQuantity: z.number().optional(),
  reorderPoint: z.number().optional(),
});

export type Stock = z.infer<typeof StockSchema>;
export type CreateStockDto = z.infer<typeof CreateStockDtoSchema>;
export type UpdateStockDto = z.infer<typeof UpdateStockDtoSchema>;

// Stock Movement Types
export const StockMovementSchema = z.object({
  id: z.string(),
  stockId: z.string(),
  type: z.enum(['IN', 'OUT', 'WASTE']),
  quantity: z.number(),
  reason: z.string(),
  date: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateStockMovementDtoSchema = z.object({
  stockId: z.string(),
  type: z.enum(['IN', 'OUT', 'WASTE']),
  quantity: z.number(),
  reason: z.string(),
  date: z.date(),
});

export type StockMovement = z.infer<typeof StockMovementSchema>;
export type CreateStockMovementDto = z.infer<typeof CreateStockMovementDtoSchema>;

// Waste Tracking Types
export const WasteRecordSchema = z.object({
  id: z.string(),
  stockId: z.string(),
  quantity: z.number(),
  reason: z.string(),
  date: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateWasteRecordDtoSchema = z.object({
  stockId: z.string(),
  quantity: z.number(),
  reason: z.string(),
  date: z.date(),
});

export type WasteRecord = z.infer<typeof WasteRecordSchema>;
export type CreateWasteRecordDto = z.infer<typeof CreateWasteRecordDtoSchema>; 