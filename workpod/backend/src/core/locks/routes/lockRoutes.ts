import { Router } from 'express';
import { LockController } from '../controllers/lockController';
import { validate } from '@/shared/middleware/validation';
import { authMiddleware } from '@/shared/middleware/auth';
import { accessLogSchema } from '@/core/access/validators/access.validator';

const router = Router();

router.use(authMiddleware);

// Lock operations
router.get('/', LockController.getLocks);
router.post('/unlock', LockController.unlock);
router.post('/lock', LockController.lock);

// Access code operations
router.post('/codes/generate', LockController.generateAccessCode);
router.post('/codes/verify', LockController.verifyCode);
router.delete('/codes/:code', LockController.revokeAccess);

// Access log operations
router.post('/access/log', validate(accessLogSchema), LockController.logAccess);
router.get('/access/:userId/history', LockController.getAccessHistory);

export { router as lockRouter }; 