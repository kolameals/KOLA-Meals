"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.paymentConfig = {
    cashfree: {
        appId: process.env.CASHFREE_APP_ID,
        secretKey: process.env.CASHFREE_SECRET_KEY,
        mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST',
        webhookSecret: process.env.CASHFREE_WEBHOOK_SECRET
    }
};
