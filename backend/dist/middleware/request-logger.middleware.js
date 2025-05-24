"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLoggerMiddleware = void 0;
const uuid_1 = require("uuid");
const logger_config_1 = require("../config/logger.config");
const requestLoggerMiddleware = (req, res, next) => {
    // Generate request ID if not present
    if (!req.headers['x-request-id']) {
        req.headers['x-request-id'] = (0, uuid_1.v4)();
    }
    const logger = (0, logger_config_1.requestLogger)(req);
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
exports.requestLoggerMiddleware = requestLoggerMiddleware;
