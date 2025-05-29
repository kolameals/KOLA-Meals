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
exports.OrderService = void 0;
const client_1 = require("@prisma/client");
const error_types_1 = require("../types/error.types");
const logger_config_1 = __importDefault(require("../config/logger.config"));
class OrderService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.prisma.order.findMany({
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
                return orders;
            }
            catch (error) {
                logger_config_1.default.error('Error fetching orders:', { error });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error fetching orders', 500);
            }
        });
    }
    getOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.prisma.order.findUnique({
                    where: { id },
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
                    throw new error_types_1.AppError('Order not found', 404);
                }
                return order;
            }
            catch (error) {
                logger_config_1.default.error('Error fetching order by ID:', { error, orderId: id });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error fetching order', 500);
            }
        });
    }
    createOrder(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { items, deliveryAddress, deliveryInstructions } = data;
                // Validate user exists
                const user = yield this.prisma.user.findUnique({
                    where: { id: userId }
                });
                if (!user) {
                    throw new error_types_1.AppError('User not found', 404);
                }
                // Calculate total amount and validate meals
                const orderItems = yield Promise.all(items.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const meal = yield this.prisma.meal.findUnique({
                        where: { id: item.mealId }
                    });
                    if (!meal) {
                        throw new error_types_1.AppError(`Meal with ID ${item.mealId} not found`, 404);
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
                // Create order with items in a transaction
                const order = yield this.prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    const newOrder = yield prisma.order.create({
                        data: {
                            userId,
                            status: client_1.OrderStatus.PENDING,
                            amount: totalAmount,
                            customerName: user.name,
                            customerEmail: user.email,
                            customerPhone: user.phoneNumber,
                            deliveryAddress,
                            deliveryInstructions,
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
                return order;
            }
            catch (error) {
                logger_config_1.default.error('Error creating order:', { error });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error creating order', 500);
            }
        });
    }
    updateOrderStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.prisma.order.findUnique({
                    where: { id }
                });
                if (!order) {
                    throw new error_types_1.AppError('Order not found', 404);
                }
                // Validate status transition
                if (!this.isValidStatusTransition(order.status, status)) {
                    throw new error_types_1.AppError('Invalid status transition', 400);
                }
                const updatedOrder = yield this.prisma.order.update({
                    where: { id },
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
                    yield this.updateInventoryForDeliveredOrder(id);
                }
                return updatedOrder;
            }
            catch (error) {
                logger_config_1.default.error('Error updating order status:', { error, orderId: id, status });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error updating order status', 500);
            }
        });
    }
    deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.prisma.order.findUnique({
                    where: { id }
                });
                if (!order) {
                    throw new error_types_1.AppError('Order not found', 404);
                }
                yield this.prisma.order.delete({
                    where: { id }
                });
            }
            catch (error) {
                logger_config_1.default.error('Error deleting order:', { error, orderId: id });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error deleting order', 500);
            }
        });
    }
    // Helper methods
    isValidStatusTransition(currentStatus, newStatus) {
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
    updateInventoryForDeliveredOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.prisma.order.findUnique({
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
                    throw new error_types_1.AppError('Order not found', 404);
                }
                // Update inventory for each item
                for (const item of order.items) {
                    const inventoryItem = yield this.prisma.inventoryItem.findFirst({
                        where: { name: item.meal.name }
                    });
                    if (inventoryItem) {
                        yield this.prisma.inventoryItem.update({
                            where: { id: inventoryItem.id },
                            data: {
                                currentStock: {
                                    decrement: item.quantity
                                }
                            }
                        });
                    }
                }
            }
            catch (error) {
                logger_config_1.default.error('Error updating inventory for delivered order:', { error, orderId });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error updating inventory', 500);
            }
        });
    }
}
exports.OrderService = OrderService;
