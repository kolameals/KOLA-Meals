import { Router } from 'express';
import authRoutes from './auth.routes.js';
import mealRoutes from './meal.routes.js';
import subscriptionRoutes from './subscription.routes.js';
import deliveryRoutes from './delivery.routes.js';
import paymentRoutes from './payment.routes.js';
import feedbackRoutes from './feedback.routes.js';
import inventoryRoutes from './inventory.routes.js';
import tiffinBoxRoutes from './tiffin-box.routes.js';
import rawMaterialRoutes from './raw-material.routes.js';
import recipeRoutes from './recipe.routes.js';
import productionRoutes from './production.routes.js';
import menuRoutes from './menu.routes.js';
import towerRoutes from './tower.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/meals', mealRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/payments', paymentRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/tiffin-boxes', tiffinBoxRoutes);
router.use('/raw-materials', rawMaterialRoutes);
router.use('/recipes', recipeRoutes);
router.use('/production-schedules', productionRoutes);
router.use('/menu', menuRoutes);
router.use('/towers', towerRoutes);

export default router; 