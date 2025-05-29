"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerAnalytics_controller_1 = require("../controllers/customerAnalytics.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Apply auth middleware to all routes
router.use((0, auth_middleware_1.authMiddleware)(['ADMIN']));
// Customer behavior analytics
router.get('/behavior', customerAnalytics_controller_1.customerAnalyticsController.getCustomerBehavior);
// Customer preferences analytics
router.get('/preferences', customerAnalytics_controller_1.customerAnalyticsController.getCustomerPreferences);
// Customer feedback analysis
router.get('/feedback', customerAnalytics_controller_1.customerAnalyticsController.getFeedbackAnalysis);
exports.default = router;
