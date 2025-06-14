import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { authConfig } from '../config/auth.config.js';
import { firebaseAuthService } from '../services/firebase-auth.service.js';
import { handleGoogleAuth } from '../services/google-auth.service.js';
import { authService } from '../services/auth.service.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { AppError } from '../types/error.types.js';
import Joi from 'joi';
import logger from '../config/logger.config.js';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Configure Google Strategy
passport.use(new (GoogleStrategy as any)({
  clientID: authConfig.google.clientID!,
  clientSecret: authConfig.google.clientSecret!,
  callbackURL: authConfig.google.callbackURL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile: any, done) => {
  try {
    const user = await handleGoogleAuth({
      email: profile.emails?.[0]?.value || '',
      name: profile.displayName || '',
      picture: profile.photos?.[0]?.value || '',
      id: profile.id
    });
    return done(null, user);
  } catch (error) {
    return done(error as Error);
  }
}));

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error('Auth error:', err);
  res.status(500).json({ error: 'Internal server error' });
};

// Phone number registration
router.post('/register/phone', 
  validateRequest({
    body: {
      type: 'object',
      required: ['phoneNumber', 'name'],
      properties: {
        phoneNumber: { type: 'string', minLength: 1 },
        name: { type: 'string', minLength: 1 }
      }
    }
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phoneNumber, name } = req.body;
      const verificationCode = await firebaseAuthService.verifyPhoneNumber(phoneNumber);
      
      if (!verificationCode) {
        throw new AppError('Error sending verification code', 500);
      }

      res.status(201).json({ 
        message: 'Verification code sent successfully',
        // In production, don't send the code in response
        // This is just for testing
        code: verificationCode 
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify OTP
router.post('/verify-otp',
  validateRequest({
    body: {
      type: 'object',
      required: ['phoneNumber', 'otp', 'name'],
      properties: {
        phoneNumber: { type: 'string', minLength: 1 },
        otp: { type: 'string', minLength: 1 },
        name: { type: 'string', minLength: 1 }
      }
    }
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phoneNumber, otp, name } = req.body;
      const isValid = await firebaseAuthService.verifyCode(phoneNumber, otp);
      
      if (!isValid) {
        throw new AppError('Invalid verification code', 400);
      }

      // Generate a secure password for phone registration
      const randomNum = Math.floor(Math.random() * 1000);
      const randomStr = Math.random().toString(36).slice(-4);
      const password = `Kola${randomNum}${randomStr}!`;

      const result = await authService.register('', password, name, phoneNumber);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req: Request, res: Response) => {
    res.json(req.user);
  }
);

// Email/Password registration
router.post('/register',
  validateRequest({
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
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name, phoneNumber } = req.body;
      const result = await authService.register(email, password, name, phoneNumber);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Email/Password login
router.post('/login',
  validateRequest({
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 1 }
      }
    }
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Refresh token
router.post('/refresh-token',
  validateRequest({
    body: {
      type: 'object',
      required: ['refreshToken'],
      properties: {
        refreshToken: { type: 'string', minLength: 1 }
      }
    }
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Logout
router.post('/logout', async (req: Request, res: Response) => {
  // In a real application, you might want to blacklist the token
  // or clear any session data
  res.json({ message: 'Logged out successfully' });
});

// Phone number login
router.post('/login/phone', 
  validateRequest({
    body: {
      type: 'object',
      required: ['phoneNumber'],
      properties: {
        phoneNumber: { type: 'string', minLength: 1 }
      }
    }
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phoneNumber } = req.body;
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { phoneNumber }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const verificationCode = await firebaseAuthService.verifyPhoneNumber(phoneNumber);
      
      if (!verificationCode) {
        throw new AppError('Error sending verification code', 500);
      }

      res.status(200).json({ 
        message: 'Verification code sent successfully',
        // In production, don't send the code in response
        // This is just for testing
        code: verificationCode 
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify OTP for login
router.post('/verify-otp/login',
  validateRequest({
    body: {
      type: 'object',
      required: ['phoneNumber', 'otp'],
      properties: {
        phoneNumber: { type: 'string', minLength: 1 },
        otp: { type: 'string', minLength: 1 }
      }
    }
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phoneNumber, otp } = req.body;
      const isValid = await firebaseAuthService.verifyCode(phoneNumber, otp);
      
      if (!isValid) {
        throw new AppError('Invalid verification code', 400);
      }

      const result = await authService.loginWithPhone(phoneNumber);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Get current user
router.get('/me', authMiddleware(['ADMIN', 'CUSTOMER', 'DELIVERY_PARTNER']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      throw new AppError('User not authenticated', 401);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Apply error handling middleware
router.use(errorHandler);

export default router; 