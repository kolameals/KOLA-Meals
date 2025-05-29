"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.costCategorySchema = exports.facilityCostSchema = exports.equipmentCostSchema = exports.staffCostSchema = exports.costSchema = void 0;
const zod_1 = require("zod");
exports.costSchema = zod_1.z.object({
    category_id: zod_1.z.number(),
    amount: zod_1.z.number().positive(),
    description: zod_1.z.string().optional(),
    date: zod_1.z.string().transform((str) => new Date(str)),
    status: zod_1.z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional()
});
exports.staffCostSchema = zod_1.z.object({
    user_id: zod_1.z.number(),
    base_salary: zod_1.z.number().positive(),
    allowances: zod_1.z.number().min(0).optional(),
    deductions: zod_1.z.number().min(0).optional(),
    payment_frequency: zod_1.z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ONE_TIME']),
    bank_details: zod_1.z.record(zod_1.z.any()).optional()
});
exports.equipmentCostSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    purchase_date: zod_1.z.string().transform(str => new Date(str)).optional(),
    purchase_amount: zod_1.z.number().positive().optional(),
    emi_amount: zod_1.z.number().positive().optional(),
    emi_frequency: zod_1.z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ONE_TIME']).optional(),
    total_emis: zod_1.z.number().int().positive().optional(),
    remaining_emis: zod_1.z.number().int().min(0).optional()
});
exports.facilityCostSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    rent_amount: zod_1.z.number().positive().optional(),
    maintenance_amount: zod_1.z.number().min(0).optional(),
    utilities_amount: zod_1.z.number().min(0).optional(),
    frequency: zod_1.z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ONE_TIME'])
});
exports.costCategorySchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    type: zod_1.z.enum(['FIXED', 'VARIABLE', 'RAW_MATERIAL', 'STAFF', 'EQUIPMENT', 'FACILITY']),
    frequency: zod_1.z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ONE_TIME'])
});
