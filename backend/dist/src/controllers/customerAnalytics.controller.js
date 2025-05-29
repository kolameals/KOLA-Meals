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
exports.customerAnalyticsController = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const analyticsFilterSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    groupBy: zod_1.z.enum(['day', 'week', 'month']).optional()
});
exports.customerAnalyticsController = {
    getCustomerBehavior(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = analyticsFilterSchema.parse(req.query);
                // Get all orders within date range
                const orders = yield prisma_1.default.order.findMany({
                    where: {
                        createdAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate)
                        }
                    },
                    include: {
                        items: {
                            include: {
                                meal: true
                            }
                        },
                        user: true
                    }
                });
                // Calculate customer behavior metrics
                const totalCustomers = new Set(orders.map(order => order.userId)).size;
                const totalOrders = orders.length;
                const averageOrderValue = orders.reduce((acc, order) => {
                    return acc + order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                }, 0) / totalOrders;
                // Calculate order frequency distribution
                const customerOrderCounts = orders.reduce((acc, order) => {
                    acc[order.userId] = (acc[order.userId] || 0) + 1;
                    return acc;
                }, {});
                const orderFrequencyDistribution = {
                    '1-2 orders': 0,
                    '3-5 orders': 0,
                    '6-10 orders': 0,
                    '10+ orders': 0
                };
                Object.values(customerOrderCounts).forEach(count => {
                    if (count <= 2)
                        orderFrequencyDistribution['1-2 orders']++;
                    else if (count <= 5)
                        orderFrequencyDistribution['3-5 orders']++;
                    else if (count <= 10)
                        orderFrequencyDistribution['6-10 orders']++;
                    else
                        orderFrequencyDistribution['10+ orders']++;
                });
                // Calculate peak ordering hours
                const peakHours = Array.from({ length: 24 }, (_, hour) => ({
                    hour,
                    orderCount: orders.filter(order => order.createdAt.getHours() === hour).length
                }));
                // Calculate repeat customer rate
                const repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
                const repeatCustomerRate = totalCustomers > 0 ? repeatCustomers / totalCustomers : 0;
                res.json({
                    totalCustomers,
                    totalOrders,
                    averageOrderValue,
                    orderFrequencyDistribution,
                    peakHours,
                    repeatCustomerRate
                });
            }
            catch (error) {
                console.error('Error fetching customer behavior:', error);
                res.status(500).json({ error: 'Failed to fetch customer behavior data' });
            }
        });
    },
    getCustomerPreferences(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = analyticsFilterSchema.parse(req.query);
                // Get all orders within date range
                const orders = yield prisma_1.default.order.findMany({
                    where: {
                        createdAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate)
                        }
                    },
                    include: {
                        items: {
                            include: {
                                meal: true
                            }
                        }
                    }
                });
                // Calculate category preferences
                const categoryPreferences = orders.reduce((acc, order) => {
                    order.items.forEach(item => {
                        const category = item.meal.category;
                        acc[category] = (acc[category] || 0) + item.quantity;
                    });
                    return acc;
                }, {});
                // Calculate popular items
                const popularItems = orders.reduce((acc, order) => {
                    order.items.forEach(item => {
                        const itemName = item.meal.name;
                        acc[itemName] = (acc[itemName] || 0) + item.quantity;
                    });
                    return acc;
                }, {});
                // Sort and get top 10 items
                const topItems = Object.entries(popularItems)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([name, count]) => ({ name, count }));
                // Calculate dietary preferences
                const dietaryPreferences = orders.reduce((acc, order) => {
                    order.items.forEach(item => {
                        const dietaryType = item.meal.type || 'Regular';
                        acc[dietaryType] = (acc[dietaryType] || 0) + item.quantity;
                    });
                    return acc;
                }, {});
                res.json({
                    categoryPreferences,
                    topItems,
                    dietaryPreferences
                });
            }
            catch (error) {
                console.error('Error fetching customer preferences:', error);
                res.status(500).json({ error: 'Failed to fetch customer preferences data' });
            }
        });
    },
    getFeedbackAnalysis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = analyticsFilterSchema.parse(req.query);
                // Get all feedback within date range
                const feedback = yield prisma_1.default.mealFeedback.findMany({
                    where: {
                        createdAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate)
                        }
                    },
                    include: {
                        meal: true
                    }
                });
                // Calculate overall satisfaction metrics
                const totalFeedback = feedback.length;
                const averageRating = feedback.reduce((acc, f) => acc + f.rating, 0) / totalFeedback;
                // Calculate rating distribution
                const ratingDistribution = feedback.reduce((acc, f) => {
                    acc[f.rating] = (acc[f.rating] || 0) + 1;
                    return acc;
                }, {});
                // Analyze feedback sentiment
                const sentimentAnalysis = feedback.reduce((acc, f) => {
                    if (f.rating >= 4)
                        acc.positive++;
                    else if (f.rating >= 3)
                        acc.neutral++;
                    else
                        acc.negative++;
                    return acc;
                }, { positive: 0, neutral: 0, negative: 0 });
                // Calculate common themes in feedback
                const commonThemes = feedback.reduce((acc, f) => {
                    var _a;
                    const themes = ((_a = f.comments) === null || _a === void 0 ? void 0 : _a.toLowerCase().split(' ')) || [];
                    themes.forEach(theme => {
                        if (theme.length > 3) { // Ignore short words
                            acc[theme] = (acc[theme] || 0) + 1;
                        }
                    });
                    return acc;
                }, {});
                // Get top themes
                const topThemes = Object.entries(commonThemes)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([theme, count]) => ({ theme, count }));
                res.json({
                    totalFeedback,
                    averageRating,
                    ratingDistribution,
                    sentimentAnalysis,
                    topThemes
                });
            }
            catch (error) {
                console.error('Error fetching feedback analysis:', error);
                res.status(500).json({ error: 'Failed to fetch feedback analysis data' });
            }
        });
    }
};
