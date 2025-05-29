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
exports.analyticsController = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const analyticsFiltersSchema = zod_1.z.object({
    startDate: zod_1.z.string().transform(str => new Date(str)),
    endDate: zod_1.z.string().transform(str => new Date(str)),
    groupBy: zod_1.z.enum(['day', 'week', 'month']).optional(),
});
exports.analyticsController = {
    getRevenueData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate, groupBy = 'day' } = analyticsFiltersSchema.parse(req.query);
                const orders = yield prisma_1.default.order.findMany({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                        status: client_1.OrderStatus.DELIVERED,
                    },
                    include: {
                        items: true,
                    },
                });
                // Group orders by date
                const groupedOrders = orders.reduce((acc, order) => {
                    const date = order.createdAt.toISOString().split('T')[0];
                    if (!acc[date]) {
                        acc[date] = {
                            amount: 0,
                            orderCount: 0,
                        };
                    }
                    acc[date].amount += order.amount;
                    acc[date].orderCount += 1;
                    return acc;
                }, {});
                // Calculate average order value
                const revenueData = Object.entries(groupedOrders).map(([date, data]) => ({
                    date,
                    amount: data.amount,
                    orderCount: data.orderCount,
                    averageOrderValue: data.amount / data.orderCount,
                }));
                res.json({ success: true, data: { revenue: revenueData } });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    res.status(400).json({ success: false, error: error.errors });
                }
                else {
                    res.status(500).json({ success: false, error: 'Internal server error' });
                }
            }
        });
    },
    getSalesTrends(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = analyticsFiltersSchema.parse(req.query);
                // Calculate previous period
                const periodLength = endDate.getTime() - startDate.getTime();
                const previousStartDate = new Date(startDate.getTime() - periodLength);
                const previousEndDate = new Date(endDate.getTime() - periodLength);
                // Get current period orders
                const currentOrders = yield prisma_1.default.order.findMany({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                        status: client_1.OrderStatus.DELIVERED,
                    },
                });
                // Get previous period orders
                const previousOrders = yield prisma_1.default.order.findMany({
                    where: {
                        createdAt: {
                            gte: previousStartDate,
                            lte: previousEndDate,
                        },
                        status: client_1.OrderStatus.DELIVERED,
                    },
                });
                const currentTotal = currentOrders.reduce((sum, order) => sum + order.amount, 0);
                const previousTotal = previousOrders.reduce((sum, order) => sum + order.amount, 0);
                const growthRate = previousTotal === 0 ? 100 : ((currentTotal - previousTotal) / previousTotal) * 100;
                res.json({
                    success: true,
                    data: {
                        salesTrends: [{
                                period: 'Current',
                                totalSales: currentTotal,
                                previousPeriodSales: previousTotal,
                                growthRate,
                            }],
                    },
                });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    res.status(400).json({ success: false, error: error.errors });
                }
                else {
                    res.status(500).json({ success: false, error: 'Internal server error' });
                }
            }
        });
    },
    getPerformanceMetrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = analyticsFiltersSchema.parse(req.query);
                // Get orders for the period
                const orders = yield prisma_1.default.order.findMany({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                        status: client_1.OrderStatus.DELIVERED,
                    },
                    include: {
                        items: true,
                    },
                });
                // Calculate metrics
                const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
                const totalOrders = orders.length;
                const averageOrderValue = totalOrders === 0 ? 0 : totalRevenue / totalOrders;
                // Get top selling items
                const itemSales = orders.reduce((acc, order) => {
                    order.items.forEach((item) => {
                        if (!acc[item.mealId]) {
                            acc[item.mealId] = {
                                quantity: 0,
                                revenue: 0,
                            };
                        }
                        acc[item.mealId].quantity += item.quantity;
                        acc[item.mealId].revenue += item.price * item.quantity;
                    });
                    return acc;
                }, {});
                // Get meal details for top selling items
                const topSellingItems = yield Promise.all(Object.entries(itemSales)
                    .sort((a, b) => b[1].quantity - a[1].quantity)
                    .slice(0, 5)
                    .map((_a) => __awaiter(this, [_a], void 0, function* ([mealId, sales]) {
                    const meal = yield prisma_1.default.meal.findUnique({
                        where: { id: mealId },
                    });
                    return {
                        id: mealId,
                        name: (meal === null || meal === void 0 ? void 0 : meal.name) || 'Unknown',
                        quantity: sales.quantity,
                        revenue: sales.revenue,
                    };
                })));
                // Get customer metrics
                const uniqueCustomers = new Set(orders.map(order => order.userId));
                const newCustomers = yield prisma_1.default.user.count({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                });
                res.json({
                    success: true,
                    data: {
                        performanceMetrics: {
                            totalRevenue,
                            totalOrders,
                            averageOrderValue,
                            topSellingItems,
                            customerMetrics: {
                                totalCustomers: uniqueCustomers.size,
                                newCustomers,
                                returningCustomers: uniqueCustomers.size - newCustomers,
                            },
                        },
                    },
                });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    res.status(400).json({ success: false, error: error.errors });
                }
                else {
                    res.status(500).json({ success: false, error: 'Internal server error' });
                }
            }
        });
    },
};
