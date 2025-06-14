import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';
import { apiRateLimiter } from './middleware/rate-limit.middleware';
import { requestLoggerMiddleware } from './middleware/request-logger.middleware';
import { errorHandler } from './middleware/error.middleware';
import apiRouter from './routes';
import logger from './config/logger.config';
import mealRoutes from './routes/meal.routes';
import authRoutes from './routes/auth.routes';
import rawMaterialRoutes from './routes/raw-material.routes';
import recipeRoutes from './routes/recipe.routes';
import menuRoutes from './routes/menu.routes';
import analyticsRoutes from './routes/analytics.routes';
import kitchenAnalyticsRoutes from './routes/kitchenAnalytics.routes';
import customerAnalyticsRoutes from './routes/customerAnalytics.routes';
import orderRoutes from './routes/order.routes';
import inventoryRoutes from './routes/inventory.routes';
import userManagementRoutes from './routes/userManagement.routes';
import costRoutes from './routes/costs';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Request logging
app.use(requestLoggerMiddleware);

// Rate limiting
// app.use('/api/', apiRateLimiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1', apiRouter);
app.use('/api/v1/meals', mealRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/raw-materials', rawMaterialRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/menu-calendar', menuRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/analytics/kitchen', kitchenAnalyticsRoutes);
app.use('/api/v1/analytics/customer', customerAnalyticsRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/users', userManagementRoutes);
app.use('/api/v1/costs', costRoutes);

// Error handling
app.use(errorHandler);

// Unhandled error logging
process.on('unhandledRejection', (error: Error) => {
  logger.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

export { app }; 