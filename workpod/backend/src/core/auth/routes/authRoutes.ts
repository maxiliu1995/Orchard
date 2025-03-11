import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthService } from '../services/authService';
import { validate } from '@/shared/middleware/validation';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { authMiddleware } from '@/shared/middleware/auth';

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

// Register new user
router.post('/register', validate(registerSchema), authController.register.bind(authController));

// Login user
router.post('/login', validate(loginSchema), authController.login.bind(authController));

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser.bind(authController));

// Refresh token
router.post('/refresh-token', authController.refreshToken.bind(authController));

export { router as authRoutes };