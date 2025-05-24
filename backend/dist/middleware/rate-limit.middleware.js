"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRateLimiter = exports.loginRateLimiter = exports.createRateLimiter = void 0;
// Simple in-memory store for demonstration (not for production)
const rateLimitStore = {};
const createRateLimiter = (config) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const key = `rate-limit:${req.ip}`;
        const now = Date.now();
        const entry = rateLimitStore[key];
        if (!entry || entry.expires < now) {
            rateLimitStore[key] = { count: 1, expires: now + config.windowMs };
        }
        else {
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
    });
};
exports.createRateLimiter = createRateLimiter;
exports.loginRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many login attempts, please try again after 15 minutes.'
});
exports.apiRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: 'Too many requests, please try again later.'
});
