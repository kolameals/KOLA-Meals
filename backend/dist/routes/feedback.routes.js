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
// Submit feedback
router.post('/', (0, auth_middleware_1.authMiddleware)(['CUSTOMER']), (0, validation_middleware_1.validateRequest)({
    body: zod_1.z.object({
        mealId: zod_1.z.string(),
        rating: zod_1.z.number().min(1).max(5),
        categories: zod_1.z.object({
            taste: zod_1.z.number().min(1).max(5),
            packaging: zod_1.z.number().min(1).max(5),
            portion: zod_1.z.number().min(1).max(5)
        }),
        comments: zod_1.z.string().optional()
    })
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const feedback = yield feedback_service_1.feedbackService.submitFeedback(user.id, req.body.mealId, req.body.rating, req.body.categories, req.body.comments);
        res.json(feedback);
    }
    catch (error) {
        next(error);
    }
}));
// Get feedback for a meal
router.get('/meal/:mealId', (0, auth_middleware_1.authMiddleware)(['CUSTOMER', 'ADMIN']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedback = yield feedback_service_1.feedbackService.getMealFeedback(req.params.mealId);
        res.json(feedback);
    }
    catch (error) {
        next(error);
    }
}));
// Get meal statistics
router.get('/stats/:mealId', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield feedback_service_1.feedbackService.getMealStats(req.params.mealId);
        res.json(stats);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
