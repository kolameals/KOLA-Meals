"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_types_1 = require("../types/error.types");
const logger_config_1 = __importDefault(require("../config/logger.config"));
const errorHandler = (err, req, res, next) => {
    const requestId = req.headers['x-request-id'] || 'unknown';
    // Log the error
    logger_config_1.default.error('Error occurred:', {
        requestId,
        error: err,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params
    });
    // Handle known errors
    if (err instanceof error_types_1.AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            requestId
        });
    }
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token',
            requestId
        });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
            requestId
        });
    }
    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: err.message,
            requestId
        });
    }
    // Handle Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        return res.status(400).json({
            error: 'Database error',
            requestId
        });
    }
    // Handle unknown errors
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;
    res.status(statusCode).json({
        error: message,
        requestId
    });
};
exports.errorHandler = errorHandler;
