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
const dotenv_1 = __importDefault(require("dotenv"));
// Load test environment variables
dotenv_1.default.config({ path: '.env.test' });
// Create a new Prisma client for testing
const prisma = new client_1.PrismaClient();
// Global setup
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Clean up database before tests
    yield prisma.$connect();
    yield cleanDatabase();
}));
// Global teardown
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
// Clean database function
function cleanDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const tables = [
            'User',
            'Meal',
            'Subscription',
            'Order',
            'Delivery',
            // Add other tables as needed
        ];
        for (const table of tables) {
            yield prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
        }
    });
}
// Export test utilities
exports.testUtils = {
    prisma,
    cleanDatabase,
};
