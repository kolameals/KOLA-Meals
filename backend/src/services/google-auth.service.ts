import { AppError } from '../types/error.types.js';
import prisma from '../lib/prisma.js';
import { authConfig } from '../config/auth.config.js';
import jwt, { SignOptions } from 'jsonwebtoken';
import logger from '../config/logger.config.js';

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export const handleGoogleAuth = async (profile: GoogleUser) => {
  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: profile.email }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
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
  } catch (error) {
    logger.error('Error in Google auth:', { error, profile });
    throw new AppError('Error during Google authentication', 500);
  }
};

function generateTokens(user: { id: string }) {
  if (!authConfig.jwt.secret || !authConfig.jwt.refreshSecret) {
    throw new AppError('JWT configuration missing', 500);
  }

  const options: SignOptions = {
    expiresIn: authConfig.jwt.expiresIn as SignOptions['expiresIn']
  };

  const refreshOptions: SignOptions = {
    expiresIn: authConfig.jwt.refreshExpiresIn as SignOptions['expiresIn']
  };

  const token = jwt.sign(
    { id: user.id },
    authConfig.jwt.secret,
    options
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    authConfig.jwt.refreshSecret,
    refreshOptions
  );

  return { token, refreshToken };
} 