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
exports.dailyMealService = exports.DailyMealService = void 0;
const client_1 = require("@prisma/client");
const error_types_1 = require("../types/error.types");
const logger_config_1 = __importDefault(require("../config/logger.config"));
const prisma = new client_1.PrismaClient();
class DailyMealService {
    getDailyMeals(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);
                const dailyMeal = yield prisma.dailyMeal.findFirst({
                    where: {
                        date: {
                            gte: startOfDay,
                            lte: endOfDay
                        }
                    },
                    include: {
                        breakfast: true,
                        lunch: true,
                        dinner: true
                    }
                });
                if (!dailyMeal) {
                    throw new error_types_1.AppError('No meals found for this date', 404);
                }
                return dailyMeal;
            }
            catch (error) {
                logger_config_1.default.error('Error in getDailyMeals:', error);
                throw error;
            }
        });
    }
    skipMeal(userId, date, mealType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);
                const dailyMeal = yield prisma.dailyMeal.findFirst({
                    where: {
                        date: {
                            gte: startOfDay,
                            lte: endOfDay
                        }
                    }
                });
                if (!dailyMeal) {
                    throw new error_types_1.AppError('No meals found for this date', 404);
                }
                const now = new Date();
                if (now > dailyMeal.cutoffTime) {
                    throw new error_types_1.AppError('Cannot skip meal after cutoff time', 400);
                }
                const skipStatus = dailyMeal.skipStatus;
                skipStatus[mealType] = true;
                const updatedDailyMeal = yield prisma.dailyMeal.update({
                    where: { id: dailyMeal.id },
                    data: {
                        skipStatus: skipStatus
                    }
                });
                return updatedDailyMeal;
            }
            catch (error) {
                logger_config_1.default.error('Error in skipMeal:', error);
                throw error;
            }
        });
    }
    createDailyMeal(date, breakfastId, lunchId, dinnerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cutoffTime = new Date(date);
                cutoffTime.setHours(20, 0, 0, 0); // 8 PM cutoff
                const dailyMeal = yield prisma.dailyMeal.create({
                    data: {
                        date,
                        breakfastId,
                        lunchId,
                        dinnerId,
                        cutoffTime,
                        skipStatus: {
                            breakfast: false,
                            lunch: false,
                            dinner: false
                        }
                    },
                    include: {
                        breakfast: true,
                        lunch: true,
                        dinner: true
                    }
                });
                return dailyMeal;
            }
            catch (error) {
                logger_config_1.default.error('Error in createDailyMeal:', error);
                throw error;
            }
        });
    }
}
exports.DailyMealService = DailyMealService;
exports.dailyMealService = new DailyMealService();
