// Direct imports
import { Router } from 'express';
import { healthController } from '../controllers/healthController';

// Create and configure router
const router = Router();

// Configure routes
router.get('/', healthController.check);

// Export configured router
export { router as healthRouter }; 