import { jest } from '@jest/globals';
import { PayPalService } from '@/core/payments/services/paypalService';

// Define types for mocked responses
interface PayPalOrder {
  id: string;
  status: string;
  amount?: {
    value: string;
    currency_code: string;
  };
  links?: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

// Define PayPal interface for mocking
export interface PayPal {
  payments: {
    create: jest.Mock;
    capture: jest.Mock;
    refund: jest.Mock;
  };
  orders: {
    create: jest.Mock;
    capture: jest.Mock;
  };
}

interface PayPalCreateOrderData {
  purchase_units?: Array<{
    amount?: {
      value: string;
      currency_code: string;
    };
  }>;
}

type PayPalResponse<T> = { result: T };

interface PayPalRefundResult {
  id: string;
  status: string;
}

// Create mock implementation
export const mockPayPal = {
  payments: {
    create: jest.fn(),
    capture: jest.fn(),
    refund: jest.fn()
  },
  orders: {
    create: jest.fn().mockImplementation((_data: unknown) => 
      Promise.resolve({ result: mockPayPalResponses.order })) as jest.MockedFunction<
        (data: PayPalCreateOrderData) => Promise<PayPalResponse<PayPalOrder>>
      >,
    capture: jest.fn()
  },
  refunds: {
    create: jest.fn()
  }
};

// Mock both PayPal integrations
jest.mock('@/shared/integrations/paypal', () => ({ paypal: mockPayPal }));
jest.mock('@paypal/checkout-server-sdk', () => ({
  __esModule: true,
  default: jest.fn(() => mockPayPal)
}));

// Export for backward compatibility
export const mockPayPalResponses = {
  order: {
    id: 'MOCK_ORDER_123',
    status: 'CREATED',
    links: [{
      href: 'https://mock.paypal.com/order/123',
      rel: 'self',
      method: 'GET'
    }]
  }
};

beforeEach(() => {
  jest.clearAllMocks();
}); 