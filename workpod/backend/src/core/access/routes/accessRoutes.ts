import { Router } from 'express';
import { accessController } from '../controllers/accessController';
import { authMiddleware } from '@/shared/middleware/auth';

const router = Router();

router.use(authMiddleware);

// Permission layer
router.post('/:bookingId/validate', accessController.validateAccess);
router.get('/:userId/history', accessController.getAccessHistory);

export { router as accessRouter }; 