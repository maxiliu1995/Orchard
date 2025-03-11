import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/paymentService';
import { logger } from '@/shared/logger/index';
import { AuthenticatedRequest } from '@/shared/types/express';

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  async createPaymentIntent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { bookingId, amount, currency } = req.body;
      const paymentIntent = await this.paymentService.createPaymentIntent({
        bookingId,
        amount,
        currency,
        userId: req.user.id
      });
      res.json(paymentIntent);
    } catch (error) {
      logger.error('Create payment intent failed', { error });
      next(error);
    }
  }

  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const event = req.body;
      await this.paymentService.handleWebhookEvent(event);
      res.json({ received: true });
    } catch (error) {
      logger.error('Webhook handling failed', { error });
      next(error);
    }
  }
}

// Export singleton instance
export const paymentController = new PaymentController(new PaymentService());