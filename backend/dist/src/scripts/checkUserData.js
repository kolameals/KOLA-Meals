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
function checkUserData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get a specific user with relations
            const user = yield prisma_1.default.user.findUnique({
                where: {
                    email: 'shrayank@kolameals.com'
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
            console.log('User data:', JSON.stringify(user, null, 2));
            // Check if there are any addresses
            const addresses = yield prisma_1.default.address.findMany({
                take: 5
            });
            console.log('\nSample addresses:', JSON.stringify(addresses, null, 2));
            // Check if there are any subscriptions
            const subscriptions = yield prisma_1.default.subscription.findMany({
                take: 5,
                include: {
                    plan: true
                }
            });
            console.log('\nSample subscriptions:', JSON.stringify(subscriptions, null, 2));
        }
        catch (error) {
            console.error('Error checking user data:', error);
        }
        finally {
            yield prisma_1.default.$disconnect();
        }
    });
}
checkUserData();
