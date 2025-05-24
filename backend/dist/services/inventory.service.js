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
exports.inventoryService = void 0;
const client_1 = require("@prisma/client");
const error_types_1 = require("../types/error.types");
const logger_config_1 = __importDefault(require("../config/logger.config"));
const prisma = new client_1.PrismaClient();
exports.inventoryService = {
    getInventoryItems() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield prisma.inventoryItem.findMany({
                    orderBy: {
                        name: 'asc'
                    }
                });
                return items;
            }
            catch (error) {
                logger_config_1.default.error('Error fetching inventory items:', { error });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error fetching inventory items', 500);
            }
        });
    },
    updateStock(itemId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield prisma.inventoryItem.findUnique({
                    where: { id: itemId }
                });
                if (!item) {
                    throw new error_types_1.AppError('Inventory item not found', 404);
                }
                const updatedItem = yield prisma.inventoryItem.update({
                    where: { id: itemId },
                    data: {
                        currentStock: quantity,
                        lastUpdated: new Date()
                    }
                });
                // Check if stock is below minimum
                if (updatedItem.currentStock <= updatedItem.minimumStock) {
                    logger_config_1.default.warn('Low stock alert:', {
                        itemId,
                        itemName: updatedItem.name,
                        currentStock: updatedItem.currentStock,
                        minimumStock: updatedItem.minimumStock
                    });
                }
                return updatedItem;
            }
            catch (error) {
                logger_config_1.default.error('Error updating inventory stock:', { error, itemId, quantity });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error updating inventory stock', 500);
            }
        });
    },
    createInventoryItem(name, currentStock, minimumStock, unit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield prisma.inventoryItem.create({
                    data: {
                        name,
                        currentStock,
                        minimumStock,
                        unit
                    }
                });
                return item;
            }
            catch (error) {
                logger_config_1.default.error('Error creating inventory item:', { error, name });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error creating inventory item', 500);
            }
        });
    },
    getLowStockItems() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield prisma.inventoryItem.findMany({
                    where: {
                        currentStock: {
                            lte: prisma.inventoryItem.fields.minimumStock
                        }
                    },
                    orderBy: {
                        currentStock: 'asc'
                    }
                });
                return items;
            }
            catch (error) {
                logger_config_1.default.error('Error fetching low stock items:', { error });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error fetching low stock items', 500);
            }
        });
    }
};
