"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderSchema = exports.createOrderSchema = exports.orderValidation = void 0;
const client_1 = require("@prisma/client");
exports.orderValidation = {
    getOrderById: {
        params: {
            type: 'object',
            required: ['orderId'],
            properties: {
                orderId: { type: 'string', format: 'uuid' }
            }
        }
    },
    createOrder: {
        body: {
            type: 'object',
            required: ['items'],
            properties: {
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['mealId', 'quantity'],
                        properties: {
                            mealId: { type: 'string', format: 'uuid' },
                            quantity: { type: 'integer', minimum: 1 }
                        }
                    }
                },
                deliveryAddress: { type: 'string' },
                deliveryInstructions: { type: 'string' }
            }
        }
    },
    updateOrderStatus: {
        params: {
            type: 'object',
            required: ['orderId'],
            properties: {
                orderId: { type: 'string', format: 'uuid' }
            }
        },
        body: {
            type: 'object',
            required: ['status'],
            properties: {
                status: {
                    type: 'string',
                    enum: Object.values(client_1.OrderStatus)
                }
            }
        }
    },
    cancelOrder: {
        params: {
            type: 'object',
            required: ['orderId'],
            properties: {
                orderId: { type: 'string', format: 'uuid' }
            }
        }
    }
};
exports.createOrderSchema = {
    items: {
        type: 'array',
        items: {
            type: 'object',
            required: ['mealId', 'quantity'],
            properties: {
                mealId: { type: 'string', format: 'uuid' },
                quantity: { type: 'integer', minimum: 1 }
            }
        }
    },
    deliveryAddress: { type: 'string' },
    deliveryInstructions: { type: 'string' }
};
exports.updateOrderSchema = {
    status: {
        type: 'string',
        enum: Object.values(client_1.OrderStatus)
    }
};
