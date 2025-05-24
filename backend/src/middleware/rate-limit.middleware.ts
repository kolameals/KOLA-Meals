import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

// Simple in-memory store for demonstration (not for production)
const rateLimitStore: Record<string, { count: number; expires: number }> = {};

export const createRateLimiter = (config: RateLimitConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `rate-limit:${req.ip}`;
    const now = Date.now();
    const entry = rateLimitStore[key];

    if (!entry || entry.expires < now) {
      rateLimitStore[key] = { count: 1, expires: now + config.windowMs };
    } else {
      rateLimitStore[key].count++;
    }

    const current = rateLimitStore[key].count;
    const remaining = Math.max(0, config.max - current);
    res.setHeader('X-RateLimit-Limit', config.max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimitStore[key].expires / 1000));

    if (current > config.max) {
      return res.status(429).json({
        error: config.message || 'Too many requests, please try again later.'
      });
    }

    next();
  };
};

export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts, please try again after 15 minutes.'
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: 'Too many requests, please try again later.'
}); 