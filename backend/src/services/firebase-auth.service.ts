import admin from 'firebase-admin';
import { AppError } from '../types/error.types.js';
import logger from '../config/logger.config.js';

// Initialize Firebase Admin
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  }
} catch (error) {
  logger.error('Error initializing Firebase Admin:', error);
  throw new Error('Failed to initialize Firebase Admin SDK');
}

// Temporary storage for OTPs (for testing only)
const otpStore: { [key: string]: { code: string; expiresAt: Date } } = {};

export const firebaseAuthService = {
  async verifyPhoneNumber(phoneNumber: string): Promise<string> {
    try {
      // Generate a verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store the verification code with expiration
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      otpStore[phoneNumber] = {
        code: verificationCode,
        expiresAt
      };
      
      logger.info(`OTP generated for ${phoneNumber}: ${verificationCode}`);
      
      return verificationCode;
    } catch (error) {
      logger.error('Error verifying phone number:', error);
      throw new AppError('Error sending verification code', 500);
    }
  },

  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const storedData = otpStore[phoneNumber];
      
      if (!storedData) {
        throw new AppError('No verification code found for this phone number', 400);
      }
      
      if (new Date() > storedData.expiresAt) {
        delete otpStore[phoneNumber];
        throw new AppError('Verification code has expired', 400);
      }
      
      if (storedData.code !== code) {
        throw new AppError('Invalid verification code', 400);
      }
      
      // Clear the OTP after successful verification
      delete otpStore[phoneNumber];
      
      return true;
    } catch (error) {
      logger.error('Error verifying code:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error verifying code', 500);
    }
  }
}; 