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
const test_utils_1 = require("../utils/test-utils");
const auth_service_1 = require("../../services/auth.service");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe('Auth Service', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_utils_1.testUtils.cleanupTestData();
    }));
    describe('register', () => {
        it('should register a new user with email and password', () => __awaiter(void 0, void 0, void 0, function* () {
            const unique = Date.now();
            const email = `test${unique}@example.com`;
            const phoneNumber = `+1234567890${unique}`;
            const password = 'Password123!';
            const name = 'Test User';
            const response = yield auth_service_1.authService.register(email, password, name, phoneNumber);
            expect(response.user.email).toBe(email);
        }));
        it('should not register a user with existing email', () => __awaiter(void 0, void 0, void 0, function* () {
            const unique = Date.now();
            const email = `test${unique}@example.com`;
            const phoneNumber = `+1234567890${unique}`;
            const password = 'Password123!';
            const name = 'Test User';
            yield auth_service_1.authService.register(email, password, name, phoneNumber);
            yield expect(auth_service_1.authService.register(email, password, name, phoneNumber)).rejects.toThrow();
        }));
    });
    describe('login', () => {
        it('should login a user with correct credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const unique = Date.now();
            const email = `test${unique}@example.com`;
            const phoneNumber = `+1234567890${unique}`;
            const password = 'Password123!';
            const name = 'Test User';
            yield auth_service_1.authService.register(email, password, name, phoneNumber);
            const response = yield auth_service_1.authService.login(email, password);
            expect(response.token).toBeDefined();
        }));
        it('should not login a user with incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
            const unique = Date.now();
            const email = `test${unique}@example.com`;
            const phoneNumber = `+1234567890${unique}`;
            const password = 'Password123!';
            const name = 'Test User';
            yield auth_service_1.authService.register(email, password, name, phoneNumber);
            yield expect(auth_service_1.authService.login(email, 'wrongpassword')).rejects.toThrow();
        }));
    });
});
