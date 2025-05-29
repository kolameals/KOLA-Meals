"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deliveryAssignment_controller_1 = require("../controllers/deliveryAssignment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Get all assignments
router.get('/', (0, auth_middleware_1.authMiddleware)([client_1.Role.ADMIN, client_1.Role.DELIVERY_PARTNER]), deliveryAssignment_controller_1.deliveryAssignmentController.getAssignments);
// Create team assignment
router.post('/team', (0, auth_middleware_1.authMiddleware)([client_1.Role.ADMIN]), deliveryAssignment_controller_1.deliveryAssignmentController.createTeamAssignment);
// Update assignment
router.put('/:id', (0, auth_middleware_1.authMiddleware)([client_1.Role.ADMIN]), deliveryAssignment_controller_1.deliveryAssignmentController.updateAssignment);
// Delete assignment
router.delete('/:id', (0, auth_middleware_1.authMiddleware)([client_1.Role.ADMIN]), deliveryAssignment_controller_1.deliveryAssignmentController.deleteAssignment);
// Get current assignments
router.get('/current', (0, auth_middleware_1.authMiddleware)([client_1.Role.ADMIN, client_1.Role.DELIVERY_PARTNER]), deliveryAssignment_controller_1.deliveryAssignmentController.getCurrentAssignments);
// Get team assignments
router.get('/apartment/:apartmentId', (0, auth_middleware_1.authMiddleware)([client_1.Role.ADMIN, client_1.Role.DELIVERY_PARTNER]), deliveryAssignment_controller_1.deliveryAssignmentController.getTeamAssignments);
exports.default = router;
