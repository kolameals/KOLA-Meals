"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMenuCalendarSchema = exports.createMenuCalendarSchema = exports.updateDailyMenuSchema = exports.createDailyMenuSchema = exports.updateMenuItemSchema = exports.createMenuItemSchema = void 0;
const zod_1 = require("zod");
const meal_types_1 = require("./meal.types");
// Zod Schemas
exports.createMenuItemSchema = zod_1.z.object({
    mealId: zod_1.z.string(),
    dailyMenuId: zod_1.z.string(),
    mealType: zod_1.z.nativeEnum(meal_types_1.MealType),
    price: zod_1.z.number().positive(),
});
exports.updateMenuItemSchema = zod_1.z.object({
    mealId: zod_1.z.string().optional(),
    mealType: zod_1.z.nativeEnum(meal_types_1.MealType).optional(),
    price: zod_1.z.number().positive().optional(),
});
exports.createDailyMenuSchema = zod_1.z.object({
    date: zod_1.z.date(),
    items: zod_1.z.array(exports.createMenuItemSchema).optional(),
});
exports.updateDailyMenuSchema = zod_1.z.object({
    date: zod_1.z.date().optional(),
    items: zod_1.z.array(exports.createMenuItemSchema).optional(),
});
exports.createMenuCalendarSchema = zod_1.z.object({
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    dailyMenus: zod_1.z.array(exports.createDailyMenuSchema).optional(),
});
exports.updateMenuCalendarSchema = zod_1.z.object({
    startDate: zod_1.z.date().optional(),
    endDate: zod_1.z.date().optional(),
    dailyMenus: zod_1.z.array(exports.createDailyMenuSchema).optional(),
});
