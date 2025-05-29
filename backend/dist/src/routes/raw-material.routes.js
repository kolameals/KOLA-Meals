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
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
// Get all raw materials
router.get('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawMaterials = yield prisma_1.default.rawMaterial.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(rawMaterials);
    }
    catch (error) {
        console.error('Error fetching raw materials:', error);
        res.status(500).json({ error: 'Failed to fetch raw materials' });
    }
}));
// Get raw material by ID
router.get('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawMaterial = yield prisma_1.default.rawMaterial.findUnique({
            where: { id: req.params.id }
        });
        if (!rawMaterial) {
            return res.status(404).json({ error: 'Raw material not found' });
        }
        res.json(rawMaterial);
    }
    catch (error) {
        console.error('Error fetching raw material:', error);
        res.status(500).json({ error: 'Failed to fetch raw material' });
    }
}));
// Create raw material (admin only)
router.post('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawMaterial = yield prisma_1.default.rawMaterial.create({
            data: req.body
        });
        res.status(201).json(rawMaterial);
    }
    catch (error) {
        console.error('Error creating raw material:', error);
        res.status(500).json({ error: 'Failed to create raw material' });
    }
}));
// Update raw material (admin only)
router.put('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawMaterial = yield prisma_1.default.rawMaterial.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(rawMaterial);
    }
    catch (error) {
        console.error('Error updating raw material:', error);
        res.status(500).json({ error: 'Failed to update raw material' });
    }
}));
// Delete raw material (admin only)
router.delete('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.rawMaterial.delete({
            where: { id: req.params.id }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting raw material:', error);
        res.status(500).json({ error: 'Failed to delete raw material' });
    }
}));
// Update stock (admin only)
router.patch('/:id/stock', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quantity } = req.body;
        const rawMaterial = yield prisma_1.default.rawMaterial.update({
            where: { id: req.params.id },
            data: {
                currentStock: quantity,
                lastUpdated: new Date()
            }
        });
        res.json(rawMaterial);
    }
    catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ error: 'Failed to update stock' });
    }
}));
exports.default = router;
