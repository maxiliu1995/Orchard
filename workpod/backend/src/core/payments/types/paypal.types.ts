export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links?: PayPalLink[];
}

export interface OrdersCreateResponse {
  id: string;
  status: 'CREATED' | 'COMPLETED' | 'FAILED';
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface OrdersCaptureResponse {
  id: string;
  status: 'COMPLETED' | 'FAILED';
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          value: string;
          currency_code: string;
        };
      }>;
    };
  }>;
}

export interface PayPalRefundResponse {
  id: string;
  status: 'COMPLETED' | 'FAILED';
  amount: {
    value: string;
    currency_code: string;
  };
  create_time: string;
  update_time: string;
} 