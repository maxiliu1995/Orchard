// Direct imports
import { Router } from 'express';
import { bookingRouter } from './bookingRoutes';

// Create and configure router
const router = Router();
router.use('/', bookingRouter);

// Export configured router
export { router as bookingRouter }; 