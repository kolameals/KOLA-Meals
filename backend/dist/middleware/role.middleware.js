"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const error_types_1 = require("../types/error.types");
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new error_types_1.AppError('User not authenticated', 401);
            }
            const user = req.user;
            const userRole = user.role;
            if (!allowedRoles.includes(userRole)) {
                throw new error_types_1.AppError('Access denied. Insufficient permissions.', 403);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.roleMiddleware = roleMiddleware;
