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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
/**
 * Get all meals
 */
router.get('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const meals = yield prisma_1.default.meal.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({ success: true, data: meals });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching meals' });
    }
}));
/**
 * Create a new meal (admin only)
 */
router.post('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            image: { type: 'string' },
            type: { type: 'string', enum: ['BREAKFAST', 'LUNCH', 'DINNER'] }
        },
        required: ['name', 'description', 'price', 'category', 'type']
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, category, image, type } = req.body;
        const meal = yield prisma_1.default.meal.create({
            data: {
                name,
                description,
                price,
                category,
                image,
                type
            }
        });
        res.status(201).json({ success: true, data: meal });
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating meal' });
    }
}));
/**
 * Update a meal (admin only)
 */
router.put('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            image: { type: 'string' },
            type: { type: 'string', enum: ['BREAKFAST', 'LUNCH', 'DINNER'] }
        }
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, price, category, image, type } = req.body;
        const meal = yield prisma_1.default.meal.update({
            where: { id },
            data: {
                name,
                description,
                price,
                category,
                image,
                type
            }
        });
        res.json({ success: true, data: meal });
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating meal' });
    }
}));
/**
 * Delete a meal (admin only)
 */
router.delete('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.default.meal.delete({
            where: { id }
        });
        res.json({ success: true, message: 'Meal deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting meal' });
    }
}));
exports.default = router;
