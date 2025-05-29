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
exports.feedbackService = void 0;
const error_types_1 = require("../types/error.types");
const prisma_1 = __importDefault(require("../lib/prisma"));
const logger_config_1 = __importDefault(require("../config/logger.config"));
class FeedbackService {
    getFeedbacks(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const where = Object.assign(Object.assign(Object.assign({}, ((filters === null || filters === void 0 ? void 0 : filters.type) && { type: filters.type })), ((filters === null || filters === void 0 ? void 0 : filters.status) && { status: filters.status })), ((filters === null || filters === void 0 ? void 0 : filters.userId) && { userId: filters.userId }));
                const feedbacks = yield prisma_1.default.feedback.findMany({
                    where,
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        responses: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                        issues: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
                return feedbacks;
            }
            catch (error) {
                logger_config_1.default.error('Error fetching feedbacks:', { error });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error fetching feedbacks', 500);
            }
        });
    }
    getFeedbackById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedback = yield prisma_1.default.feedback.findUnique({
                    where: { id },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        responses: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                        issues: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                });
                if (!feedback) {
                    throw new error_types_1.AppError('Feedback not found', 404);
                }
                return feedback;
            }
            catch (error) {
                logger_config_1.default.error('Error fetching feedback:', { error, id });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error fetching feedback', 500);
            }
        });
    }
    createFeedback(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedback = yield prisma_1.default.feedback.create({
                    data: {
                        userId: data.userId,
                        type: data.type,
                        title: data.title,
                        description: data.description,
                        rating: data.rating,
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });
                return feedback;
            }
            catch (error) {
                logger_config_1.default.error('Error creating feedback:', { error, data });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error creating feedback', 500);
            }
        });
    }
    updateFeedbackStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedback = yield prisma_1.default.feedback.update({
                    where: { id },
                    data: { status },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });
                return feedback;
            }
            catch (error) {
                logger_config_1.default.error('Error updating feedback status:', { error, id, status });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error updating feedback status', 500);
            }
        });
    }
    addResponse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prisma_1.default.feedbackResponse.create({
                    data: {
                        feedbackId: data.feedbackId,
                        userId: data.userId,
                        message: data.message,
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });
                return response;
            }
            catch (error) {
                logger_config_1.default.error('Error adding feedback response:', { error, data });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error adding feedback response', 500);
            }
        });
    }
    createIssue(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const issue = yield prisma_1.default.issue.create({
                    data: {
                        feedbackId: data.feedbackId,
                        title: data.title,
                        description: data.description,
                        priority: data.priority,
                        assignedTo: data.assignedTo,
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });
                return issue;
            }
            catch (error) {
                logger_config_1.default.error('Error creating issue:', { error, data });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error creating issue', 500);
            }
        });
    }
    updateIssueStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const issue = yield prisma_1.default.issue.update({
                    where: { id },
                    data: { status },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });
                return issue;
            }
            catch (error) {
                logger_config_1.default.error('Error updating issue status:', { error, id, status });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error updating issue status', 500);
            }
        });
    }
    assignIssue(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const issue = yield prisma_1.default.issue.update({
                    where: { id },
                    data: { assignedTo: userId },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });
                return issue;
            }
            catch (error) {
                logger_config_1.default.error('Error assigning issue:', { error, id, userId });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error assigning issue', 500);
            }
        });
    }
    submitFeedback(userId, mealId, rating, comments, categories) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedback = yield prisma_1.default.mealFeedback.create({
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
                const feedback = yield prisma_1.default.mealFeedback.findMany({
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
                const feedback = yield prisma_1.default.mealFeedback.findMany({
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
exports.feedbackService = new FeedbackService();
