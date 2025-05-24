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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
const test_utils_1 = require("../utils/test-utils");
describe('Meal Routes', () => {
    let adminToken;
    let userToken;
    let adminUser;
    let regularUser;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_utils_1.testUtils.cleanupTestData();
        // Create admin user
        adminUser = yield test_utils_1.testUtils.createTestUser({
            email: 'admin@example.com',
            phoneNumber: '+1234567890',
            role: 'ADMIN',
        });
        adminToken = test_utils_1.testUtils.generateTestToken(adminUser.id, 'ADMIN');
        // Create regular user
        regularUser = yield test_utils_1.testUtils.createTestUser({
            email: 'test@example.com',
            phoneNumber: '+1234567891',
            password: 'password123',
            role: 'CUSTOMER',
        });
        userToken = test_utils_1.testUtils.generateTestToken(regularUser.id, 'CUSTOMER');
    }));
    describe('POST /api/meals', () => {
        it('should create a new meal when admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const mealData = {
                name: 'Test Meal',
                description: 'Test Description',
                price: 10.99,
                category: 'Test Category',
            };
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/meals')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(mealData);
            expect(response.status).toBe(201);
            expect(response.body.name).toBe(mealData.name);
        }));
        it('should not create a meal when not admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const mealData = {
                name: 'Test Meal',
                description: 'Test Description',
                price: 10.99,
                category: 'Test Category',
            };
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/meals')
                .set('Authorization', `Bearer ${userToken}`)
                .send(mealData);
            expect(response.status).toBe(403);
        }));
    });
    describe('GET /api/meals', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // Create some test meals
            yield test_utils_1.testUtils.createTestMeal({ name: 'Meal 1' });
            yield test_utils_1.testUtils.createTestMeal({ name: 'Meal 2' });
        }));
        it('should get all meals', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .get('/api/meals')
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
        }));
        it('should filter meals by category', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .get('/api/meals?category=Test Category')
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
        }));
    });
    describe('PUT /api/meals/:id', () => {
        let testMeal;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            testMeal = yield test_utils_1.testUtils.createTestMeal({ name: 'Original Name' });
        }));
        it('should update a meal when admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const updateData = {
                name: 'Updated Name',
            };
            const response = yield (0, supertest_1.default)(app_1.app)
                .put(`/api/meals/${testMeal.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);
            expect(response.status).toBe(200);
            expect(response.body.name).toBe(updateData.name);
        }));
        it('should not update a meal when not admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const updateData = {
                name: 'Updated Name',
            };
            const response = yield (0, supertest_1.default)(app_1.app)
                .put(`/api/meals/${testMeal.id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updateData);
            expect(response.status).toBe(403);
        }));
    });
});
