'use client';

import { useEffect } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import type { CreateOrderData, OnApproveData, OnApproveActions } from '@paypal/paypal-js';
import { debugLog } from '@/utils/debug';
import { showToast } from '@/utils/toast';

interface PayPalPaymentProps {
  amount: number;
  currency: string;
  onSuccess: (orderId: string) => void;
  onError: (error: Error) => void;
}

export function PayPalPayment({ amount, currency, onSuccess, onError }: PayPalPaymentProps) {
  const [{ isPending, isResolved }] = usePayPalScriptReducer();

  useEffect(() => {
    if (isResolved) {
      debugLog('payment', 'PayPal SDK loaded');
    }
  }, [isResolved]);

  if (isPending) {
    return <div>Loading PayPal...</div>;
  }

  return (
    <PayPalButtons
      style={{ layout: 'vertical' }}
      createOrder={(_data: CreateOrderData, actions) => {
        return actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: amount.toString(),
              },
            },
          ],
        });
      }}
      onApprove={async (data: OnApproveData, actions: OnApproveActions) => {
        try {
          const order = await actions.order?.capture();
          if (!order) {
            throw new Error('Failed to capture order');
          }
          debugLog('payment', 'PayPal payment succeeded', { orderId: order.id });
          showToast('success', 'Payment successful');
          onSuccess(order.id);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Payment failed');
          debugLog('payment', 'PayPal capture error', error);
          onError(error);
        }
      }}
      onError={(err) => {
        const error = err instanceof Error ? err : new Error('Payment failed');
        debugLog('payment', 'PayPal payment error', error);
        showToast('error', 'Payment failed');
        onError(error);
      }}
    />
  );
} 