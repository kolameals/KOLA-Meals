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
exports.resumeSubscription = exports.pauseSubscription = exports.cancelSubscription = exports.updateSubscription = exports.getSubscription = exports.createSubscription = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
const createSubscription = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, planId, status, startDate, endDate } = data;
    // Calculate end date (30 days from now) if not provided
    const calculatedEndDate = endDate || (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d; })();
    return prisma_1.default.subscription.create({
        data: {
            userId,
            planId,
            status: status || client_1.SubscriptionStatus.ACTIVE,
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
    return prisma_1.default.subscription.findUnique({
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
    return prisma_1.default.subscription.update({
        where: { userId },
        data: Object.assign(Object.assign({}, data), { status: data.status }),
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
    return prisma_1.default.subscription.update({
        where: { userId },
        data: {
            status: client_1.SubscriptionStatus.CANCELLED
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
    return prisma_1.default.subscription.update({
        where: { userId },
        data: {
            status: client_1.SubscriptionStatus.PAUSED
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
    return prisma_1.default.subscription.update({
        where: { userId },
        data: {
            status: client_1.SubscriptionStatus.ACTIVE
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
