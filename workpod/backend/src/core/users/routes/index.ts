import { Router } from 'express';
import { userController } from '../controllers/userController';
import { validate } from '@/shared/middleware/validation';
import { updateProfileSchema } from '../validators/userValidator';
import { authMiddleware } from '@/shared/middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Profile routes
router.get('/profile', userController.getProfile.bind(userController));
router.patch('/profile', validate(updateProfileSchema), userController.updateProfile.bind(userController));

// Settings routes can be added here
// router.get('/settings', ...);

export { router as userRouter }; 