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
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
const error_types_1 = require("../types/error.types");
const logger_config_1 = __importDefault(require("../config/logger.config"));
class OrderController {
    constructor() {
        this.getAllOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.orderService.getAllOrders();
                res.json(orders);
            }
            catch (error) {
                logger_config_1.default.error('Error fetching orders:', { error });
                if (error instanceof error_types_1.AppError) {
                    res.status(error.statusCode).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        });
        this.getOrderById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const order = yield this.orderService.getOrderById(id);
                if (!order) {
                    throw new error_types_1.AppError('Order not found', 404);
                }
                res.json(order);
            }
            catch (error) {
                logger_config_1.default.error('Error fetching order:', { error, orderId: req.params.id });
                if (error instanceof error_types_1.AppError) {
                    res.status(error.statusCode).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        });
        this.createOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orderData = req.body;
                const userId = req.user.id;
                if (!userId) {
                    throw new error_types_1.AppError('User not authenticated', 401);
                }
                const order = yield this.orderService.createOrder(orderData, userId);
                res.status(201).json(order);
            }
            catch (error) {
                logger_config_1.default.error('Error creating order:', { error });
                if (error instanceof error_types_1.AppError) {
                    res.status(error.statusCode).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        });
        this.updateOrderStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status } = req.body;
                const order = yield this.orderService.updateOrderStatus(id, status);
                if (!order) {
                    throw new error_types_1.AppError('Order not found', 404);
                }
                res.json(order);
            }
            catch (error) {
                logger_config_1.default.error('Error updating order status:', { error, orderId: req.params.id });
                if (error instanceof error_types_1.AppError) {
                    res.status(error.statusCode).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        });
        this.deleteOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.orderService.deleteOrder(id);
                res.status(204).send();
            }
            catch (error) {
                logger_config_1.default.error('Error deleting order:', { error, orderId: req.params.id });
                if (error instanceof error_types_1.AppError) {
                    res.status(error.statusCode).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        });
        this.orderService = new order_service_1.OrderService();
    }
}
exports.OrderController = OrderController;
