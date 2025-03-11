import { Router } from 'express';
import { HealthController } from '../controllers/healthController';
import { healthService } from '../services/healthService';

const router = Router();
const healthController = new HealthController(healthService);

router.get('/', healthController.check.bind(healthController));
router.get('/readiness', healthController.check.bind(healthController));

export { router as healthRoutes }; 