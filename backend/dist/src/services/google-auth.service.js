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
exports.handleGoogleAuth = void 0;
const error_types_1 = require("../types/error.types");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_config_1 = require("../config/auth.config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_config_1 = __importDefault(require("../config/logger.config"));
const handleGoogleAuth = (profile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user exists
        let user = yield prisma_1.default.user.findUnique({
            where: { email: profile.email }
        });
        if (!user) {
            // Create new user
            user = yield prisma_1.default.user.create({
                data: {
                    email: profile.email,
                    name: profile.name,
                    role: 'CUSTOMER',
                    phoneNumber: `google_${Date.now()}`,
                    password: Math.random().toString(36).slice(-8)
                }
            });
        }
        // Generate tokens
        const { token, refreshToken } = generateTokens(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token,
            refreshToken
        };
    }
    catch (error) {
        logger_config_1.default.error('Error in Google auth:', { error, profile });
        throw new error_types_1.AppError('Error during Google authentication', 500);
    }
});
exports.handleGoogleAuth = handleGoogleAuth;
function generateTokens(user) {
    if (!auth_config_1.authConfig.jwt.secret || !auth_config_1.authConfig.jwt.refreshSecret) {
        throw new error_types_1.AppError('JWT configuration missing', 500);
    }
    const options = {
        expiresIn: auth_config_1.authConfig.jwt.expiresIn
    };
    const refreshOptions = {
        expiresIn: auth_config_1.authConfig.jwt.refreshExpiresIn
    };
    const token = jsonwebtoken_1.default.sign({ id: user.id }, auth_config_1.authConfig.jwt.secret, options);
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, auth_config_1.authConfig.jwt.refreshSecret, refreshOptions);
    return { token, refreshToken };
}
