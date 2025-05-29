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
const feedback_service_1 = require("../services/feedback.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Get all feedbacks with optional filters
router.get('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = {
            type: req.query.type,
            status: req.query.status,
            userId: req.query.userId,
        };
        const feedbacks = yield feedback_service_1.feedbackService.getFeedbacks(filters);
        res.json(feedbacks);
    }
    catch (error) {
        next(error);
    }
}));
// Get feedback by ID
router.get('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedback = yield feedback_service_1.feedbackService.getFeedbackById(req.params.id);
        res.json(feedback);
    }
    catch (error) {
        next(error);
    }
}));
// Create new feedback
router.post('/', (0, auth_middleware_1.authMiddleware)(['CUSTOMER', 'ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: zod_1.z.object({
        type: zod_1.z.enum(['GENERAL', 'MEAL_QUALITY', 'DELIVERY', 'SERVICE', 'OTHER']),
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        rating: zod_1.z.number().optional(),
    }),
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedback = yield feedback_service_1.feedbackService.createFeedback({
            userId: req.user.id,
            type: req.body.type,
            title: req.body.title,
            description: req.body.description,
            rating: req.body.rating,
        });
        res.json(feedback);
    }
    catch (error) {
        next(error);
    }
}));
// Update feedback status
router.patch('/:id/status', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: zod_1.z.object({
        status: zod_1.z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
    }),
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedback = yield feedback_service_1.feedbackService.updateFeedbackStatus(req.params.id, req.body.status);
        res.json(feedback);
    }
    catch (error) {
        next(error);
    }
}));
// Add response to feedback
router.post('/:id/responses', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: zod_1.z.object({
        message: zod_1.z.string(),
    }),
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield feedback_service_1.feedbackService.addResponse({
            feedbackId: req.params.id,
            userId: req.user.id,
            message: req.body.message,
        });
        res.json(response);
    }
    catch (error) {
        next(error);
    }
}));
// Create issue from feedback
router.post('/:id/issues', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
        assignedTo: zod_1.z.string().optional(),
    }),
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issue = yield feedback_service_1.feedbackService.createIssue({
            feedbackId: req.params.id,
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            assignedTo: req.body.assignedTo,
        });
        res.json(issue);
    }
    catch (error) {
        next(error);
    }
}));
// Update issue status
router.patch('/issues/:id/status', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: zod_1.z.object({
        status: zod_1.z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
    }),
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issue = yield feedback_service_1.feedbackService.updateIssueStatus(req.params.id, req.body.status);
        res.json(issue);
    }
    catch (error) {
        next(error);
    }
}));
// Assign issue
router.patch('/issues/:id/assign', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: zod_1.z.object({
        userId: zod_1.z.string(),
    }),
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issue = yield feedback_service_1.feedbackService.assignIssue(req.params.id, req.body.userId);
        res.json(issue);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
