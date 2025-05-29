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
const express_1 = require("express");
const payment_service_1 = require("../services/payment.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
// Create payment
router.post('/create', (0, auth_middleware_1.authMiddleware)(['CUSTOMER']), (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        required: ['amount', 'currency', 'customerName', 'customerEmail', 'customerPhone'],
        properties: {
            amount: { type: 'number', minimum: 1 },
            currency: { type: 'string', enum: ['INR'] },
            customerName: { type: 'string', minLength: 1 },
            customerEmail: { type: 'string', format: 'email' },
            customerPhone: { type: 'string', pattern: '^[0-9]{10}$' }
        }
    }
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const paymentDetails = Object.assign({ orderId }, req.body);
        const payment = yield payment_service_1.paymentService.createPayment(user.id, paymentDetails);
        res.json(payment);
    }
    catch (error) {
        next(error);
    }
}));
// Verify payment
router.post('/verify', (0, auth_middleware_1.authMiddleware)(['CUSTOMER']), (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        required: ['orderId', 'paymentSessionId'],
        properties: {
            orderId: { type: 'string' },
            paymentSessionId: { type: 'string' }
        }
    }
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const result = yield payment_service_1.paymentService.verifyPayment(user.id, req.body);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}));
// Webhook endpoint
router.post('/webhook', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield payment_service_1.paymentService.handleWebhook(req.body);
        res.status(200).send('OK');
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
