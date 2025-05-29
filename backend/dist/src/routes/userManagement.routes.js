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
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_types_1 = require("../types/user.types");
const userManagement_controller_1 = require("../controllers/userManagement.controller");
const router = express_1.default.Router();
// User Management Routes
router.get('/', (0, auth_middleware_1.authMiddleware)([user_types_1.UserRole.ADMIN]), userManagement_controller_1.getUsers);
router.get('/active-subscribers', (0, auth_middleware_1.authMiddleware)([user_types_1.UserRole.ADMIN]), userManagement_controller_1.getActiveSubscribers);
router.get('/addresses', (0, auth_middleware_1.authMiddleware)([user_types_1.UserRole.ADMIN]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addresses = yield prisma_1.default.address.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        });
        res.json({ success: true, data: addresses });
    }
    catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch addresses' });
    }
}));
router.get('/by-apartment', (0, auth_middleware_1.authMiddleware)([user_types_1.UserRole.ADMIN]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany({
            include: {
                addresses: {
                    select: {
                        apartment: true,
                        tower: true,
                        floor: true,
                        roomNumber: true
                    }
                },
                subscription: {
                    select: {
                        status: true
                    }
                }
            }
        });
        // Group users by apartment
        const apartmentData = users.reduce((acc, user) => {
            user.addresses.forEach(address => {
                var _a, _b;
                const key = address.apartment;
                if (!acc[key]) {
                    acc[key] = {
                        apartment: key,
                        users: [],
                        totalUsers: 0,
                        activeSubscribers: 0
                    };
                }
                acc[key].users.push({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    floor: address.floor,
                    roomNumber: address.roomNumber,
                    hasActiveSubscription: ((_a = user.subscription) === null || _a === void 0 ? void 0 : _a.status) === 'ACTIVE'
                });
                acc[key].totalUsers++;
                if (((_b = user.subscription) === null || _b === void 0 ? void 0 : _b.status) === 'ACTIVE') {
                    acc[key].activeSubscribers++;
                }
            });
            return acc;
        }, {});
        res.json({ success: true, data: Object.values(apartmentData) });
    }
    catch (error) {
        console.error('Error fetching users by apartment:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users by apartment' });
    }
}));
router.post('/', (0, auth_middleware_1.authMiddleware)([user_types_1.UserRole.ADMIN]), userManagement_controller_1.createUser);
router.put('/:id', (0, auth_middleware_1.authMiddleware)([user_types_1.UserRole.ADMIN]), userManagement_controller_1.updateUser);
router.delete('/:id', (0, auth_middleware_1.authMiddleware)([user_types_1.UserRole.ADMIN]), userManagement_controller_1.deleteUser);
// Delivery Partner Routes
router.get('/admin/delivery-partners', (0, auth_middleware_1.authMiddleware)([user_types_1.UserRole.ADMIN]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Transform the response to include tower details
        const transformedPartners = deliveryPartners.map(partner => {
            const agent = partner.deliveryAgent;
            return Object.assign(Object.assign({}, partner), { deliveryAgent: agent ? Object.assign(Object.assign({}, agent), { assignedTowerDetails: Array.isArray(agent.assignedTowers) && agent.apartment && Array.isArray(agent.apartment.towers)
                        ? agent.assignedTowers.map((towerId) => {
                            const tower = agent.apartment.towers.find((t) => t.id === towerId);
                            return tower ? {
                                id: tower.id,
                                name: tower.name,
                                floors: tower.floors,
                                roomsPerFloor: tower.roomsPerFloor
                            } : null;
                        }).filter(Boolean)
                        : [] }) : null });
        });
        res.json({
            data: transformedPartners,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Error fetching delivery partners:', error);
        res.status(500).json({
            error: 'Error fetching delivery partners',
            data: [],
            meta: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0
            }
        });
    }
}));
router.post('/admin/delivery-partners', (0, auth_middleware_1.authMiddleware)([user_types_1.UserRole.ADMIN]), userManagement_controller_1.createDeliveryPartner);
router.post('/admin/delivery-partners/reset-assignments', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all delivery agent IDs
        const agents = yield prisma_1.default.deliveryAgent.findMany({ select: { id: true } });
        // Update each agent individually
        yield Promise.all(agents.map(agent => prisma_1.default.deliveryAgent.update({
            where: { id: agent.id },
            data: {
                isAvailable: true,
                currentLocation: '',
                assignedTowers: { set: [] },
                assignedRooms: { set: [] }
            }
        })));
        res.json({
            success: true,
            message: 'All delivery partner assignments have been reset successfully'
        });
    }
    catch (error) {
        console.error('Error resetting assignments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset assignments'
        });
    }
}));
exports.default = router;
