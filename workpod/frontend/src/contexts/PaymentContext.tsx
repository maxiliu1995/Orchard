'use client';

import { createContext, useContext, useCallback } from 'react';
import { paymentService } from '@/services/payments/paymentService';
import type { CreatePaymentIntentRequest } from '@/types/payment.types';

interface PaymentContextType {
  createPayment: (data: CreatePaymentIntentRequest) => Promise<string>;
  handlePaymentSuccess: (paymentId: string) => Promise<void>;
  handlePaymentError: (error: Error) => void;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const createPayment = useCallback(async (data: CreatePaymentIntentRequest) => {
    const { clientSecret } = await paymentService.createStripePaymentIntent(data);
    return clientSecret;
  }, []);

  const handlePaymentSuccess = useCallback(async (paymentId: string) => {
    // Handle successful payment (e.g., update booking status)
  }, []);

  const handlePaymentError = useCallback((error: Error) => {
    // Handle payment error (e.g., show error message)
  }, []);

  return (
    <PaymentContext.Provider value={{ createPayment, handlePaymentSuccess, handlePaymentError }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
} 