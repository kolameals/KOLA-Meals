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
const prisma_1 = __importDefault(require("../lib/prisma"));
function checkTables() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check table names
            const tables = yield prisma_1.default.$queryRaw `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
            console.log('Available tables:', tables);
            // Check User table
            const users = yield prisma_1.default.user.findMany({
                take: 1,
                include: {
                    addresses: true,
                    subscription: {
                        include: {
                            plan: true
                        }
                    }
                }
            });
            console.log('\nFirst user with relations:', JSON.stringify(users[0], null, 2));
            // Check Address table
            const addresses = yield prisma_1.default.address.findMany({
                take: 1
            });
            console.log('\nFirst address:', JSON.stringify(addresses[0], null, 2));
            // Check Subscription table
            const subscriptions = yield prisma_1.default.subscription.findMany({
                take: 1,
                include: {
                    plan: true
                }
            });
            console.log('\nFirst subscription:', JSON.stringify(subscriptions[0], null, 2));
        }
        catch (error) {
            console.error('Error checking tables:', error);
        }
        finally {
            yield prisma_1.default.$disconnect();
        }
    });
}
checkTables();
