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
const error_types_1 = require("../types/error.types");
const prisma_1 = __importDefault(require("../lib/prisma"));
const logger_config_1 = __importDefault(require("../config/logger.config"));
exports.inventoryService = {
    getInventoryItems() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield prisma_1.default.inventoryItem.findMany({
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
                const item = yield prisma_1.default.inventoryItem.findUnique({
                    where: { id: itemId }
                });
                if (!item) {
                    throw new error_types_1.AppError('Inventory item not found', 404);
                }
                const updatedItem = yield prisma_1.default.inventoryItem.update({
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
                const item = yield prisma_1.default.inventoryItem.create({
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
                const items = yield prisma_1.default.inventoryItem.findMany({
                    where: {
                        currentStock: {
                            lte: prisma_1.default.inventoryItem.fields.minimumStock
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
    },
    recordWaste(itemId, quantity, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield prisma_1.default.inventoryItem.findUnique({
                    where: { id: itemId }
                });
                if (!item) {
                    throw new error_types_1.AppError('Inventory item not found', 404);
                }
                // Create waste record
                const wasteRecord = yield prisma_1.default.wasteRecord.create({
                    data: {
                        itemId,
                        quantity,
                        reason,
                        date: new Date()
                    }
                });
                // Update inventory stock
                const updatedItem = yield prisma_1.default.inventoryItem.update({
                    where: { id: itemId },
                    data: {
                        currentStock: item.currentStock - quantity,
                        lastUpdated: new Date()
                    }
                });
                logger_config_1.default.info('Waste recorded:', {
                    itemId,
                    itemName: item.name,
                    quantity,
                    reason
                });
                return {
                    wasteRecord,
                    updatedItem
                };
            }
            catch (error) {
                logger_config_1.default.error('Error recording waste:', { error, itemId, quantity, reason });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error recording waste', 500);
            }
        });
    },
    getWasteRecords() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const records = yield prisma_1.default.wasteRecord.findMany({
                    include: {
                        item: true
                    },
                    orderBy: {
                        date: 'desc'
                    }
                });
                return records;
            }
            catch (error) {
                logger_config_1.default.error('Error fetching waste records:', { error });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error fetching waste records', 500);
            }
        });
    }
};
