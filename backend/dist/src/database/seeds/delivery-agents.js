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
exports.seedDeliveryAgents = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const deliveryAgents = [
    {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@kolameals.com',
        phoneNumber: '+91 9876543210',
        password: 'Delivery@123',
        role: client_1.Role.DELIVERY_PARTNER,
        deliveryAgent: {
            create: {
                currentLocation: 'Tower A',
                isAvailable: true,
                mealCount: 35,
                apartmentId: '1', // You'll need to create an apartment first
                assignedTowers: ['Tower A', 'Tower B'],
                assignedRooms: ['101', '102', '201', '202']
            }
        }
    },
    {
        name: 'Priya Patel',
        email: 'priya.patel@kolameals.com',
        phoneNumber: '+91 9876543211',
        password: 'Delivery@123',
        role: client_1.Role.DELIVERY_PARTNER,
        deliveryAgent: {
            create: {
                currentLocation: 'Tower C',
                isAvailable: true,
                mealCount: 35,
                apartmentId: '1',
                assignedTowers: ['Tower C', 'Tower D'],
                assignedRooms: ['301', '302', '401', '402']
            }
        }
    },
    {
        name: 'Amit Kumar',
        email: 'amit.kumar@kolameals.com',
        phoneNumber: '+91 9876543212',
        password: 'Delivery@123',
        role: client_1.Role.DELIVERY_PARTNER,
        deliveryAgent: {
            create: {
                currentLocation: 'Tower E',
                isAvailable: true,
                mealCount: 35,
                apartmentId: '1',
                assignedTowers: ['Tower E', 'Tower F'],
                assignedRooms: ['501', '502', '601', '602']
            }
        }
    },
    {
        name: 'Neha Singh',
        email: 'neha.singh@kolameals.com',
        phoneNumber: '+91 9876543213',
        password: 'Delivery@123',
        role: client_1.Role.DELIVERY_PARTNER,
        deliveryAgent: {
            create: {
                currentLocation: 'Tower G',
                isAvailable: true,
                mealCount: 35,
                apartmentId: '1',
                assignedTowers: ['Tower G', 'Tower H'],
                assignedRooms: ['701', '702', '801', '802']
            }
        }
    },
    {
        name: 'Vikram Mehta',
        email: 'vikram.mehta@kolameals.com',
        phoneNumber: '+91 9876543214',
        password: 'Delivery@123',
        role: client_1.Role.DELIVERY_PARTNER,
        deliveryAgent: {
            create: {
                currentLocation: 'Tower I',
                isAvailable: true,
                mealCount: 35,
                apartmentId: '1',
                assignedTowers: ['Tower I', 'Tower J'],
                assignedRooms: ['901', '902', '1001', '1002']
            }
        }
    },
    {
        name: 'Anjali Gupta',
        email: 'anjali.gupta@kolameals.com',
        phoneNumber: '+91 9876543215',
        password: 'Delivery@123',
        role: client_1.Role.DELIVERY_PARTNER,
        deliveryAgent: {
            create: {
                currentLocation: 'Tower K',
                isAvailable: true,
                mealCount: 35,
                apartmentId: '1',
                assignedTowers: ['Tower K', 'Tower L'],
                assignedRooms: ['1101', '1102', '1201', '1202']
            }
        }
    },
    {
        name: 'Rajesh Verma',
        email: 'rajesh.verma@kolameals.com',
        phoneNumber: '+91 9876543216',
        password: 'Delivery@123',
        role: client_1.Role.DELIVERY_PARTNER,
        deliveryAgent: {
            create: {
                currentLocation: 'Tower M',
                isAvailable: true,
                mealCount: 35,
                apartmentId: '1',
                assignedTowers: ['Tower M', 'Tower N'],
                assignedRooms: ['1301', '1302', '1401', '1402']
            }
        }
    },
    {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@kolameals.com',
        phoneNumber: '+91 9876543217',
        password: 'Delivery@123',
        role: client_1.Role.DELIVERY_PARTNER,
        deliveryAgent: {
            create: {
                currentLocation: 'Tower O',
                isAvailable: true,
                mealCount: 35,
                apartmentId: '1',
                assignedTowers: ['Tower O', 'Tower P'],
                assignedRooms: ['1501', '1502', '1601', '1602']
            }
        }
    },
    {
        name: 'Arun Joshi',
        email: 'arun.joshi@kolameals.com',
        phoneNumber: '+91 9876543218',
        password: 'Delivery@123',
        role: client_1.Role.DELIVERY_PARTNER,
        deliveryAgent: {
            create: {
                currentLocation: 'Tower Q',
                isAvailable: true,
                mealCount: 35,
                apartmentId: '1',
                assignedTowers: ['Tower Q', 'Tower R'],
                assignedRooms: ['1701', '1702', '1801', '1802']
            }
        }
    },
    {
        name: 'Pooja Shah',
        email: 'pooja.shah@kolameals.com',
        phoneNumber: '+91 9876543219',
        password: 'Delivery@123',
        role: client_1.Role.DELIVERY_PARTNER,
        deliveryAgent: {
            create: {
                currentLocation: 'Tower S',
                isAvailable: true,
                mealCount: 35,
                apartmentId: '1',
                assignedTowers: ['Tower S', 'Tower T'],
                assignedRooms: ['1901', '1902', '2001', '2002']
            }
        }
    }
];
const seedDeliveryAgents = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Seeding delivery agents...');
    // First create an apartment
    const apartment = yield prisma.apartment.create({
        data: {
            name: 'KOLA Residences',
            address: '123 Main Street',
            city: 'Bangalore',
            state: 'Karnataka',
            postalCode: '560001'
        }
    });
    // Create towers
    const towers = yield Promise.all(Array.from({ length: 20 }, (_, i) => prisma.tower.create({
        data: {
            name: `Tower ${String.fromCharCode(65 + i)}`,
            apartmentId: apartment.id,
            floors: 10,
            roomsPerFloor: 4
        }
    })));
    // Create delivery agents
    for (const agent of deliveryAgents) {
        const hashedPassword = yield bcryptjs_1.default.hash(agent.password, 10);
        yield prisma.user.create({
            data: {
                name: agent.name,
                email: agent.email,
                phoneNumber: agent.phoneNumber,
                password: hashedPassword,
                role: agent.role,
                deliveryAgent: {
                    create: Object.assign(Object.assign({}, agent.deliveryAgent.create), { apartmentId: apartment.id })
                }
            }
        });
    }
    console.log('Delivery agents seeded successfully!');
});
exports.seedDeliveryAgents = seedDeliveryAgents;
