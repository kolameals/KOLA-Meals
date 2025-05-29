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
const meal_routes_1 = __importDefault(require("./routes/meal.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const raw_material_routes_1 = __importDefault(require("./routes/raw-material.routes"));
const recipe_routes_1 = __importDefault(require("./routes/recipe.routes"));
const menu_routes_1 = __importDefault(require("./routes/menu.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const kitchenAnalytics_routes_1 = __importDefault(require("./routes/kitchenAnalytics.routes"));
const customerAnalytics_routes_1 = __importDefault(require("./routes/customerAnalytics.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const userManagement_routes_1 = __importDefault(require("./routes/userManagement.routes"));
const costs_1 = __importDefault(require("./routes/costs"));
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
app.use('/api/v1', routes_1.default);
app.use('/api/v1/meals', meal_routes_1.default);
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/raw-materials', raw_material_routes_1.default);
app.use('/api/v1/recipes', recipe_routes_1.default);
app.use('/api/v1/menu-calendar', menu_routes_1.default);
app.use('/api/v1/analytics', analytics_routes_1.default);
app.use('/api/v1/analytics/kitchen', kitchenAnalytics_routes_1.default);
app.use('/api/v1/analytics/customer', customerAnalytics_routes_1.default);
app.use('/api/v1/orders', order_routes_1.default);
app.use('/api/v1/inventory', inventory_routes_1.default);
app.use('/api/v1/users', userManagement_routes_1.default);
app.use('/api/v1/costs', costs_1.default);
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
