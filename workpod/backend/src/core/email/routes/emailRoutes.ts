import { Router } from 'express';
import { EmailController } from '../controllers/emailController';

const router = Router();
const emailController = new EmailController();

router.post('/send', emailController.sendEmail);

export { router as emailRoutes };
