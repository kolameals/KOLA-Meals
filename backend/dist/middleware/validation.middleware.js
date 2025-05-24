"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const error_types_1 = require("../types/error.types");
const ajv = new ajv_1.default({ allErrors: true });
(0, ajv_formats_1.default)(ajv);
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            // Validate body
            if (schema.body) {
                const validateBody = ajv.compile(schema.body);
                if (!validateBody(req.body)) {
                    throw new error_types_1.AppError('Invalid request body', 400);
                }
            }
            // Validate query
            if (schema.query) {
                const validateQuery = ajv.compile(schema.query);
                if (!validateQuery(req.query)) {
                    throw new error_types_1.AppError('Invalid query parameters', 400);
                }
            }
            // Validate params
            if (schema.params) {
                const validateParams = ajv.compile(schema.params);
                if (!validateParams(req.params)) {
                    throw new error_types_1.AppError('Invalid URL parameters', 400);
                }
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
