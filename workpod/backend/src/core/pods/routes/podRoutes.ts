import { Router } from 'express';
import { podController } from '../controllers/podController';
import { authMiddleware } from '@/shared/middleware/auth';

const router = Router();

router.use(authMiddleware);

// Pod availability routes
router.get('/:id/availability', podController.checkAvailability);
router.get('/:id/slots', podController.getAvailableSlots);

// Pod search routes
router.get('/search', podController.findNearbyPods);
router.get('/available', podController.getAvailablePods);

// General pod routes
router.get('/', podController.getAllPods);
router.get('/:id', podController.getPodById);

export { router as podRouter }; 