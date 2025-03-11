import { Router } from 'express';
import { podRouter } from './podRoutes';

// Create and configure router
const router = Router();
router.use('/', podRouter);

// Export configured router
export { router as podRouter }; 