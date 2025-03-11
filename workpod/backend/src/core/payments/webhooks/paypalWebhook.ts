import { Request, Response } from 'express';
import { paypalService } from '../services/paypalService';
import { logger } from '@/shared/logger/index';

export const handlePayPalWebhook = async (req: Request, res: Response) => {
  try {
    const { event_type, resource } = req.body;
    logger.info('PayPal webhook received', { event_type });

    switch (event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await paypalService.handleSuccessfulPayment(resource);
        break;
      case 'PAYMENT.CAPTURE.DENIED':
        await paypalService.handleFailedPayment(resource);
        break;
      default:
        logger.info('Unhandled PayPal webhook event', { event_type });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('PayPal webhook error', { error });
    res.status(400).json({ error: 'Webhook handling failed' });
  }
}; 