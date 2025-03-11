import { jest } from '@jest/globals';
import type { Stripe } from 'stripe';

// Helper to create Stripe responses
export const createMockResponse = <T>(data: T): Stripe.Response<T> => ({
  ...(data as T),
  lastResponse: {
    headers: {},
    requestId: 'req_mock',
    statusCode: 200,
  }
});

// Mock PaymentIntent data
const mockPaymentIntent: Stripe.PaymentIntent = {
  id: 'pi_mock',
  object: 'payment_intent',
  status: 'succeeded',
  amount: 2500,
  currency: 'usd',
  client_secret: 'secret_mock',
  livemode: false,
  created: Date.now(),
  payment_method_types: ['card'],
  capture_method: 'automatic',
  confirmation_method: 'automatic',
  amount_capturable: 0,
  amount_received: 2500,
  payment_method: 'pm_mock',
  metadata: {},
  customer: null,
  description: null,
  invoice: null,
  last_payment_error: null,
  canceled_at: null,
  cancellation_reason: null,
  application: null,
  application_fee_amount: null,
  automatic_payment_methods: null,
  review: null,
  statement_descriptor: null,
  statement_descriptor_suffix: null,
  transfer_data: null,
  transfer_group: null,
  setup_future_usage: null,
  processing: null,
  next_action: null,
  latest_charge: null,
  on_behalf_of: null,
  payment_method_configuration_details: null,
  payment_method_options: {},
  shipping: null,
  source: null
} as Stripe.PaymentIntent;

// Add mock refund data
const mockRefund: Stripe.Refund = {
  id: 'ref_mock',
  object: 'refund',
  amount: 1000,
  currency: 'usd',
  payment_intent: 'pi_mock',
  status: 'succeeded',
  created: Date.now()
} as Stripe.Refund;

// Create mock Stripe instance
export const mockStripe = {
  paymentIntents: {
    create: jest.fn<(params: Stripe.PaymentIntentCreateParams) => Promise<Stripe.Response<Stripe.PaymentIntent>>>()
      .mockImplementation((params) => Promise.resolve(createMockResponse({
        ...mockPaymentIntent,
        amount: params.amount,
        currency: params.currency,
        metadata: { ...(params.metadata || {}) }
      } as Stripe.PaymentIntent))),
    capture: jest.fn<(paymentIntentId: string) => Promise<Stripe.Response<Stripe.PaymentIntent>>>()
      .mockResolvedValue(createMockResponse(mockPaymentIntent)),
    confirm: jest.fn<(paymentIntentId: string, params?: Stripe.PaymentIntentConfirmParams) => Promise<Stripe.Response<Stripe.PaymentIntent>>>()
      .mockResolvedValue(createMockResponse(mockPaymentIntent))
  },
  paymentMethods: {
    create: jest.fn().mockImplementation((): Promise<Stripe.Response<Stripe.PaymentMethod>> => 
      Promise.resolve(createMockResponse({
        id: 'pm_mock',
        object: 'payment_method',
        type: 'card',
        created: Date.now(),
        livemode: false,
        customer: null,
        metadata: {},
        billing_details: {
          address: null,
          email: null,
          name: null,
          phone: null
        },
        card: {
          brand: 'visa',
          country: 'US',
          exp_month: 12,
          exp_year: 2024,
          fingerprint: 'mock_fingerprint',
          funding: 'credit',
          last4: '4242',
          networks: {
            available: ['visa'],
            preferred: null
          },
          three_d_secure_usage: {
            supported: true
          },
          wallet: null
        }
      } as Stripe.PaymentMethod)))
  },
  refunds: {
    create: jest.fn<(params: Stripe.RefundCreateParams) => Promise<Stripe.Response<Stripe.Refund>>>()
      .mockImplementation((params) => Promise.resolve(createMockResponse(mockRefund)))
  },
  webhooks: {
    constructEvent: jest.fn().mockImplementation((body, signature) => {
      if (!signature || signature === 'invalid_signature') {
        throw new Error('Invalid signature');
      }
      return typeof body === 'string' ? JSON.parse(body) : body;
    })
  },
  customers: {
    create: jest.fn(),
    update: jest.fn()
  }
} as unknown as jest.Mocked<Stripe>;

// Create mock service implementation
export class MockStripeService {
  private stripe: Stripe = mockStripe;

  async createPaymentIntent(paymentData: any) {
    return this.stripe.paymentIntents.create({
      amount: paymentData.amount,
      currency: paymentData.currency,
      metadata: { bookingId: paymentData.bookingId }
    });
  }

  async handleApplePay(paymentIntentId: string, token: string) {
    return this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: token
    });
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string) {
    return this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId
    });
  }

  async capturePayment(paymentIntentId: string) {
    return this.stripe.paymentIntents.capture(paymentIntentId);
  }

  async createRefund(paymentIntentId: string, amount?: number) {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount
    });
  }
}

// Export instances
export const mockStripeService = new MockStripeService();

// Setup mocks
jest.mock('stripe', () => jest.fn(() => mockStripe));
jest.mock('@/shared/integrations/stripe', () => ({ stripe: mockStripe }));

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
}); 