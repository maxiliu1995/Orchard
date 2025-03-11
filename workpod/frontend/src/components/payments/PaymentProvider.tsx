'use client';

import { Elements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentService } from '@/services/payment';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

const paypalConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  currency: 'USD',
  intent: 'capture'
};

interface PaymentProviderProps {
  children: React.ReactNode;
}

export const PaymentProvider = ({ children }: PaymentProviderProps) => {
  return (
    <PayPalScriptProvider options={paypalConfig}>
      <Elements stripe={stripePromise}>
        {children}
      </Elements>
    </PayPalScriptProvider>
  );
}; 