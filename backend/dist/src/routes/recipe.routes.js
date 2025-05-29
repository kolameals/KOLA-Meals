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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
const meal_types_1 = require("../types/meal.types");
const router = (0, express_1.Router)();
// Calculate recipe cost
router.post('/calculate-cost', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipeItems } = req.body;
        let totalCost = 0;
        for (const item of recipeItems) {
            const rawMaterial = yield prisma_1.default.rawMaterial.findUnique({
                where: { id: item.rawMaterialId }
            });
            if (rawMaterial) {
                totalCost += item.quantity * rawMaterial.costPerUnit;
            }
        }
        res.json({ success: true, data: { cost: totalCost } });
    }
    catch (error) {
        console.error('Error calculating recipe cost:', error);
        res.status(500).json({ success: false, error: 'Failed to calculate cost' });
    }
}));
// Get all recipes
router.get('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield prisma_1.default.recipe.findMany({
            include: {
                recipeItems: {
                    include: {
                        rawMaterial: true
                    }
                },
                meal: true
            },
            orderBy: { name: 'asc' }
        });
        res.json({ success: true, data: recipes });
    }
    catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch recipes' });
    }
}));
// Get recipe by ID
router.get('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipe = yield prisma_1.default.recipe.findUnique({
            where: { id: req.params.id },
            include: {
                recipeItems: {
                    include: {
                        rawMaterial: true
                    }
                },
                meal: true
            }
        });
        if (!recipe) {
            return res.status(404).json({ success: false, error: 'Recipe not found' });
        }
        res.json({ success: true, data: recipe });
    }
    catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch recipe' });
    }
}));
// Create recipe (admin only)
router.post('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { recipeItems } = _a, recipeData = __rest(_a, ["recipeItems"]);
        // Validate category and type
        if (!Object.values(meal_types_1.MealCategory).includes(recipeData.category)) {
            return res.status(400).json({ success: false, error: 'Invalid category' });
        }
        if (!Object.values(client_1.MealType).includes(recipeData.type)) {
            return res.status(400).json({ success: false, error: 'Invalid meal type' });
        }
        // Calculate total cost
        let totalCost = 0;
        for (const item of recipeItems) {
            const rawMaterial = yield prisma_1.default.rawMaterial.findUnique({
                where: { id: item.rawMaterialId }
            });
            if (rawMaterial) {
                totalCost += item.quantity * rawMaterial.costPerUnit;
            }
        }
        // Calculate cost per serving
        const costPerServing = totalCost / recipeData.servings;
        // First create the meal
        const meal = yield prisma_1.default.meal.create({
            data: {
                name: recipeData.name,
                description: recipeData.description,
                category: recipeData.category,
                type: recipeData.type,
                price: 0, // Default price, can be updated later
                image: recipeData.imageUrl
            }
        });
        // Then create the recipe with the meal connection
        const recipe = yield prisma_1.default.recipe.create({
            data: Object.assign(Object.assign({}, recipeData), { costPerServing, mealId: meal.id, recipeItems: {
                    create: recipeItems
                } }),
            include: {
                recipeItems: {
                    include: {
                        rawMaterial: true
                    }
                },
                meal: true
            }
        });
        res.status(201).json({ success: true, data: recipe });
    }
    catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ success: false, error: 'Failed to create recipe' });
    }
}));
// Update recipe (admin only)
router.put('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { recipeItems } = _a, recipeData = __rest(_a, ["recipeItems"]);
        // Validate category and type
        if (recipeData.category && !Object.values(meal_types_1.MealCategory).includes(recipeData.category)) {
            return res.status(400).json({ success: false, error: 'Invalid category' });
        }
        if (recipeData.type && !Object.values(client_1.MealType).includes(recipeData.type)) {
            return res.status(400).json({ success: false, error: 'Invalid meal type' });
        }
        // Get the existing recipe to find the meal ID
        const existingRecipe = yield prisma_1.default.recipe.findUnique({
            where: { id: req.params.id },
            include: { meal: true }
        });
        if (!existingRecipe) {
            return res.status(404).json({ success: false, error: 'Recipe not found' });
        }
        // Update the associated meal
        yield prisma_1.default.meal.update({
            where: { id: existingRecipe.mealId },
            data: {
                name: recipeData.name,
                description: recipeData.description,
                category: recipeData.category,
                type: recipeData.type,
                image: recipeData.imageUrl
            }
        });
        // Delete existing recipe items
        yield prisma_1.default.recipeItem.deleteMany({
            where: { recipeId: req.params.id }
        });
        // Update recipe and create new recipe items
        const recipe = yield prisma_1.default.recipe.update({
            where: { id: req.params.id },
            data: Object.assign(Object.assign({}, recipeData), { recipeItems: {
                    create: recipeItems
                } }),
            include: {
                recipeItems: {
                    include: {
                        rawMaterial: true
                    }
                },
                meal: true
            }
        });
        res.json({ success: true, data: recipe });
    }
    catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ success: false, error: 'Failed to update recipe' });
    }
}));
// Delete recipe (admin only)
router.delete('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Delete recipe items first
        yield prisma_1.default.recipeItem.deleteMany({
            where: { recipeId: req.params.id }
        });
        // Then delete the recipe
        yield prisma_1.default.recipe.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true, message: 'Recipe deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ success: false, error: 'Failed to delete recipe' });
    }
}));
exports.default = router;
