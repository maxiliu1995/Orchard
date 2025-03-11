import { Router } from 'express';
import { mapController } from '../controllers/mapController';
import { authMiddleware } from '@/shared/middleware/auth';

const router = Router();

router.use(authMiddleware);
router.get('/nearby', mapController.getNearbyPods);

export { router as mapRoutes };
