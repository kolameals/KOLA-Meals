import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import { AppError } from '../types/error.types';
import logger from '../config/logger.config';
import prisma from '../lib/prisma';

type UserWithLock = {
  id: string;
  email: string;
  phoneNumber: string;
  password: string;
  name: string;
  role: string;
};

interface AuthResponse {
  user: {
    id: string;
    email?: string;
    phoneNumber?: string;
    name: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

export const authService = {
  async register(email: string, password: string, name: string, phoneNumber: string): Promise<AuthResponse> {
    try {
      // Validate password complexity
      if (!this.isPasswordStrong(password)) {
        throw new AppError(
          'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character',
          400
        );
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { phoneNumber }
          ]
        }
      });

      if (existingUser) {
        throw new AppError('User with this email or phone number already exists', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
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
    } catch (error) {
      logger.error('Registration error:', { error, email });
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating user', 500);
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user || !user.password) {
        throw new AppError('Invalid credentials', 401);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
      }

      const { token, refreshToken } = this.generateTokens(user);
      return this.formatAuthResponse(user, token, refreshToken);
    } catch (error) {
      logger.error('Login error:', { error, email });
      if (error instanceof AppError) throw error;
      throw new AppError('Error during login', 500);
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(refreshToken, authConfig.jwt.refreshSecret) as { id: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user) {
        throw new AppError('Invalid refresh token', 401);
      }

      const { token, refreshToken: newRefreshToken } = this.generateTokens(user);
      return this.formatAuthResponse(user, token, newRefreshToken);
    } catch (error) {
      logger.error('Token refresh error:', { error });
      throw new AppError('Invalid refresh token', 401);
    }
  },

  generateTokens(user: UserWithLock): { token: string; refreshToken: string } {
    if (!authConfig.jwt.secret || !authConfig.jwt.refreshSecret) {
      throw new AppError('JWT configuration missing', 500);
    }

    const options: SignOptions = {
      expiresIn: authConfig.jwt.expiresIn as any
    };

    const refreshOptions: SignOptions = {
      expiresIn: authConfig.jwt.refreshExpiresIn as any
    };

    const token = jwt.sign(
      { id: user.id, role: user.role },
      authConfig.jwt.secret,
      options
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      authConfig.jwt.refreshSecret,
      refreshOptions
    );

    return { token, refreshToken };
  },

  formatAuthResponse(
    user: UserWithLock,
    token: string,
    refreshToken: string
  ): AuthResponse {
    return {
      user: {
        id: user.id,
        email: user.email ?? undefined,
        phoneNumber: user.phoneNumber ?? undefined,
        name: user.name,
        role: user.role
      },
      token,
      refreshToken
    };
  },

  isPasswordStrong(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  },

  async loginWithPhone(phoneNumber: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { phoneNumber }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { token, refreshToken } = this.generateTokens(user);
    return this.formatAuthResponse(user, token, refreshToken);
  }
}; 