import { Request, Response } from 'express';
import { logger } from '@/shared/logger/index';
import { BookingService } from '@/core/bookings/services/bookingService';
import { BookingStatus } from '@prisma/client';
import { WebhookError } from '@/shared/errors/webhookError';
import { paymentService } from '../services/paymentService';

class WebhookController {
  async handleStripeWebhook(req: Request, res: Response) {
    const event = req.body;
    await paymentService.handleStripeWebhook(event);
    res.json({ received: true });
  }

  handlePaypalWebhook() { }
}

export const webhookController = new WebhookController(); 