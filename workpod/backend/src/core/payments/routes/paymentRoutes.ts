import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { PaymentService } from '../services/paymentService';
import { authMiddleware } from '@/shared/middleware/auth';
import { validate } from '@/shared/middleware/validation';
import { createPaymentSchema } from '../validators/payment.validator';

const router = Router();
const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService);

router.use(authMiddleware);

router.post('/create-intent', 
  validate(createPaymentSchema), 
  paymentController.createPaymentIntent.bind(paymentController)
);

router.post('/webhook', 
  paymentController.handleWebhook.bind(paymentController)
);

export { router as paymentRoutes }; 