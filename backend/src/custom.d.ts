import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User & {
        id: string;
        role: 'ADMIN' | 'CUSTOMER' | 'DELIVERY_PARTNER';
      };
    }
  }
} 