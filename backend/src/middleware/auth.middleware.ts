import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config.js';
import { AppError } from '../types/error.types.js';
import prisma from '../lib/prisma.js';
import { AuthenticatedUser } from '../types/index.js';

type Role = 'ADMIN' | 'CUSTOMER' | 'DELIVERY_PARTNER';

interface JwtPayload {
  id: string;
  role: Role;
}

export const authMiddleware = (allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, authConfig.jwt.secret) as JwtPayload;

      const user = await prisma.user.findUnique({
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
      if (!allowedRoles.includes(user.role as Role)) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }

      req.user = user as AuthenticatedUser;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}; 