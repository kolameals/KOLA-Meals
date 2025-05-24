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
exports.testUtils = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_config_1 = require("../../config/auth.config");
const prisma = new client_1.PrismaClient();
exports.testUtils = {
    // Create a test user
    createTestUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const unique = Date.now();
            return prisma.user.create({
                data: {
                    email: data.email || `test${unique}@example.com`,
                    phoneNumber: data.phoneNumber || `+1234567890${unique}`,
                    password: data.password || 'password123',
                    role: data.role || 'CUSTOMER',
                    name: data.name || 'Test User',
                },
            });
        });
    },
    // Generate JWT token for testing
    generateTestToken(userId, role = 'CUSTOMER') {
        const options = { expiresIn: auth_config_1.authConfig.jwt.expiresIn };
        return jsonwebtoken_1.default.sign({ id: userId, role }, auth_config_1.authConfig.jwt.secret, options);
    },
    // Create test meal
    createTestMeal(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.meal.create({
                data: {
                    name: data.name || 'Test Meal',
                    description: data.description || 'Test Description',
                    price: data.price || 10.99,
                    category: data.category || 'Test Category',
                },
            });
        });
    },
    // Create test subscription
    createTestSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.subscription.create({
                data: {
                    userId: data.userId,
                    status: data.status || 'ACTIVE',
                    startDate: data.startDate || new Date(),
                    endDate: data.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });
        });
    },
    // Create test order
    createTestOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.order.create({
                data: {
                    userId: data.userId,
                    amount: data.amount,
                    currency: 'INR',
                    status: data.status || 'PENDING',
                    paymentStatus: 'PENDING',
                    subscriptionId: data.subscriptionId,
                    customerName: 'Test Customer',
                    customerEmail: 'test@example.com',
                    customerPhone: '+1234567890',
                },
            });
        });
    },
    // Clean up test data
    cleanupTestData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.$transaction([
                prisma.user.deleteMany(),
                prisma.meal.deleteMany(),
                prisma.subscription.deleteMany(),
                prisma.order.deleteMany(),
                prisma.delivery.deleteMany(),
            ]);
        });
    },
};
