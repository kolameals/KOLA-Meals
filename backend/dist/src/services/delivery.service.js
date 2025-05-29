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
exports.getPendingDeliveries = exports.getDeliveriesByUser = exports.updateDeliveryStatus = exports.getDelivery = exports.createDelivery = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createDelivery = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.delivery.create({
        data: Object.assign(Object.assign({}, data), { status: 'PENDING' }),
        include: {
            order: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            },
            addressRel: true
        }
    });
});
exports.createDelivery = createDelivery;
const getDelivery = (deliveryId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.delivery.findUnique({
        where: { id: deliveryId },
        include: {
            order: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            },
            addressRel: true
        }
    });
});
exports.getDelivery = getDelivery;
const updateDeliveryStatus = (deliveryId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const data = { status };
    return prisma_1.default.delivery.update({
        where: { id: deliveryId },
        data,
        include: {
            order: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            },
            addressRel: true
        }
    });
});
exports.updateDeliveryStatus = updateDeliveryStatus;
const getDeliveriesByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.delivery.findMany({
        where: { userId },
        include: {
            order: true,
            addressRel: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
});
exports.getDeliveriesByUser = getDeliveriesByUser;
const getPendingDeliveries = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.delivery.findMany({
        where: {
            status: {
                in: ['PENDING', 'ASSIGNED']
            }
        },
        include: {
            order: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            },
            addressRel: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
});
exports.getPendingDeliveries = getPendingDeliveries;
