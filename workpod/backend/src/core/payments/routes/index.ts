// Direct imports
import { Router } from 'express';
import { paymentRoutes } from './paymentRoutes';
import webhookRouter from './webhookRoutes';

// Create and configure router
const router = Router();
router.use('/payments', paymentRoutes);
router.use('/webhooks', webhookRouter);

// Export configured router
export { router as paymentRouter }; 