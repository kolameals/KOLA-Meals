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
function checkUserRelations() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get all users with their relations
            const users = yield prisma_1.default.user.findMany({
                take: 5,
                include: {
                    addresses: true,
                    subscription: {
                        include: {
                            plan: true
                        }
                    }
                }
            });
            console.log('Total users:', yield prisma_1.default.user.count());
            console.log('Total addresses:', yield prisma_1.default.address.count());
            console.log('Total subscriptions:', yield prisma_1.default.subscription.count());
            // Log each user's data
            users.forEach((user, index) => {
                console.log(`\nUser ${index + 1}:`);
                console.log('ID:', user.id);
                console.log('Email:', user.email);
                console.log('Name:', user.name);
                console.log('Addresses:', user.addresses.length);
                console.log('Has subscription:', !!user.subscription);
                if (user.subscription) {
                    console.log('Subscription plan:', user.subscription.plan.name);
                }
            });
        }
        catch (error) {
            console.error('Error checking user relations:', error);
        }
        finally {
            yield prisma_1.default.$disconnect();
        }
    });
}
checkUserRelations();
