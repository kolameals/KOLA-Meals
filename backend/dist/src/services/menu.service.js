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
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.menuService = {
    // Menu Item Operations
    createMenuItem(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.menuItem.create({
                data: {
                    mealId: data.mealId,
                    dailyMenuId: data.dailyMenuId,
                    mealType: data.mealType,
                    price: data.price,
                },
                include: {
                    meal: true,
                },
            });
        });
    },
    updateMenuItem(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.menuItem.update({
                where: { id },
                data: {
                    mealId: data.mealId,
                    mealType: data.mealType,
                    price: data.price,
                },
                include: {
                    meal: true,
                },
            });
        });
    },
    deleteMenuItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.menuItem.delete({
                where: { id },
            });
        });
    },
    // Daily Menu Operations
    createDailyMenu(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return prisma.dailyMenu.create({
                data: {
                    date: new Date(data.date),
                    items: {
                        create: ((_a = data.items) === null || _a === void 0 ? void 0 : _a.map(item => ({
                            mealId: item.mealId,
                            dailyMenuId: item.dailyMenuId,
                            mealType: item.mealType,
                            price: item.price,
                        }))) || [],
                    },
                },
                include: {
                    items: {
                        include: {
                            meal: true,
                        },
                    },
                },
            });
        });
    },
    updateDailyMenu(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.dailyMenu.update({
                where: { id },
                data: {
                    date: data.date ? new Date(data.date) : undefined,
                    items: data.items ? {
                        deleteMany: {},
                        create: data.items.map(item => ({
                            mealId: item.mealId,
                            dailyMenuId: item.dailyMenuId,
                            mealType: item.mealType,
                            price: item.price,
                        })),
                    } : undefined,
                },
                include: {
                    items: {
                        include: {
                            meal: true,
                        },
                    },
                },
            });
        });
    },
    getDailyMenuById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.dailyMenu.findUnique({
                where: { id },
                include: {
                    items: {
                        include: {
                            meal: true,
                        },
                    },
                },
            });
        });
    },
    getDailyMenuByDate(date) {
        return __awaiter(this, void 0, void 0, function* () {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            return prisma.dailyMenu.findFirst({
                where: {
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
                include: {
                    items: {
                        include: {
                            meal: true,
                        },
                    },
                },
            });
        });
    },
    // Menu Calendar Operations
    createMenuCalendar(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return prisma.menuCalendar.create({
                data: {
                    startDate: new Date(data.startDate),
                    endDate: new Date(data.endDate),
                    dailyMenus: {
                        create: ((_a = data.dailyMenus) === null || _a === void 0 ? void 0 : _a.map(menu => {
                            var _a;
                            return ({
                                date: new Date(menu.date),
                                items: {
                                    create: ((_a = menu.items) === null || _a === void 0 ? void 0 : _a.map(item => ({
                                        mealId: item.mealId,
                                        dailyMenuId: item.dailyMenuId,
                                        mealType: item.mealType,
                                        price: item.price,
                                    }))) || [],
                                },
                            });
                        })) || [],
                    },
                },
                include: {
                    dailyMenus: {
                        include: {
                            items: {
                                include: {
                                    meal: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    },
    updateMenuCalendar(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.menuCalendar.update({
                where: { id },
                data: {
                    startDate: data.startDate ? new Date(data.startDate) : undefined,
                    endDate: data.endDate ? new Date(data.endDate) : undefined,
                    dailyMenus: data.dailyMenus ? {
                        deleteMany: {},
                        create: data.dailyMenus.map(menu => {
                            var _a;
                            return ({
                                date: new Date(menu.date),
                                items: {
                                    create: ((_a = menu.items) === null || _a === void 0 ? void 0 : _a.map(item => ({
                                        mealId: item.mealId,
                                        dailyMenuId: item.dailyMenuId,
                                        mealType: item.mealType,
                                        price: item.price,
                                    }))) || [],
                                },
                            });
                        }),
                    } : undefined,
                },
                include: {
                    dailyMenus: {
                        include: {
                            items: {
                                include: {
                                    meal: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    },
    getMenuCalendarById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.menuCalendar.findUnique({
                where: { id },
                include: {
                    dailyMenus: {
                        include: {
                            items: {
                                include: {
                                    meal: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    },
    getMenuCalendarByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.menuCalendar.findFirst({
                where: {
                    startDate: {
                        lte: new Date(endDate),
                    },
                    endDate: {
                        gte: new Date(startDate),
                    },
                },
                include: {
                    dailyMenus: {
                        include: {
                            items: {
                                include: {
                                    meal: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    },
};
