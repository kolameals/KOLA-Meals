"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = require("./config/swagger.config");
const rate_limit_middleware_1 = require("./middleware/rate-limit.middleware");
const request_logger_middleware_1 = require("./middleware/request-logger.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const routes_1 = __importDefault(require("./routes"));
const logger_config_1 = __importDefault(require("./config/logger.config"));
const app = (0, express_1.default)();
exports.app = app;
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Request logging
app.use(request_logger_middleware_1.requestLoggerMiddleware);
// Rate limiting
app.use('/api/', rate_limit_middleware_1.apiRateLimiter);
// Body parsing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.swaggerSpec));
// Routes
app.use('/api', routes_1.default);
// Error handling
app.use(error_middleware_1.errorHandler);
// Unhandled error logging
process.on('unhandledRejection', (error) => {
    logger_config_1.default.error('Unhandled Rejection:', error);
});
process.on('uncaughtException', (error) => {
    logger_config_1.default.error('Uncaught Exception:', error);
    process.exit(1);
});
