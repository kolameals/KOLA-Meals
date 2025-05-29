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
exports.userManagementService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const user_types_1 = require("../types/user.types");
exports.userManagementService = {
    getUsers() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, search) {
            try {
                const skip = (page - 1) * limit;
                const where = search
                    ? {
                        OR: [
                            { name: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } },
                            { phoneNumber: { contains: search, mode: 'insensitive' } },
                        ],
                    }
                    : {};
                console.log('Query parameters:', { page, limit, skip, search, where });
                const [users, total] = yield Promise.all([
                    prisma_1.default.user.findMany({
                        where,
                        skip,
                        take: limit,
                        orderBy: { id: 'asc' },
                        select: {
                            id: true,
                            email: true,
                            phoneNumber: true,
                            name: true,
                            role: true,
                            createdAt: true,
                            updatedAt: true,
                            addresses: {
                                select: {
                                    id: true,
                                    apartment: true,
                                    tower: true,
                                    floor: true,
                                    roomNumber: true,
                                    street: true,
                                    city: true,
                                    state: true,
                                    postalCode: true,
                                    country: true,
                                    isDefault: true,
                                    createdAt: true,
                                    updatedAt: true
                                }
                            },
                            subscription: {
                                select: {
                                    id: true,
                                    status: true,
                                    startDate: true,
                                    endDate: true,
                                    plan: {
                                        select: {
                                            id: true,
                                            name: true,
                                            price: true,
                                            mealsPerDay: true,
                                            description: true
                                        }
                                    }
                                }
                            }
                        }
                    }),
                    prisma_1.default.user.count({ where })
                ]);
                // Ensure each user has addresses and subscription fields
                const usersWithRelations = users.map(user => (Object.assign(Object.assign({}, user), { addresses: user.addresses || [], subscription: user.subscription || null })));
                // Debug: Log the first user's complete data
                if (usersWithRelations.length > 0) {
                    console.log('First user complete data:', {
                        id: usersWithRelations[0].id,
                        email: usersWithRelations[0].email,
                        name: usersWithRelations[0].name,
                        addresses: usersWithRelations[0].addresses,
                        subscription: usersWithRelations[0].subscription
                    });
                }
                return {
                    data: usersWithRelations,
                    meta: {
                        total,
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit)
                    }
                };
            }
            catch (error) {
                console.error('Error in getUsers:', error);
                throw error;
            }
        });
    },
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
            return prisma_1.default.user.create({
                data: {
                    name: userData.name,
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '',
                    password: hashedPassword,
                    role: userData.role
                },
                include: {
                    addresses: true,
                    subscription: {
                        include: {
                            plan: true
                        }
                    }
                }
            });
        });
    },
    updateUser(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = {};
            if (userData.name)
                updateData.name = userData.name;
            if (userData.email !== undefined)
                updateData.email = userData.email || '';
            if (userData.phoneNumber !== undefined)
                updateData.phoneNumber = userData.phoneNumber || '';
            if (userData.role)
                updateData.role = userData.role;
            if (userData.password) {
                updateData.password = yield bcryptjs_1.default.hash(userData.password, 10);
            }
            return prisma_1.default.user.update({
                where: { id: userId },
                data: updateData,
                include: {
                    addresses: true,
                    subscription: {
                        include: {
                            plan: true
                        }
                    }
                }
            });
        });
    },
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.user.delete({
                where: { id: userId }
            });
        });
    },
    getDeliveryPartners(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [deliveryPartners, total] = yield Promise.all([
                prisma_1.default.user.findMany({
                    where: { role: user_types_1.UserRole.DELIVERY_PARTNER },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        deliveryAgent: true
                    }
                }),
                prisma_1.default.user.count({
                    where: { role: user_types_1.UserRole.DELIVERY_PARTNER }
                })
            ]);
            return {
                data: deliveryPartners,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        });
    },
    createDeliveryPartner(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
            return prisma_1.default.user.create({
                data: {
                    name: userData.name,
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '',
                    password: hashedPassword,
                    role: user_types_1.UserRole.DELIVERY_PARTNER
                }
            });
        });
    },
    getUsersByApartment() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma_1.default.user.findMany({
                    where: {
                        addresses: {
                            some: {} // Has at least one address
                        }
                    },
                    include: {
                        addresses: {
                            select: {
                                id: true,
                                apartment: true,
                                tower: true,
                                floor: true,
                                roomNumber: true,
                                isDefault: true
                            }
                        },
                        subscription: {
                            select: {
                                id: true,
                                status: true,
                                plan: {
                                    select: {
                                        id: true,
                                        name: true,
                                        mealsPerDay: true
                                    }
                                }
                            }
                        }
                    }
                });
                // Group users by apartment and tower
                const apartmentGroups = users.reduce((acc, user) => {
                    user.addresses.forEach(address => {
                        var _a, _b;
                        if (address.apartment && address.tower) {
                            const key = `${address.apartment}-${address.tower}`;
                            if (!acc[key]) {
                                acc[key] = {
                                    apartment: address.apartment,
                                    tower: address.tower,
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
                        }
                    });
                    return acc;
                }, {});
                return {
                    success: true,
                    data: Object.values(apartmentGroups)
                };
            }
            catch (error) {
                console.error('Error in getUsersByApartment:', error);
                throw error;
            }
        });
    },
    getNonSubscribedUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma_1.default.user.findMany({
                    where: {
                        OR: [
                            { subscription: null },
                            { subscription: { status: { not: 'ACTIVE' } } }
                        ]
                    },
                    include: {
                        addresses: {
                            select: {
                                id: true,
                                apartment: true,
                                tower: true,
                                floor: true,
                                roomNumber: true,
                                isDefault: true
                            }
                        },
                        subscription: {
                            select: {
                                id: true,
                                status: true,
                                startDate: true,
                                endDate: true,
                                plan: {
                                    select: {
                                        id: true,
                                        name: true,
                                        mealsPerDay: true,
                                        price: true
                                    }
                                }
                            }
                        }
                    }
                });
                return {
                    success: true,
                    data: users.map(user => ({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        addresses: user.addresses,
                        subscription: user.subscription
                    }))
                };
            }
            catch (error) {
                console.error('Error in getNonSubscribedUsers:', error);
                throw error;
            }
        });
    },
    getActiveSubscribers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma_1.default.user.findMany({
                    where: {
                        subscription: {
                            status: 'ACTIVE'
                        }
                    },
                    include: {
                        addresses: {
                            select: {
                                id: true,
                                apartment: true,
                                tower: true,
                                floor: true,
                                roomNumber: true,
                                isDefault: true
                            }
                        },
                        subscription: {
                            select: {
                                id: true,
                                status: true,
                                startDate: true,
                                endDate: true,
                                plan: {
                                    select: {
                                        id: true,
                                        name: true,
                                        mealsPerDay: true,
                                        price: true
                                    }
                                }
                            }
                        }
                    }
                });
                return {
                    success: true,
                    data: users.map(user => ({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        addresses: user.addresses,
                        subscription: user.subscription
                    }))
                };
            }
            catch (error) {
                console.error('Error in getActiveSubscribers:', error);
                throw error;
            }
        });
    }
};
