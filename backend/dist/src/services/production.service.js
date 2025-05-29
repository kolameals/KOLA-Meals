"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionService = exports.ProductionService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
class ProductionService {
    createSchedule(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.productionSchedule.create({
                data: {
                    date: data.date,
                    mealType: data.mealType,
                    mealId: data.mealId,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    status: client_1.ProductionStatus.PENDING,
                    items: {
                        create: data.items.map(item => ({
                            rawMaterialId: item.rawMaterialId,
                            requiredQuantity: item.requiredQuantity,
                            status: client_1.ProductionItemStatus.PENDING
                        }))
                    }
                },
                include: {
                    items: {
                        include: {
                            rawMaterial: true
                        }
                    },
                    meal: true
                }
            });
        });
    }
    getSchedules(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.productionSchedule.findMany({
                where: {
                    date: {
                        gte: filters === null || filters === void 0 ? void 0 : filters.startDate,
                        lte: filters === null || filters === void 0 ? void 0 : filters.endDate
                    },
                    mealType: filters === null || filters === void 0 ? void 0 : filters.mealType,
                    status: filters === null || filters === void 0 ? void 0 : filters.status
                },
                include: {
                    items: {
                        include: {
                            rawMaterial: true
                        }
                    },
                    meal: true
                },
                orderBy: {
                    date: 'asc'
                }
            });
        });
    }
    getScheduleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.productionSchedule.findUnique({
                where: { id },
                include: {
                    items: {
                        include: {
                            rawMaterial: true
                        }
                    },
                    meal: true
                }
            });
        });
    }
    updateSchedule(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.productionSchedule.update({
                where: { id },
                data,
                include: {
                    items: {
                        include: {
                            rawMaterial: true
                        }
                    },
                    meal: true
                }
            });
        });
    }
    deleteSchedule(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Delete production items first
            yield prisma_1.default.productionItem.deleteMany({
                where: { productionScheduleId: id }
            });
            // Then delete the schedule
            return prisma_1.default.productionSchedule.delete({
                where: { id }
            });
        });
    }
    updateProductionItem(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.productionItem.update({
                where: { id },
                data,
                include: {
                    rawMaterial: true
                }
            });
        });
    }
    autoGenerateSchedule(date, mealType) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all meals for the specified meal type
            const meals = yield prisma_1.default.meal.findMany({
                where: { type: mealType },
                include: {
                    recipe: {
                        include: {
                            recipeItems: {
                                include: {
                                    rawMaterial: true
                                }
                            }
                        }
                    }
                }
            });
            if (!meals.length) {
                throw new Error(`No meals found for type ${mealType}`);
            }
            // Create a production schedule for each meal
            const schedules = yield Promise.all(meals.map(meal => {
                if (!meal.recipe) {
                    throw new Error(`No recipe found for meal ${meal.name}`);
                }
                return this.createSchedule({
                    date,
                    mealType,
                    mealId: meal.id,
                    startTime: new Date(date.setHours(8, 0, 0, 0)), // 8 AM
                    endTime: new Date(date.setHours(12, 0, 0, 0)), // 12 PM
                    items: meal.recipe.recipeItems.map(item => ({
                        rawMaterialId: item.rawMaterialId,
                        requiredQuantity: item.quantity
                    }))
                });
            }));
            return schedules;
        });
    }
}
exports.ProductionService = ProductionService;
exports.productionService = new ProductionService();
