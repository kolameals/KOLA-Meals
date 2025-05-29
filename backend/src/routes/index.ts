import { Router } from 'express';
import authRoutes from './auth.routes';
import mealRoutes from './meal.routes';
import subscriptionRoutes from './subscription.routes';
import deliveryRoutes from './delivery.routes';
import paymentRoutes from './payment.routes';
import feedbackRoutes from './feedback.routes';
import inventoryRoutes from './inventory.routes';
import tiffinBoxRoutes from './tiffin-box.routes';
import rawMaterialRoutes from './raw-material.routes';
import recipeRoutes from './recipe.routes';
import productionRoutes from './production.routes';
import menuRoutes from './menu.routes';
import towerRoutes from './tower.routes';

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