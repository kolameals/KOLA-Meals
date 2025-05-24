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
const client_1 = require("@prisma/client");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all meals
router.get('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const meals = yield prisma.meal.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(meals);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching meals' });
    }
}));
// Get meal by id
router.get('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const meal = yield prisma.meal.findUnique({
            where: { id: req.params.id }
        });
        if (!meal) {
            res.status(404).json({ error: 'Meal not found' });
            return;
        }
        res.json(meal);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching meal' });
    }
}));
// Create meal (admin only)
router.post('/', auth_middleware_1.authMiddleware, auth_middleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, image, category } = req.body;
        const meal = yield prisma.meal.create({
            data: {
                name,
                description,
                price: typeof price === 'string' ? parseFloat(price) : price,
                image,
                category
            }
        });
        res.status(201).json(meal);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating meal' });
    }
}));
// Update meal (admin only)
router.put('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, image, category } = req.body;
        const meal = yield prisma.meal.update({
            where: { id: req.params.id },
            data: {
                name,
                description,
                price: typeof price === 'string' ? parseFloat(price) : price,
                image,
                category
            }
        });
        res.json(meal);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating meal' });
    }
}));
// Delete meal (admin only)
router.delete('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.meal.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Meal deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting meal' });
    }
}));
exports.default = router;
