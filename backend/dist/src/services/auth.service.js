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
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_config_1 = require("../config/auth.config");
const error_types_1 = require("../types/error.types");
const logger_config_1 = __importDefault(require("../config/logger.config"));
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.authService = {
    register(email, password, name, phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate password complexity
                if (!this.isPasswordStrong(password)) {
                    throw new error_types_1.AppError('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character', 400);
                }
                const existingUser = yield prisma_1.default.user.findFirst({
                    where: {
                        OR: [
                            { email },
                            { phoneNumber }
                        ]
                    }
                });
                if (existingUser) {
                    throw new error_types_1.AppError('User with this email or phone number already exists', 400);
                }
                const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
                const user = yield prisma_1.default.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        name,
                        phoneNumber,
                        role: 'CUSTOMER'
                    }
                });
                const { token, refreshToken } = this.generateTokens(user);
                return this.formatAuthResponse(user, token, refreshToken);
            }
            catch (error) {
                logger_config_1.default.error('Registration error:', { error, email });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error creating user', 500);
            }
        });
    },
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_1.default.user.findUnique({
                    where: { email }
                });
                if (!user || !user.password) {
                    throw new error_types_1.AppError('Invalid credentials', 401);
                }
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (!isMatch) {
                    throw new error_types_1.AppError('Invalid credentials', 401);
                }
                const { token, refreshToken } = this.generateTokens(user);
                return this.formatAuthResponse(user, token, refreshToken);
            }
            catch (error) {
                logger_config_1.default.error('Login error:', { error, email });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error during login', 500);
            }
        });
    },
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(refreshToken, auth_config_1.authConfig.jwt.refreshSecret);
                const user = yield prisma_1.default.user.findUnique({
                    where: { id: decoded.id }
                });
                if (!user) {
                    throw new error_types_1.AppError('Invalid refresh token', 401);
                }
                const { token, refreshToken: newRefreshToken } = this.generateTokens(user);
                return this.formatAuthResponse(user, token, newRefreshToken);
            }
            catch (error) {
                logger_config_1.default.error('Token refresh error:', { error });
                throw new error_types_1.AppError('Invalid refresh token', 401);
            }
        });
    },
    generateTokens(user) {
        if (!auth_config_1.authConfig.jwt.secret || !auth_config_1.authConfig.jwt.refreshSecret) {
            throw new error_types_1.AppError('JWT configuration missing', 500);
        }
        const options = {
            expiresIn: auth_config_1.authConfig.jwt.expiresIn
        };
        const refreshOptions = {
            expiresIn: auth_config_1.authConfig.jwt.refreshExpiresIn
        };
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, auth_config_1.authConfig.jwt.secret, options);
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, auth_config_1.authConfig.jwt.refreshSecret, refreshOptions);
        return { token, refreshToken };
    },
    formatAuthResponse(user, token, refreshToken) {
        var _a, _b;
        return {
            user: {
                id: user.id,
                email: (_a = user.email) !== null && _a !== void 0 ? _a : undefined,
                phoneNumber: (_b = user.phoneNumber) !== null && _b !== void 0 ? _b : undefined,
                name: user.name,
                role: user.role
            },
            token,
            refreshToken
        };
    },
    isPasswordStrong(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return (password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChar);
    },
    loginWithPhone(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findUnique({
                where: { phoneNumber }
            });
            if (!user) {
                throw new error_types_1.AppError('User not found', 404);
            }
            const { token, refreshToken } = this.generateTokens(user);
            return this.formatAuthResponse(user, token, refreshToken);
        });
    }
};
