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
exports.feedbackService = exports.FeedbackService = void 0;
const client_1 = require("@prisma/client");
const logger_config_1 = __importDefault(require("../config/logger.config"));
const prisma = new client_1.PrismaClient();
class FeedbackService {
    submitFeedback(userId, mealId, rating, comments, categories) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedback = yield prisma.mealFeedback.create({
                    data: {
                        userId,
                        mealId,
                        rating,
                        comments,
                        categories: categories
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                });
                return feedback;
            }
            catch (error) {
                logger_config_1.default.error('Error in submitFeedback:', error);
                throw error;
            }
        });
    }
    getMealFeedback(mealId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedback = yield prisma.mealFeedback.findMany({
                    where: { mealId },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                });
                return feedback;
            }
            catch (error) {
                logger_config_1.default.error('Error in getMealFeedback:', error);
                throw error;
            }
        });
    }
    getMealStats(mealId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedback = yield prisma.mealFeedback.findMany({
                    where: { mealId }
                });
                if (feedback.length === 0) {
                    return {
                        averageRating: 0,
                        totalFeedback: 0,
                        categoryAverages: {
                            taste: 0,
                            packaging: 0,
                            portion: 0
                        }
                    };
                }
                const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
                const averageRating = totalRating / feedback.length;
                const categorySums = feedback.reduce((sums, f) => {
                    const categories = f.categories;
                    return {
                        taste: sums.taste + categories.taste,
                        packaging: sums.packaging + categories.packaging,
                        portion: sums.portion + categories.portion
                    };
                }, { taste: 0, packaging: 0, portion: 0 });
                return {
                    averageRating,
                    totalFeedback: feedback.length,
                    categoryAverages: {
                        taste: categorySums.taste / feedback.length,
                        packaging: categorySums.packaging / feedback.length,
                        portion: categorySums.portion / feedback.length
                    }
                };
            }
            catch (error) {
                logger_config_1.default.error('Error in getMealStats:', error);
                throw error;
            }
        });
    }
}
exports.FeedbackService = FeedbackService;
exports.feedbackService = new FeedbackService();
