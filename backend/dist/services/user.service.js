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
exports.getUserByPhone = exports.getUserByEmail = exports.getAllUsers = exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, password, name, role } = data;
    const userData = {
        name,
        role: role || client_1.Role.CUSTOMER
    };
    if (email)
        userData.email = email;
    if (phoneNumber)
        userData.phoneNumber = phoneNumber;
    if (password) {
        userData.password = yield bcryptjs_1.default.hash(password, 10);
    }
    return prisma.user.create({
        data: userData,
        select: {
            id: true,
            email: true,
            phoneNumber: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });
});
exports.createUser = createUser;
const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            phoneNumber: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            addresses: true,
            subscription: true
        }
    });
});
exports.getUser = getUser;
const updateUser = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, password, name, role } = data;
    const userData = {};
    if (email)
        userData.email = email;
    if (phoneNumber)
        userData.phoneNumber = phoneNumber;
    if (name)
        userData.name = name;
    if (role)
        userData.role = role;
    if (password) {
        userData.password = yield bcryptjs_1.default.hash(password, 10);
    }
    return prisma.user.update({
        where: { id: userId },
        data: userData,
        select: {
            id: true,
            email: true,
            phoneNumber: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });
});
exports.updateUser = updateUser;
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.delete({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            phoneNumber: true,
            name: true,
            role: true
        }
    });
});
exports.deleteUser = deleteUser;
const getAllUsers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = yield Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                email: true,
                phoneNumber: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prisma.user.count()
    ]);
    return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
});
exports.getAllUsers = getAllUsers;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            phoneNumber: true,
            name: true,
            role: true,
            password: true
        }
    });
});
exports.getUserByEmail = getUserByEmail;
const getUserByPhone = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.findUnique({
        where: { phoneNumber },
        select: {
            id: true,
            email: true,
            phoneNumber: true,
            name: true,
            role: true,
            password: true
        }
    });
});
exports.getUserByPhone = getUserByPhone;
