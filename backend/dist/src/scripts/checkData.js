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
function checkData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check users with their relations
            const users = yield prisma_1.default.user.findMany({
                include: {
                    addresses: true,
                    subscription: {
                        include: {
                            plan: true
                        }
                    }
                }
            });
            console.log('Total users:', users.length);
            console.log('\nFirst user details:');
            console.log(JSON.stringify(users[0], null, 2));
            // Check addresses
            const addresses = yield prisma_1.default.address.findMany();
            console.log('\nTotal addresses:', addresses.length);
            console.log('\nFirst address details:');
            console.log(JSON.stringify(addresses[0], null, 2));
            // Check subscriptions
            const subscriptions = yield prisma_1.default.subscription.findMany({
                include: {
                    plan: true
                }
            });
            console.log('\nTotal subscriptions:', subscriptions.length);
            console.log('\nFirst subscription details:');
            console.log(JSON.stringify(subscriptions[0], null, 2));
        }
        catch (error) {
            console.error('Error checking data:', error);
        }
        finally {
            yield prisma_1.default.$disconnect();
        }
    });
}
checkData();
