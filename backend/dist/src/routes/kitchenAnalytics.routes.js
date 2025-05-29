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
const kitchenAnalytics_controller_1 = require("../controllers/kitchenAnalytics.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Apply authentication and admin role check to all routes
router.use((0, auth_middleware_1.authMiddleware)(['ADMIN']));
// Get efficiency metrics
router.get('/efficiency-metrics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield kitchenAnalytics_controller_1.kitchenAnalyticsController.getEfficiencyMetrics(req, res);
}));
// Get cost analysis
router.get('/cost-analysis', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield kitchenAnalytics_controller_1.kitchenAnalyticsController.getCostAnalysis(req, res);
}));
// Get resource utilization
router.get('/resource-utilization', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield kitchenAnalytics_controller_1.kitchenAnalyticsController.getResourceUtilization(req, res);
}));
exports.default = router;
