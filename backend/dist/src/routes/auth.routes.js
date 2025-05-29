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
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const auth_config_1 = require("../config/auth.config");
const firebase_auth_service_1 = require("../services/firebase-auth.service");
const google_auth_service_1 = require("../services/google-auth.service");
const auth_service_1 = require("../services/auth.service");
const validation_middleware_1 = require("../middleware/validation.middleware");
const error_types_1 = require("../types/error.types");
const logger_config_1 = __importDefault(require("../config/logger.config"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Configure Google Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: auth_config_1.authConfig.google.clientID,
    clientSecret: auth_config_1.authConfig.google.clientSecret,
    callbackURL: auth_config_1.authConfig.google.callbackURL
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const result = yield (0, google_auth_service_1.handleGoogleAuth)({
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            picture: (_b = (_a = profile.photos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value
        });
        return done(null, result);
    }
    catch (error) {
        logger_config_1.default.error('Google auth error:', { error, profile });
        return done(error);
    }
})));
// Error handling middleware
const errorHandler = (err, req, res, next) => {
    if (err instanceof error_types_1.AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Internal server error' });
};
// Phone number registration
router.post('/register/phone', (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        required: ['phoneNumber', 'name'],
        properties: {
            phoneNumber: { type: 'string', minLength: 1 },
            name: { type: 'string', minLength: 1 }
        }
    }
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, name } = req.body;
        const verificationCode = yield firebase_auth_service_1.firebaseAuthService.verifyPhoneNumber(phoneNumber);
        if (!verificationCode) {
            throw new error_types_1.AppError('Error sending verification code', 500);
        }
        res.status(201).json({
            message: 'Verification code sent successfully',
            // In production, don't send the code in response
            // This is just for testing
            code: verificationCode
        });
    }
    catch (error) {
        next(error);
    }
}));
// Verify OTP
router.post('/verify-otp', (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        required: ['phoneNumber', 'otp', 'name'],
        properties: {
            phoneNumber: { type: 'string', minLength: 1 },
            otp: { type: 'string', minLength: 1 },
            name: { type: 'string', minLength: 1 }
        }
    }
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, otp, name } = req.body;
        const isValid = yield firebase_auth_service_1.firebaseAuthService.verifyCode(phoneNumber, otp);
        if (!isValid) {
            throw new error_types_1.AppError('Invalid verification code', 400);
        }
        // Generate a secure password for phone registration
        const randomNum = Math.floor(Math.random() * 1000);
        const randomStr = Math.random().toString(36).slice(-4);
        const password = `Kola${randomNum}${randomStr}!`;
        const result = yield auth_service_1.authService.register('', password, name, phoneNumber);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}));
// Google OAuth routes
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), (req, res) => {
    res.json(req.user);
});
// Email/Password registration
router.post('/register', (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        required: ['name', 'email', 'password', 'phoneNumber'],
        properties: {
            name: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            phoneNumber: { type: 'string', minLength: 1 }
        }
    }
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, phoneNumber } = req.body;
        const result = yield auth_service_1.authService.register(email, password, name, phoneNumber);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
}));
// Email/Password login
router.post('/login', (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 1 }
        }
    }
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield auth_service_1.authService.login(email, password);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}));
// Refresh token
router.post('/refresh-token', (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
            refreshToken: { type: 'string', minLength: 1 }
        }
    }
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        const result = yield auth_service_1.authService.refreshToken(refreshToken);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}));
// Logout
router.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // In a real application, you might want to blacklist the token
    // or clear any session data
    res.json({ message: 'Logged out successfully' });
}));
// Phone number login
router.post('/login/phone', (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        required: ['phoneNumber'],
        properties: {
            phoneNumber: { type: 'string', minLength: 1 }
        }
    }
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber } = req.body;
        // Check if user exists
        const user = yield prisma_1.default.user.findUnique({
            where: { phoneNumber }
        });
        if (!user) {
            throw new error_types_1.AppError('User not found', 404);
        }
        const verificationCode = yield firebase_auth_service_1.firebaseAuthService.verifyPhoneNumber(phoneNumber);
        if (!verificationCode) {
            throw new error_types_1.AppError('Error sending verification code', 500);
        }
        res.status(200).json({
            message: 'Verification code sent successfully',
            // In production, don't send the code in response
            // This is just for testing
            code: verificationCode
        });
    }
    catch (error) {
        next(error);
    }
}));
// Verify OTP for login
router.post('/verify-otp/login', (0, validation_middleware_1.validateRequest)({
    body: {
        type: 'object',
        required: ['phoneNumber', 'otp'],
        properties: {
            phoneNumber: { type: 'string', minLength: 1 },
            otp: { type: 'string', minLength: 1 }
        }
    }
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, otp } = req.body;
        const isValid = yield firebase_auth_service_1.firebaseAuthService.verifyCode(phoneNumber, otp);
        if (!isValid) {
            throw new error_types_1.AppError('Invalid verification code', 400);
        }
        const result = yield auth_service_1.authService.loginWithPhone(phoneNumber);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}));
// Get current user
router.get('/me', (0, auth_middleware_1.authMiddleware)(['ADMIN', 'CUSTOMER', 'DELIVERY_PARTNER']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            throw new error_types_1.AppError('User not authenticated', 401);
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
}));
// Apply error handling middleware
router.use(errorHandler);
exports.default = router;
