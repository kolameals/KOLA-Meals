import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/error.types';

type Role = 'ADMIN' | 'CUSTOMER' | 'DELIVERY_PARTNER';

export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const user = req.user as { id: string; role: Role };
      const userRole = user.role;
      if (!allowedRoles.includes(userRole)) {
        throw new AppError('Access denied. Insufficient permissions.', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 