"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateUser = exports.validateCreateUser = void 0;
const user_types_1 = require("../types/user.types");
const validateCreateUser = (data) => {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        return 'Name is required';
    }
    if (data.email && typeof data.email !== 'string') {
        return 'Email must be a string';
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return 'Invalid email format';
    }
    if (data.phoneNumber && typeof data.phoneNumber !== 'string') {
        return 'Phone number must be a string';
    }
    if (data.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(data.phoneNumber)) {
        return 'Invalid phone number format';
    }
    if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    if (!data.role || !Object.values(user_types_1.UserRole).includes(data.role)) {
        return 'Invalid role';
    }
    return null;
};
exports.validateCreateUser = validateCreateUser;
const validateUpdateUser = (data) => {
    if (data.name && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
        return 'Name must be a non-empty string';
    }
    if (data.email !== undefined && typeof data.email !== 'string') {
        return 'Email must be a string';
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return 'Invalid email format';
    }
    if (data.phoneNumber !== undefined && typeof data.phoneNumber !== 'string') {
        return 'Phone number must be a string';
    }
    if (data.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(data.phoneNumber)) {
        return 'Invalid phone number format';
    }
    if (data.password && (typeof data.password !== 'string' || data.password.length < 6)) {
        return 'Password must be at least 6 characters long';
    }
    if (data.role && !Object.values(user_types_1.UserRole).includes(data.role)) {
        return 'Invalid role';
    }
    return null;
};
exports.validateUpdateUser = validateUpdateUser;
