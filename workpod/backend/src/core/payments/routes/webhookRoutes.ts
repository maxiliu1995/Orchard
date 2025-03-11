import express from 'express';
import { webhookController } from '../controllers/webhookController';

const router = express.Router();

// Only keep one route
router.post('/webhooks/stripe', 
  express.raw({ type: 'application/json' }), 
  webhookController.handleStripeWebhook
);

export default router; 