"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMealDtoSchema = exports.CreateMealDtoSchema = exports.MealCategory = exports.MealType = void 0;
const zod_1 = require("zod");
var MealType;
(function (MealType) {
    MealType["BREAKFAST"] = "BREAKFAST";
    MealType["LUNCH"] = "LUNCH";
    MealType["DINNER"] = "DINNER";
})(MealType || (exports.MealType = MealType = {}));
var MealCategory;
(function (MealCategory) {
    MealCategory["VEGETARIAN"] = "VEGETARIAN";
    MealCategory["NON_VEGETARIAN"] = "NON_VEGETARIAN";
    MealCategory["DESSERT"] = "DESSERT";
    MealCategory["SNACKS"] = "SNACKS";
})(MealCategory || (exports.MealCategory = MealCategory = {}));
// Zod Schemas
exports.CreateMealDtoSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    image: zod_1.z.string().optional(),
    category: zod_1.z.nativeEnum(MealCategory),
    type: zod_1.z.nativeEnum(MealType),
    price: zod_1.z.number().positive()
});
exports.UpdateMealDtoSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    category: zod_1.z.nativeEnum(MealCategory).optional(),
    type: zod_1.z.nativeEnum(MealType).optional(),
    price: zod_1.z.number().positive().optional()
});
