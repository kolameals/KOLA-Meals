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
exports.paymentService = exports.PaymentService = void 0;
const error_types_1 = require("../types/error.types");
const prisma_1 = __importDefault(require("../lib/prisma"));
const logger_config_1 = __importDefault(require("../config/logger.config"));
class PaymentService {
    createPayment(userId, paymentDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield prisma_1.default.payment.create({
                    data: Object.assign({ userId }, paymentDetails)
                });
                return payment;
            }
            catch (error) {
                logger_config_1.default.error('Error in createPayment:', error);
                throw error;
            }
        });
    }
    verifyPayment(userId, verificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, paymentSessionId } = verificationData;
                const payment = yield prisma_1.default.payment.findFirst({
                    where: {
                        userId,
                        orderId
                    }
                });
                if (!payment) {
                    throw new error_types_1.AppError('Payment not found', 404);
                }
                // Verify payment logic here
                const updatedPayment = yield prisma_1.default.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'COMPLETED',
                        paymentId: paymentSessionId
                    }
                });
                return updatedPayment;
            }
            catch (error) {
                logger_config_1.default.error('Error in verifyPayment:', error);
                throw error;
            }
        });
    }
    handleWebhook(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Handle webhook logic here
                logger_config_1.default.info('Webhook received:', payload);
            }
            catch (error) {
                logger_config_1.default.error('Error handling webhook:', error);
                throw error;
            }
        });
    }
    // Helper methods
    createPaymentSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement actual payment provider integration
            return {
                paymentSessionId: `mock-session-${data.orderId}`,
                paymentLink: `https://test.payment.com/pay/${data.orderId}`,
            };
        });
    }
    verifyPaymentSession(paymentSessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement actual payment provider verification
            return {
                paymentId: `mock-payment-${paymentSessionId}`,
                status: 'SUCCESS',
            };
        });
    }
}
exports.PaymentService = PaymentService;
exports.paymentService = new PaymentService();
