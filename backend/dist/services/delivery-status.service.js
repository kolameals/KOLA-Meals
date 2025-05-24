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
exports.deliveryStatusService = void 0;
const client_1 = require("@prisma/client");
const error_types_1 = require("../types/error.types");
const logger_config_1 = __importDefault(require("../config/logger.config"));
const prisma = new client_1.PrismaClient();
exports.deliveryStatusService = {
    getDeliveryStatus(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deliveryStatus = yield prisma.deliveryStatus.findUnique({
                    where: { orderId },
                    include: {
                        deliveryPartner: {
                            select: {
                                id: true,
                                name: true,
                                phoneNumber: true
                            }
                        }
                    }
                });
                if (!deliveryStatus) {
                    throw new error_types_1.AppError('Delivery status not found', 404);
                }
                return deliveryStatus;
            }
            catch (error) {
                logger_config_1.default.error('Error fetching delivery status:', { error, orderId });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error fetching delivery status', 500);
            }
        });
    },
    updateDeliveryStatus(orderId, status, oldTiffinStatus, deliveryPartnerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deliveryStatus = yield prisma.deliveryStatus.upsert({
                    where: { orderId },
                    update: {
                        status,
                        oldTiffinStatus,
                        deliveryTime: new Date(),
                        deliveryPartnerId
                    },
                    create: {
                        orderId,
                        status,
                        oldTiffinStatus,
                        deliveryTime: new Date(),
                        deliveryPartnerId
                    }
                });
                return deliveryStatus;
            }
            catch (error) {
                logger_config_1.default.error('Error updating delivery status:', { error, orderId, status });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error updating delivery status', 500);
            }
        });
    },
    getDeliveryPartnerDeliveries(deliveryPartnerId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);
                const deliveries = yield prisma.deliveryStatus.findMany({
                    where: {
                        deliveryPartnerId,
                        deliveryTime: {
                            gte: startOfDay,
                            lte: endOfDay
                        }
                    },
                    include: {
                        order: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                        phoneNumber: true
                                    }
                                }
                            }
                        }
                    }
                });
                return deliveries;
            }
            catch (error) {
                logger_config_1.default.error('Error fetching delivery partner deliveries:', { error, deliveryPartnerId, date });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error fetching delivery partner deliveries', 500);
            }
        });
    }
};
