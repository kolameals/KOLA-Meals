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
import userRoutes from './routes/user.routes';
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

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Request logging
app.use(requestLoggerMiddleware);

// Rate limiting
app.use('/api/', apiRateLimiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', apiRouter);
app.use('/api/users', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/menu-calendar', menuRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/analytics/kitchen', kitchenAnalyticsRoutes);
app.use('/api/analytics/customer', customerAnalyticsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

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