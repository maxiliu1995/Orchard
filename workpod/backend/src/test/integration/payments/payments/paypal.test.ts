import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { mockPayPal } from '../../../../test/mocks/services/payment/paypal.mock';
import { PayPalService } from '../../../../core/payments/services/paypalService';

jest.mock('@paypal/checkout-server-sdk', () => ({
  core: {
    PayPalHttpClient: jest.fn().mockImplementation(() => mockPayPal)
  }
}));

describe('PayPal Service', () => {
  let paypalService: PayPalService;

  beforeEach(() => {
    jest.clearAllMocks();
    paypalService = new PayPalService();
  });

  describe('Order Creation', () => {
    const paymentData = {
      amount: 25.00,
      currency: 'USD'
    };

    it('should create a PayPal order successfully', async () => {
      const result = await paypalService.createOrder(paymentData);
      
      expect(mockPayPal.orders.create).toHaveBeenCalledWith({
        purchase_units: [{
          amount: {
            value: '25.00',
            currency_code: 'USD'
          }
        }]
      });
      expect(result).toBeDefined();
      expect(result.id).toBe('order_mock_123');
    });

    it('should handle order creation failure', async () => {
      (mockPayPal.orders.create as jest.MockedFunction<typeof mockPayPal.orders.create>)
        .mockRejectedValueOnce(new Error('PayPal API Error'));
      
      await expect(paypalService.createOrder(paymentData))
        .rejects
        .toThrow('Failed to create PayPal order');
    });
  });

  describe('Payment Processing', () => {
    it('should create and process a payment', async () => {
      const orderId = 'test_order_123';
      const result = await paypalService.processPayment(orderId);
      
      expect(mockPayPal.orders.capture).toHaveBeenCalledWith(orderId);
      expect(result).toBeDefined();
      expect(result.status).toBe('COMPLETED');
    });

    it('should handle payment processing failure', async () => {
      const orderId = 'test_order_123';
      (mockPayPal.orders.capture.mockRejectedValue as unknown as (error: Error) => void)(new Error('Capture failed'));

      await expect(paypalService.processPayment(orderId))
        .rejects
        .toThrow('Failed to process PayPal payment');
    });
  });

  describe('Webhook Handling', () => {
    it('should handle payment completed webhook', async () => {
      const webhookEvent = {
        event_type: 'PAYMENT.CAPTURE.COMPLETED',
        resource: {
          id: 'test_order_123',
          status: 'COMPLETED'
        }
      };

      const result = await paypalService.handleWebhook(webhookEvent);
      expect(result).toEqual({
        status: 'success',
        orderId: 'test_order_123'
      });
    });

    it('should handle payment denied webhook', async () => {
      const webhookEvent = {
        event_type: 'PAYMENT.CAPTURE.DENIED',
        resource: {
          id: 'test_order_123',
          status: 'DENIED'
        }
      };

      const result = await paypalService.handleWebhook(webhookEvent);
      expect(result).toEqual({
        status: 'failed',
        orderId: 'test_order_123'
      });
    });
  });

  describe('Refunds', () => {
    it('should process a full refund', async () => {
      const orderId = 'test_order_123';
      const result = await paypalService.createRefund(orderId);
      
      expect(mockPayPal.refunds.create).toHaveBeenCalledWith(orderId, undefined);
      expect(result.status).toBe('COMPLETED');
    });

    it('should process a partial refund', async () => {
      const orderId = 'test_order_123';
      const partialAmount = 10.00;
      const result = await paypalService.createRefund(orderId, partialAmount);
      
      expect(mockPayPal.refunds.create).toHaveBeenCalledWith(orderId, partialAmount);
      expect(result.status).toBe('COMPLETED');
      expect(result.amount.value).toBe('10.00');
    });

    it('should handle refund failure', async () => {
      const orderId = 'test_order_123';
      (mockPayPal.refunds.create.mockRejectedValueOnce as unknown as (error: Error) => void)(new Error('Refund failed'));

      await expect(paypalService.createRefund(orderId))
        .rejects
        .toThrow('Failed to create PayPal refund');
    });
  });
});
