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
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
/**
 * Get all orders (admin only)
 */
router.get('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma_1.default.order.findMany({
            include: {
                items: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({ success: true, data: orders });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
}));
/**
 * Get order by ID (admin and customer)
 */
router.get('/:orderId', (0, auth_middleware_1.authMiddleware)(['ADMIN', 'CUSTOMER']), (0, validation_middleware_1.validateRequest)({
    params: {
        type: 'object',
        required: ['orderId'],
        properties: {
            orderId: { type: 'string', format: 'uuid' }
        }
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const order = yield prisma_1.default.order.findUnique({
            where: { id: orderId },
            include: {
                items: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // If user is customer, verify they own the order
        const user = req.user;
        if ((user === null || user === void 0 ? void 0 : user.role) === 'CUSTOMER' && order.userId !== user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.json({ success: true, data: order });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching order' });
    }
}));
/**
 * Create new order (customer only)
 */
router.post('/', (0, auth_middleware_1.authMiddleware)(['CUSTOMER']), (0, validation_middleware_1.validateRequest)({
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
            }
        }
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items } = req.body;
        const user = req.user;
        const userId = user.id;
        // Calculate total amount and validate meals
        const orderItems = yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const meal = yield prisma_1.default.meal.findUnique({
                where: { id: item.mealId }
            });
            if (!meal) {
                throw new Error(`Meal with ID ${item.mealId} not found`);
            }
            return {
                mealId: item.mealId,
                name: meal.name,
                quantity: item.quantity,
                price: meal.price
            };
        })));
        const totalAmount = orderItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        // Get user details
        const dbUser = yield prisma_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!dbUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Create order with items in a transaction
        const order = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const newOrder = yield prisma.order.create({
                data: {
                    userId,
                    status: client_1.OrderStatus.PENDING,
                    amount: totalAmount,
                    customerName: dbUser.name,
                    customerEmail: dbUser.email,
                    customerPhone: dbUser.phoneNumber,
                    items: {
                        create: orderItems
                    }
                },
                include: {
                    items: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                            phoneNumber: true
                        }
                    }
                }
            });
            return newOrder;
        }));
        res.status(201).json({ success: true, data: order });
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating order' });
    }
}));
/**
 * Update order status (admin only)
 */
router.patch('/:orderId/status', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
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
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = yield prisma_1.default.order.findUnique({
            where: { id: orderId }
        });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Validate status transition
        if (!isValidStatusTransition(order.status, status)) {
            return res.status(400).json({ error: 'Invalid status transition' });
        }
        const updatedOrder = yield prisma_1.default.order.update({
            where: { id: orderId },
            data: {
                status,
                updatedAt: new Date()
            },
            include: {
                items: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        });
        // If order is delivered, update inventory
        if (status === client_1.OrderStatus.DELIVERED) {
            yield updateInventoryForDeliveredOrder(orderId);
        }
        res.json({ success: true, data: updatedOrder });
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating order status' });
    }
}));
/**
 * Cancel order (admin and customer)
 */
router.post('/:orderId/cancel', (0, auth_middleware_1.authMiddleware)(['ADMIN', 'CUSTOMER']), (0, validation_middleware_1.validateRequest)({
    params: {
        type: 'object',
        required: ['orderId'],
        properties: {
            orderId: { type: 'string', format: 'uuid' }
        }
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const order = yield prisma_1.default.order.findUnique({
            where: { id: orderId }
        });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const user = req.user;
        // If user is customer, verify they own the order
        if ((user === null || user === void 0 ? void 0 : user.role) === 'CUSTOMER' && order.userId !== user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        // Only allow cancellation of pending or confirmed orders
        if (order.status !== client_1.OrderStatus.PENDING && order.status !== client_1.OrderStatus.CONFIRMED) {
            return res.status(400).json({ error: 'Cannot cancel order in current status' });
        }
        const cancelledOrder = yield prisma_1.default.order.update({
            where: { id: orderId },
            data: {
                status: client_1.OrderStatus.CANCELLED,
                updatedAt: new Date()
            },
            include: {
                items: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        });
        res.json({ success: true, data: cancelledOrder });
    }
    catch (error) {
        res.status(500).json({ error: 'Error cancelling order' });
    }
}));
// Helper functions
function isValidStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
        [client_1.OrderStatus.PENDING]: [client_1.OrderStatus.CONFIRMED, client_1.OrderStatus.CANCELLED],
        [client_1.OrderStatus.CONFIRMED]: [client_1.OrderStatus.PREPARING, client_1.OrderStatus.CANCELLED],
        [client_1.OrderStatus.PREPARING]: [client_1.OrderStatus.READY_FOR_DELIVERY],
        [client_1.OrderStatus.READY_FOR_DELIVERY]: [client_1.OrderStatus.OUT_FOR_DELIVERY],
        [client_1.OrderStatus.OUT_FOR_DELIVERY]: [client_1.OrderStatus.DELIVERED],
        [client_1.OrderStatus.DELIVERED]: [],
        [client_1.OrderStatus.CANCELLED]: []
    };
    return validTransitions[currentStatus].includes(newStatus);
}
function updateInventoryForDeliveredOrder(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const order = yield prisma_1.default.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        meal: true
                    }
                }
            }
        });
        if (!order) {
            throw new Error('Order not found');
        }
        // Update inventory for each item
        for (const item of order.items) {
            const inventoryItem = yield prisma_1.default.inventoryItem.findFirst({
                where: { name: item.meal.name }
            });
            if (inventoryItem) {
                yield prisma_1.default.inventoryItem.update({
                    where: { id: inventoryItem.id },
                    data: {
                        currentStock: {
                            decrement: item.quantity
                        }
                    }
                });
            }
        }
    });
}
exports.default = router;
