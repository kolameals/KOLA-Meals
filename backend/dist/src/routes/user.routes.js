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
const user_service_1 = require("../services/user.service");
const validation_middleware_1 = require("../middleware/validation.middleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
 *               - apartment
 *               - tower
 *               - floor
 *               - roomNumber
 *               - street
 *               - city
 *               - state
 *               - postalCode
 *               - country
 *               - isDefault
 *             properties:
 *               apartment:
 *                 type: string
 *                 example: 1
 *               tower:
 *                 type: string
 *                 example: A
 *               floor:
 *                 type: string
 *                 example: 2
 *               roomNumber:
 *                 type: string
 *                 example: 3
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
 *                     apartment:
 *                       type: string
 *                     tower:
 *                       type: string
 *                     floor:
 *                       type: string
 *                     roomNumber:
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
            apartment: { type: 'string', required: true },
            tower: { type: 'string', required: true },
            floor: { type: 'string', required: true },
            roomNumber: { type: 'string', required: true },
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
        // Check if user exists
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userObj.id }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // If this is the first address or isDefault is true, set all other addresses to non-default
        if (req.body.isDefault) {
            yield prisma_1.default.address.updateMany({
                where: { userId: userObj.id },
                data: { isDefault: false }
            });
        }
        // Create the new address
        const address = yield prisma_1.default.address.create({
            data: Object.assign(Object.assign({}, req.body), { userId: userObj.id })
        });
        res.status(201).json({
            success: true,
            data: address
        });
    }
    catch (error) {
        console.error('Error creating address:', error);
        res.status(500).json({
            error: 'Error adding address',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
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
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: +1234567890
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [ADMIN, CUSTOMER, DELIVERY_PARTNER]
 *                 example: CUSTOMER
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 */
router.post('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phoneNumber: { type: 'string' },
            password: { type: 'string', minLength: 6 },
            role: { type: 'string', enum: ['ADMIN', 'CUSTOMER', 'DELIVERY_PARTNER'] }
        },
        required: ['name', 'password']
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.createUser)(req.body);
        res.status(201).json({ success: true, data: user });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
}));
// Admin routes
router.get('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
// Update user route
router.patch('/:userId', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phoneNumber: { type: 'string' },
            password: { type: 'string', minLength: 6 },
            role: { type: 'string', enum: ['ADMIN', 'CUSTOMER', 'DELIVERY_PARTNER'] }
        },
        required: []
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield (0, user_service_1.updateUser)(userId, req.body);
        res.json({ success: true, data: user });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
}));
// Delete user route
router.delete('/:userId', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        yield (0, user_service_1.deleteUser)(userId);
        res.json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
}));
/**
 * Admin: List all delivery partners
 */
router.get('/admin/delivery-partners', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [deliveryPartners, total] = yield Promise.all([
            prisma_1.default.user.findMany({
                where: {
                    role: 'DELIVERY_PARTNER'
                },
                include: {
                    deliveryAgent: {
                        include: {
                            apartment: {
                                include: {
                                    towers: true
                                }
                            }
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma_1.default.user.count({
                where: {
                    role: 'DELIVERY_PARTNER'
                }
            })
        ]);
        res.json({
            success: true,
            data: deliveryPartners,
            meta: {
                page,
                limit,
                total
            }
        });
    }
    catch (error) {
        console.error('Error fetching delivery partners:', error);
        res.status(500).json({ error: 'Error fetching delivery partners' });
    }
}));
/**
 * Admin: Create a new delivery partner
 */
router.post('/admin/delivery-partners', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phoneNumber: { type: 'string' },
            password: { type: 'string', minLength: 6 },
            apartmentId: { type: 'string' },
            assignedTowers: {
                type: 'array',
                items: { type: 'string' }
            },
            assignedRooms: {
                type: 'array',
                items: { type: 'string' }
            },
            mealCount: { type: 'number' }
        },
        required: ['name', 'email', 'phoneNumber', 'password', 'apartmentId']
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phoneNumber, password, apartmentId, assignedTowers, assignedRooms, mealCount } = req.body;
        // Check if user with email or phone already exists
        const existingUser = yield prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phoneNumber }
                ]
            }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or phone number already exists' });
        }
        // Check if apartment exists
        const apartment = yield prisma_1.default.apartment.findUnique({
            where: { id: apartmentId }
        });
        if (!apartment) {
            return res.status(400).json({ error: 'Apartment not found' });
        }
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const deliveryPartner = yield prisma_1.default.user.create({
            data: {
                name,
                email,
                phoneNumber,
                password: hashedPassword,
                role: 'DELIVERY_PARTNER',
                deliveryAgent: {
                    create: {
                        apartmentId,
                        assignedTowers: assignedTowers || [],
                        assignedRooms: assignedRooms || [],
                        mealCount: mealCount || 35,
                        isAvailable: true
                    }
                }
            },
            include: {
                deliveryAgent: {
                    include: {
                        apartment: {
                            include: {
                                towers: true
                            }
                        }
                    }
                }
            }
        });
        res.status(201).json({ success: true, data: deliveryPartner });
    }
    catch (error) {
        console.error('Error creating delivery partner:', error);
        res.status(500).json({ error: 'Error creating delivery partner' });
    }
}));
/**
 * Admin: Update a delivery partner
 */
