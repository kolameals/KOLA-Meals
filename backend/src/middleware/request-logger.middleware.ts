import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requestLogger } from '../config/logger.config';

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Generate request ID if not present
  if (!req.headers['x-request-id']) {
    req.headers['x-request-id'] = uuidv4();
  }

  const logger = requestLogger(req);
  const start = Date.now();

  // Log request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
}; 