import { Router } from 'express';
import { userController } from '../controllers/userController';
import { validate } from '@/shared/middleware/validation';
import { updateProfileSchema } from '../validators/userValidator';

const router = Router();
router.get('/', userController.getProfile.bind(userController));
router.patch('/', validate(updateProfileSchema), userController.updateProfile.bind(userController));

export { router as profileRouter }; 