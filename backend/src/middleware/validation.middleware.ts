import { Request, Response, NextFunction } from 'express';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { AppError } from '../types/error.types.js';

const ajv = new Ajv.default({ allErrors: true });
addFormats.default(ajv);

interface ValidationSchema {
  body?: object;
  query?: object;
  params?: object;
}

export const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body
      if (schema.body) {
        const validateBody = ajv.compile(schema.body);
        if (!validateBody(req.body)) {
          throw new AppError('Invalid request body', 400);
        }
      }

      // Validate query
      if (schema.query) {
        const validateQuery = ajv.compile(schema.query);
        if (!validateQuery(req.query)) {
          throw new AppError('Invalid query parameters', 400);
        }
      }

      // Validate params
      if (schema.params) {
        const validateParams = ajv.compile(schema.params);
        if (!validateParams(req.params)) {
          throw new AppError('Invalid URL parameters', 400);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 