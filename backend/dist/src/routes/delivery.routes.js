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
const auth_middleware_1 = require("../middleware/auth.middleware");
const delivery_service_1 = require("../services/delivery.service");
const router = (0, express_1.Router)();
// Create delivery (admin only)
router.post('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const delivery = yield (0, delivery_service_1.createDelivery)(req.body);
        res.status(201).json(delivery);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating delivery' });
    }
}));
// Get delivery details
router.get('/:deliveryId', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const delivery = yield (0, delivery_service_1.getDelivery)(req.params.deliveryId);
        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }
        res.json(delivery);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching delivery' });
    }
}));
// Update delivery status (admin and delivery partner)
router.patch('/:deliveryId/status', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        if (!['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const delivery = yield (0, delivery_service_1.updateDeliveryStatus)(req.params.deliveryId, status);
        res.json(delivery);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating delivery status' });
    }
}));
// Get user's deliveries
router.get('/my-deliveries', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userObj = req.user;
        const deliveries = yield (0, delivery_service_1.getDeliveriesByUser)(userObj.id);
        res.json({ success: true, data: deliveries });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching deliveries' });
    }
}));
// Get pending deliveries (admin and delivery partner)
router.get('/pending', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveries = yield (0, delivery_service_1.getPendingDeliveries)();
        res.json(deliveries);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching pending deliveries' });
    }
}));
// Get all deliveries
router.get('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ... existing code ...
}));
exports.default = router;
