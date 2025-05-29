"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const analytics_controller_1 = require("../controllers/analytics.controller");
const router = express_1.default.Router();
// Apply authentication middleware to all analytics routes
router.use((0, auth_middleware_1.authMiddleware)(['ADMIN']));
// Revenue data endpoint
router.get('/revenue', analytics_controller_1.analyticsController.getRevenueData);
// Sales trends endpoint
router.get('/sales-trends', analytics_controller_1.analyticsController.getSalesTrends);
// Performance metrics endpoint
router.get('/performance', analytics_controller_1.analyticsController.getPerformanceMetrics);
exports.default = router;