router.put('/admin/delivery-partners/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phoneNumber: { type: 'string' },
            apartmentId: { type: 'string' },
            assignedTowers: {
                type: 'array',
                items: { type: 'string' }
            },
            assignedRooms: {
                type: 'array',
                items: { type: 'string' }
            },
            mealCount: { type: 'number' }
        },
        required: []
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, email, phoneNumber, apartmentId, assignedTowers, assignedRooms, mealCount } = req.body;
        // Check if user exists and is a delivery partner
        const existingUser = yield prisma_1.default.user.findFirst({
            where: {
                id,
                role: 'DELIVERY_PARTNER'
            },
            include: {
                deliveryAgent: true
            }
        });
        if (!existingUser) {
            return res.status(404).json({ error: 'Delivery partner not found' });
        }
        // Check if email or phone is being changed and if it conflicts with existing users
        if (email || phoneNumber) {
            const conflictingUser = yield prisma_1.default.user.findFirst({
                where: {
                    OR: [
                        { email: email || undefined },
                        { phoneNumber: phoneNumber || undefined }
                    ],
                    NOT: {
                        id
                    }
                }
            });
            if (conflictingUser) {
                return res.status(400).json({ error: 'User with this email or phone number already exists' });
            }
        }
        // Check if apartment exists if being changed
        if (apartmentId) {
            const apartment = yield prisma_1.default.apartment.findUnique({
                where: { id: apartmentId }
            });
            if (!apartment) {
                return res.status(400).json({ error: 'Apartment not found' });
            }
        }
        const updatedPartner = yield prisma_1.default.user.update({
            where: { id },
            data: {
                name,
                email,
                phoneNumber,
                deliveryAgent: {
                    update: {
                        apartmentId,
                        assignedTowers,
                        assignedRooms,
                        mealCount
                    }
                }
            },
            include: {
                deliveryAgent: {
                    include: {
                        apartment: {
                            include: {
                                towers: true
                            }
                        }
                    }
                }
            }
        });
        res.json({ success: true, data: updatedPartner });
    }
    catch (error) {
        console.error('Error updating delivery partner:', error);
        res.status(500).json({ error: 'Error updating delivery partner' });
    }
}));
/**
 * Admin: Update delivery agent status
 */
router.patch('/admin/delivery-partners/:id/status', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        properties: {
            isAvailable: { type: 'boolean' }
        },
        required: ['isAvailable']
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { isAvailable } = req.body;
        const updatedPartner = yield prisma_1.default.user.update({
            where: { id },
            data: {
                deliveryAgent: {
                    update: {
                        isAvailable
                    }
                }
            },
            include: {
                deliveryAgent: {
                    include: {
                        apartment: {
                            include: {
                                towers: true
                            }
                        }
                    }
                }
            }
        });
        res.json({ success: true, data: updatedPartner });
    }
    catch (error) {
        console.error('Error updating delivery agent status:', error);
        res.status(500).json({ error: 'Error updating delivery agent status' });
    }
}));
/**
 * Admin: Update delivery agent assignments
 */
router.patch('/admin/delivery-partners/:id/assignments', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        properties: {
            assignedTowers: {
                type: 'array',
                items: { type: 'string' }
            },
            assignedRooms: {
                type: 'array',
                items: { type: 'string' }
            },
            mealCount: { type: 'number' }
        },
        required: ['assignedTowers', 'assignedRooms', 'mealCount']
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { assignedTowers, assignedRooms, mealCount } = req.body;
        const updatedPartner = yield prisma_1.default.user.update({
            where: { id },
            data: {
                deliveryAgent: {
                    update: {
                        assignedTowers,
                        assignedRooms,
                        mealCount
                    }
                }
            },
            include: {
                deliveryAgent: {
                    include: {
                        apartment: {
                            include: {
                                towers: true
                            }
                        }
                    }
                }
            }
        });
        res.json({ success: true, data: updatedPartner });
    }
    catch (error) {
        console.error('Error updating assignments:', error);
        res.status(500).json({ error: 'Error updating assignments' });
    }
}));
/**
 * Admin: List all apartments
 */
router.get('/apartments', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apartments = yield prisma_1.default.apartment.findMany({
            include: {
                towers: true
            }
        });
        res.json({
            success: true,
            data: apartments,
            meta: {
                page: 1,
                limit: apartments.length,
                total: apartments.length
            }
        });
    }
    catch (error) {
        console.error('Error fetching apartments:', error);
        res.status(500).json({ error: 'Error fetching apartments' });
    }
}));
exports.default = router;
