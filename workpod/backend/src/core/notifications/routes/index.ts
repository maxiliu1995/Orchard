import { Router } from 'express';
import { notificationRoutes } from './notificationRoutes';

const router = Router();
router.use('/notifications', notificationRoutes);

export { router as notificationRouter }; 