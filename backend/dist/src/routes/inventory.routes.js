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
const inventory_service_1 = require("../services/inventory.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Get all inventory items
router.get('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield inventory_service_1.inventoryService.getInventoryItems();
        res.json(items);
    }
    catch (error) {
        next(error);
    }
}));
// Get low stock items
router.get('/low-stock', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield inventory_service_1.inventoryService.getLowStockItems();
        res.json(items);
    }
    catch (error) {
        next(error);
    }
}));
// Create new inventory item
router.post('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        currentStock: zod_1.z.number().min(0),
        minimumStock: zod_1.z.number().min(0),
        unit: zod_1.z.string()
    })
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield inventory_service_1.inventoryService.createInventoryItem(req.body.name, req.body.currentStock, req.body.minimumStock, req.body.unit);
        res.json(item);
    }
    catch (error) {
        next(error);
    }
}));
// Update stock
router.patch('/:itemId/stock', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: zod_1.z.object({
        quantity: zod_1.z.number().min(0)
    })
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield inventory_service_1.inventoryService.updateStock(req.params.itemId, req.body.quantity);
        res.json(item);
    }
    catch (error) {
        next(error);
    }
}));
// Record waste
router.post('/:itemId/waste', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: zod_1.z.object({
        quantity: zod_1.z.number().min(0),
        reason: zod_1.z.string()
    })
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield inventory_service_1.inventoryService.recordWaste(req.params.itemId, req.body.quantity, req.body.reason);
        res.json(item);
    }
    catch (error) {
        next(error);
    }
}));
// Get waste records
router.get('/waste-records', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield inventory_service_1.inventoryService.getWasteRecords();
        res.json(records);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
