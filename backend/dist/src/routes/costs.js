"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cost_controller_1 = require("../controllers/cost.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Delivery cost configuration
router.get('/delivery-cost-config', (0, auth_middleware_1.authMiddleware)(['ADMIN']), cost_controller_1.getDeliveryCostConfig);
router.put('/delivery-cost-config', (0, auth_middleware_1.authMiddleware)(['ADMIN']), cost_controller_1.updateDeliveryCostConfig);
// Staff costs
router.get('/staff', (0, auth_middleware_1.authMiddleware)(['ADMIN']), cost_controller_1.getStaffCosts);
router.get('/staff/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), cost_controller_1.getStaffCostById);
router.post('/staff', (0, auth_middleware_1.authMiddleware)(['ADMIN']), cost_controller_1.createStaffCost);
// Equipment costs
router.get('/equipment', (0, auth_middleware_1.authMiddleware)(['ADMIN']), cost_controller_1.getEquipmentCosts);
router.get('/equipment/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), cost_controller_1.getEquipmentCostById);
router.post('/equipment', (0, auth_middleware_1.authMiddleware)(['ADMIN']), cost_controller_1.createEquipmentCost);
// Facility costs
router.get('/facility', (0, auth_middleware_1.authMiddleware)(['ADMIN']), cost_controller_1.getFacilityCosts);
router.get('/facility/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), cost_controller_1.getFacilityCostById);
router.post('/facility', (0, auth_middleware_1.authMiddleware)(['ADMIN']), cost_controller_1.createFacilityCost);
// Cost summary and categories
router.get('/summary', (0, auth_middleware_1.authMiddleware)(['ADMIN']), cost_controller_1.getCostSummary);
router.get('/categories', (0, auth_middleware_1.authMiddleware)(['ADMIN']), cost_controller_1.getCostCategories);
exports.default = router;
