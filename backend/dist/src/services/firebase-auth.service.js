"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAuthService = void 0;
const admin = __importStar(require("firebase-admin"));
const error_types_1 = require("../types/error.types");
const logger_config_1 = __importDefault(require("../config/logger.config"));
// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n')
        })
    });
}
// Temporary storage for OTPs (for testing only)
const otpStore = {};
exports.firebaseAuthService = {
    verifyPhoneNumber(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Generate a verification code
                const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                // Store the verification code with expiration
                const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
                otpStore[phoneNumber] = {
                    code: verificationCode,
                    expiresAt
                };
                logger_config_1.default.info(`OTP generated for ${phoneNumber}: ${verificationCode}`);
                return verificationCode;
            }
            catch (error) {
                logger_config_1.default.error('Error verifying phone number:', error);
                throw new error_types_1.AppError('Error sending verification code', 500);
            }
        });
    },
    verifyCode(phoneNumber, code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storedData = otpStore[phoneNumber];
                if (!storedData) {
                    throw new error_types_1.AppError('No verification code found for this phone number', 400);
                }
                if (new Date() > storedData.expiresAt) {
                    delete otpStore[phoneNumber];
                    throw new error_types_1.AppError('Verification code has expired', 400);
                }
                if (storedData.code !== code) {
                    throw new error_types_1.AppError('Invalid verification code', 400);
                }
                // Clear the OTP after successful verification
                delete otpStore[phoneNumber];
                return true;
            }
            catch (error) {
                logger_config_1.default.error('Error verifying code:', error);
                if (error instanceof error_types_1.AppError) {
                    throw error;
                }
                throw new error_types_1.AppError('Error verifying code', 500);
            }
        });
    }
};
