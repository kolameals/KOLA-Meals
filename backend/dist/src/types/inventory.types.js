"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWasteRecordDtoSchema = exports.WasteRecordSchema = exports.CreateStockMovementDtoSchema = exports.StockMovementSchema = exports.UpdateStockDtoSchema = exports.CreateStockDtoSchema = exports.StockSchema = void 0;
const zod_1 = require("zod");
// Stock Types
exports.StockSchema = zod_1.z.object({
    id: zod_1.z.string(),
    rawMaterialId: zod_1.z.string(),
    quantity: zod_1.z.number(),
    unit: zod_1.z.string(),
    minimumQuantity: zod_1.z.number(),
    reorderPoint: zod_1.z.number(),
    lastUpdated: zod_1.z.date(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.CreateStockDtoSchema = zod_1.z.object({
    rawMaterialId: zod_1.z.string(),
    quantity: zod_1.z.number(),
    unit: zod_1.z.string(),
    minimumQuantity: zod_1.z.number(),
    reorderPoint: zod_1.z.number(),
});
exports.UpdateStockDtoSchema = zod_1.z.object({
    quantity: zod_1.z.number().optional(),
    unit: zod_1.z.string().optional(),
    minimumQuantity: zod_1.z.number().optional(),
    reorderPoint: zod_1.z.number().optional(),
});
// Stock Movement Types
exports.StockMovementSchema = zod_1.z.object({
    id: zod_1.z.string(),
    stockId: zod_1.z.string(),
    type: zod_1.z.enum(['IN', 'OUT', 'WASTE']),
    quantity: zod_1.z.number(),
    reason: zod_1.z.string(),
    date: zod_1.z.date(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.CreateStockMovementDtoSchema = zod_1.z.object({
    stockId: zod_1.z.string(),
    type: zod_1.z.enum(['IN', 'OUT', 'WASTE']),
    quantity: zod_1.z.number(),
    reason: zod_1.z.string(),
    date: zod_1.z.date(),
});
// Waste Tracking Types
exports.WasteRecordSchema = zod_1.z.object({
    id: zod_1.z.string(),
    stockId: zod_1.z.string(),
    quantity: zod_1.z.number(),
    reason: zod_1.z.string(),
    date: zod_1.z.date(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.CreateWasteRecordDtoSchema = zod_1.z.object({
    stockId: zod_1.z.string(),
    quantity: zod_1.z.number(),
    reason: zod_1.z.string(),
    date: zod_1.z.date(),
});
