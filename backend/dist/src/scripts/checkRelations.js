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
function checkRelations() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check users with their relations
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
            console.log('Total users:', yield prisma_1.default.user.count());
            console.log('Total addresses:', yield prisma_1.default.address.count());
            console.log('Total subscriptions:', yield prisma_1.default.subscription.count());
            if (users.length > 0) {
                const user = users[0];
                console.log('\nFirst user details:');
                console.log('User ID:', user.id);
                console.log('User email:', user.email);
                console.log('User name:', user.name);
                console.log('\nAddresses:');
                console.log(JSON.stringify(user.addresses, null, 2));
                console.log('\nSubscription:');
                console.log(JSON.stringify(user.subscription, null, 2));
            }
            else {
                console.log('No users found in the database');
            }
        }
        catch (error) {
            console.error('Error checking relations:', error);
        }
        finally {
            yield prisma_1.default.$disconnect();
        }
    });
}
checkRelations();
