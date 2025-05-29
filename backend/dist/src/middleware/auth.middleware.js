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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_config_1 = require("../config/auth.config");
const prisma_1 = __importDefault(require("../lib/prisma"));
const authMiddleware = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'No token provided' });
            }
            const token = authHeader.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, auth_config_1.authConfig.jwt.secret);
            const user = yield prisma_1.default.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    role: true,
                    email: true,
                    name: true,
                    phoneNumber: true
                }
            });
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }
            // Verify that the role in the token matches the user's role
            if (user.role !== decoded.role) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            // Check if user's role is allowed
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
            }
            req.user = user;
            next();
        }
        catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    });
};
exports.authMiddleware = authMiddleware;
