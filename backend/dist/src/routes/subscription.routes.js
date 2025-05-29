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
const subscription_service_1 = require("../services/subscription.service");
const router = (0, express_1.Router)();
// Create subscription
router.post('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const subscription = yield (0, subscription_service_1.createSubscription)(Object.assign({ userId: user.id }, req.body));
        res.status(201).json(subscription);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating subscription' });
    }
}));
// Get subscription
router.get('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const subscription = yield (0, subscription_service_1.getSubscription)(user.id);
        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }
        res.json(subscription);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching subscription' });
    }
}));
// Update subscription
router.put('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const subscription = yield (0, subscription_service_1.updateSubscription)(user.id, req.body);
        res.json(subscription);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating subscription' });
    }
}));
// Cancel subscription
router.delete('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const subscription = yield (0, subscription_service_1.cancelSubscription)(user.id);
        res.json(subscription);
    }
    catch (error) {
        res.status(500).json({ error: 'Error canceling subscription' });
    }
}));
// Pause subscription
router.post('/pause', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const subscription = yield (0, subscription_service_1.pauseSubscription)(user.id);
        res.json(subscription);
    }
    catch (error) {
        res.status(500).json({ error: 'Error pausing subscription' });
    }
}));
// Resume subscription
router.post('/resume', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const subscription = yield (0, subscription_service_1.resumeSubscription)(user.id);
        res.json(subscription);
    }
    catch (error) {
        res.status(500).json({ error: 'Error resuming subscription' });
    }
}));
// Get all subscriptions
router.get('/all', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ... existing code ...
}));
exports.default = router;
