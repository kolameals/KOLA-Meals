import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

interface AuthConfig {
  jwt: {
    secret: string;
    refreshSecret: string;
    expiresIn: string | number;
    refreshExpiresIn: string | number;
  };
  google: {
    clientID?: string;
    clientSecret?: string;
    callbackURL: string;
  };
  security: {
    bcryptRounds: number;
    tokenExpiration: {
      access: string;
      refresh: string;
    };
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
}

export const authConfig: AuthConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
  },
  security: {
    bcryptRounds: 12,
    tokenExpiration: {
      access: '15m',
      refresh: '7d'
    },
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes in milliseconds
  }
}; 