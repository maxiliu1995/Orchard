import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { mockStripe } from '../../../../test/mocks/services/payment/stripe.mock';
import type { Stripe } from 'stripe';
import { StripeService } from '../../../../core/payments/services/stripeService';
import { CreatePaymentIntentDto, PaymentMethod } from '../../../../core/payments/types/payment.types';

jest.mock('stripe', () => {
  return jest.fn(() => mockStripe);
});

// Update the helper function to handle Stripe responses correctly
const createMockResponse = <T>(data: T): Stripe.Response<T> => ({
  ...(data as T),
  lastResponse: {
    headers: {},
    requestId: 'req_mock',
    statusCode: 200,
  }
});

// Update type definitions
type StripeFunction = (...args: any[]) => Promise<Stripe.Response<any>>;

type StripeMock = jest.Mocked<Stripe>;

describe('Stripe Service', () => {
  let stripeService: StripeService;

  const mockPaymentIntent = {
    id: 'pi_test',
    client_secret: 'secret_123',
    status: 'succeeded',
    customer: null,
    invoice: null,
    application_fee_amount: null,
    automatic_payment_methods: null,
    review: null,
    transfer_data: null,
    transfer_group: null,
    amount: 2500,
    currency: 'usd',
    confirmation_method: 'automatic',
    created: Date.now(),
    livemode: false,
    object: 'payment_intent',
    payment_method_types: ['card'],
    amount_capturable: 0,
    amount_received: 0,
    capture_method: 'automatic',
    application: null,
    canceled_at: null,
    cancellation_reason: null,
    description: null,
    last_payment_error: null,
    next_action: null,
    payment_method: null,
    setup_future_usage: null
  } as Stripe.PaymentIntent;

  beforeEach(() => {
    jest.clearAllMocks();
    stripeService = new StripeService(mockStripe);

    const mockRefund = {
      id: 'ref_123',
      object: 'refund',
      amount: 1000,
      status: 'succeeded',
      created: Date.now(),
      currency: 'usd',
      payment_intent: 'pi_test_123',
      balance_transaction: 'txn_123',
      charge: 'ch_123',
      metadata: {},
      reason: null,
      receipt_number: null,
      source_transfer_reversal: null,
      transfer_reversal: null
    } as unknown as Stripe.Refund;

    // Use proper type casting
    (mockStripe.paymentIntents.create as jest.MockedFunction<typeof mockStripe.paymentIntents.create>)
      .mockImplementation((params) => Promise.resolve(createMockResponse(mockPaymentIntent)));

    (mockStripe.paymentIntents.capture as jest.MockedFunction<typeof mockStripe.paymentIntents.capture>)
      .mockResolvedValue(createMockResponse(mockPaymentIntent));

    (mockStripe.paymentIntents.confirm as jest.MockedFunction<typeof mockStripe.paymentIntents.confirm>)
      .mockResolvedValue(createMockResponse(mockPaymentIntent));

    (mockStripe.refunds.create as jest.MockedFunction<typeof mockStripe.refunds.create>)
      .mockImplementation((params) => Promise.resolve(createMockResponse(mockRefund)));
  });

  describe('Payment Intent Creation', () => {
    it('should create a payment intent successfully', async () => {
      const paymentData: CreatePaymentIntentDto = {
        amount: 1000,
        currency: 'usd',
        bookingId: 'booking_123',
        paymentMethod: PaymentMethod.CARD
      };

      const result = await stripeService.createPaymentIntent(
        {
          amount: 1000,
          currency: 'usd',
          bookingId: 'booking_123',
          paymentMethod: PaymentMethod.CARD
        },
        {
          confirm: true,
          amount: 1000,
          currency: 'usd'
        }
      );

      expect(result).toBeDefined();
      expect(result.id).toBe(mockPaymentIntent.id);
      expect(result.status).toBe('succeeded');
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: paymentData.amount,
        currency: paymentData.currency,
        metadata: { bookingId: paymentData.bookingId },
        confirm: true
      });
    });

    it('should handle stripe errors when creating payment intent', async () => {
      const paymentData: CreatePaymentIntentDto = {
        amount: 1000,
        currency: 'usd',
        bookingId: 'booking_123',
        paymentMethod: PaymentMethod.CARD
      };

      const options: Stripe.PaymentIntentCreateParams = {
        confirm: true,
        amount: paymentData.amount,
        currency: paymentData.currency
      };

      jest.spyOn(mockStripe.paymentIntents, 'create')
        .mockReturnValue(Promise.reject(new Error('Stripe error')));

      await expect(stripeService.createPaymentIntent(paymentData, options))
        .rejects
        .toThrow('Stripe error');
    });
  });

  describe('Payment Capture', () => {
    it('should capture payment successfully', async () => {
      const result = await stripeService.capturePayment('pi_mock_123');
      
      expect(mockStripe.paymentIntents.capture).toHaveBeenCalledWith(
        'pi_mock_123'
      );
      expect(result.status).toBe('succeeded');
    });
  });

  describe('Apple Pay', () => {
    it('should process Apple Pay payment', async () => {
      const paymentIntentId = 'pi_mock_123';
      const token = 'apple_pay_token';

      jest.spyOn(mockStripe.paymentIntents, 'confirm')
        .mockReturnValue(Promise.resolve(createMockResponse({} as Stripe.PaymentIntent)));

      const result = await stripeService.handleApplePay(paymentIntentId, token);

      expect(mockStripe.paymentIntents.confirm).toHaveBeenCalledWith(
        paymentIntentId,
        {
          payment_method: token
        }
      );
      expect(result).toBeDefined();
    });

    it('should handle Apple Pay failure', async () => {
      jest.spyOn(mockStripe.paymentIntents, 'confirm')
        .mockReturnValue(Promise.reject(new Error('Apple Pay failed')));
      
      await expect(
        stripeService.handleApplePay('pi_mock_123', 'token')
      ).rejects.toThrow('Failed to process Apple Pay payment');
    });
  });

  describe('Payment Confirmation', () => {
    it('should confirm payment successfully', async () => {
      const paymentIntentId = 'pi_123';
      const mockConfirmedIntent = {
        id: paymentIntentId,
        object: 'payment_intent',
        amount: 1000,
        currency: 'usd',
        status: 'succeeded',
        created: Date.now(),
        livemode: false,
        payment_method_types: ['card'],
        amount_capturable: 0,
        amount_received: 0,
        capture_method: 'automatic',
        confirmation_method: 'automatic',
        client_secret: 'secret_123',
      } as Stripe.PaymentIntent;

      // Update the mock casting
      (mockStripe.paymentIntents.confirm as jest.MockedFunction<typeof mockStripe.paymentIntents.confirm>)
        .mockResolvedValue(createMockResponse(mockConfirmedIntent));

      const result = await stripeService.confirmPayment(paymentIntentId, 'payment_method_id');
      expect(result).toBeDefined();
    });

    it('should handle stripe errors when confirming payment', async () => {
      const paymentIntentId = 'pi_123';

      jest.spyOn(mockStripe.paymentIntents, 'confirm')
        .mockReturnValue(Promise.reject(new Error('Confirmation failed')));

      await expect(stripeService.confirmPayment(paymentIntentId, 'payment_method_id'))
        .rejects
        .toThrow('Confirmation failed');
    });

    it('should confirm payment', async () => {
      const paymentIntentId = 'pi_mock_123';
      const paymentMethodId = 'pm_mock_123';
      
      const result = await stripeService.confirmPayment(paymentIntentId, paymentMethodId);
      expect(result).toBeDefined();
    });
  });

  describe('Refunds', () => {
    it('should process partial refund', async () => {
      const paymentIntentId = 'pi_mock_123';
      const amount = 1000; // Amount in cents
      
      const result = await stripeService.createRefund(paymentIntentId);
      
      expect(mockStripe.refunds.create).toHaveBeenCalledWith({
        payment_intent: paymentIntentId,
        amount: amount
      });
      expect(result).toBeDefined();
    });

    it('should process full refund', async () => {
      const paymentIntentId = 'pi_mock_123';
      
      const result = await stripeService.createRefund(paymentIntentId);
      
      expect(mockStripe.refunds.create).toHaveBeenCalledWith({
        payment_intent: paymentIntentId
      });
      expect(result).toBeDefined();
    });
  });
});
