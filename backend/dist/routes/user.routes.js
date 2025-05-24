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
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_service_1 = require("../services/user.service");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     role:
 *                       type: string
 *                     subscription:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         plan:
 *                           type: string
 *                         status:
 *                           type: string
 *                         startDate:
 *                           type: string
 *                           format: date-time
 *                         endDate:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Not authenticated
 */
router.get('/profile', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userObj = req.user;
        const user = yield (0, user_service_1.getUser)(userObj.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching user profile' });
    }
}));
/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: +1234567890
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 */
router.put('/profile', auth_middleware_1.authMiddleware, (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            phoneNumber: { type: 'string' }
        },
        required: []
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userObj = req.user;
        const user = yield (0, user_service_1.updateUser)(userObj.id, req.body);
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating user profile' });
    }
}));
/**
 * @swagger
 * /api/users/addresses:
 *   get:
 *     summary: Get user addresses
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       street:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       postalCode:
 *                         type: string
 *                       country:
 *                         type: string
 *                       isDefault:
 *                         type: boolean
 *       401:
 *         description: Not authenticated
 */
router.get('/addresses', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userObj = req.user;
        const user = yield (0, user_service_1.getUser)(userObj.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true, data: user.addresses });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching addresses' });
    }
}));
/**
 * @swagger
 * /api/users/addresses:
 *   post:
 *     summary: Add new address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - state
 *               - postalCode
 *               - country
 *             properties:
 *               street:
 *                 type: string
 *                 example: 123 Main St
 *               city:
 *                 type: string
 *                 example: New York
 *               state:
 *                 type: string
 *                 example: NY
 *               postalCode:
 *                 type: string
 *                 example: 10001
 *               country:
 *                 type: string
 *                 example: USA
 *               isDefault:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     street:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     postalCode:
 *                       type: string
 *                     country:
 *                       type: string
 *                     isDefault:
 *                       type: boolean
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 */
router.post('/addresses', auth_middleware_1.authMiddleware, (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        properties: {
            street: { type: 'string', required: true },
            city: { type: 'string', required: true },
            state: { type: 'string', required: true },
            postalCode: { type: 'string', required: true },
            country: { type: 'string', required: true },
            isDefault: { type: 'boolean', required: true }
        }
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userObj = req.user;
        const user = yield (0, user_service_1.getUser)(userObj.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // TODO: Implement address creation
        res.status(201).json({ success: true, data: {} });
    }
    catch (error) {
        res.status(500).json({ error: 'Error adding address' });
    }
}));
// Admin routes
router.get('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = yield (0, user_service_1.getAllUsers)(page, limit);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
}));
router.get('/:userId', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userObj = req.user;
        const user = yield (0, user_service_1.getUser)(userObj.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
}));
router.patch('/:userId', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userObj = req.user;
        const user = yield (0, user_service_1.updateUser)(userObj.id, req.body);
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
}));
router.delete('/:userId', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userObj = req.user;
        const user = yield (0, user_service_1.deleteUser)(userObj.id);
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
}));
exports.default = router;
