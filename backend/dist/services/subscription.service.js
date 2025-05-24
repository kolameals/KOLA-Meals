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
exports.resumeSubscription = exports.pauseSubscription = exports.cancelSubscription = exports.updateSubscription = exports.getSubscription = exports.createSubscription = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createSubscription = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, status, startDate, endDate } = data;
    // Calculate end date (30 days from now) if not provided
    const calculatedEndDate = endDate || (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d; })();
    return prisma.subscription.create({
        data: {
            userId,
            status: status || 'ACTIVE',
            startDate: startDate || new Date(),
            endDate: calculatedEndDate
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            }
        }
    });
});
exports.createSubscription = createSubscription;
const getSubscription = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.subscription.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            }
        }
    });
});
exports.getSubscription = getSubscription;
const updateSubscription = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.subscription.update({
        where: { userId },
        data,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            }
        }
    });
});
exports.updateSubscription = updateSubscription;
const cancelSubscription = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.subscription.update({
        where: { userId },
        data: {
            status: 'CANCELLED'
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            }
        }
    });
});
exports.cancelSubscription = cancelSubscription;
const pauseSubscription = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.subscription.update({
        where: { userId },
        data: {
            status: 'PAUSED'
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            }
        }
    });
});
exports.pauseSubscription = pauseSubscription;
const resumeSubscription = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.subscription.update({
        where: { userId },
        data: {
            status: 'ACTIVE'
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            }
        }
    });
});
exports.resumeSubscription = resumeSubscription;
