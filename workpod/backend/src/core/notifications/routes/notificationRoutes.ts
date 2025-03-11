import { Router } from 'express';
import { notificationController } from '../controllers';

const router = Router();

router.post('/send', notificationController.sendNotification);

export { router as notificationRoutes }; 