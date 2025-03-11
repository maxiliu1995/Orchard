import { Router } from 'express';
import { AccessController } from '../controllers/accessController';
import { validate } from '@/shared/middleware/validation';
import { accessLogSchema } from '../validators/access.validator';
import { accessHistoryService } from '../services/accessHistoryService';

export const accessRouter = Router();
const controller = new AccessController(accessHistoryService);

accessRouter.post('/log', validate(accessLogSchema), controller.logAccess);
accessRouter.get('/:userId/history', controller.getAccessHistory); 