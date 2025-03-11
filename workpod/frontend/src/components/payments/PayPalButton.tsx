'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useAddPaymentMethodMutation } from '@/store/api/payments';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';

interface PayPalButtonProps {
  amount: number;
  currency: string;
  onSuccess?: () => void;
}

export function PayPalButton({ amount, currency, onSuccess }: PayPalButtonProps) {
  const [addPaymentMethod] = useAddPaymentMethodMutation();

  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                value: (amount / 100).toFixed(2), // Convert cents to dollars
                currency_code: currency.toUpperCase(),
              },
            },
          ],
        });
      }}
      onApprove={async (data, actions) => {
        try {
          const order = await actions.order?.capture();
          if (!order?.id || !order?.payer?.email_address) {
            throw new Error('Invalid PayPal response');
          }

          await addPaymentMethod({
            paymentMethodId: order.id,
            type: 'paypal',
            email: order.payer.email_address,
          }).unwrap();

          showToast.success('PayPal payment method added');
          onSuccess?.();
        } catch (error) {
          debugLog('payment', 'PayPal payment failed', { error });
          showToast.error('Failed to process PayPal payment');
        }
      }}
      onError={(err) => {
        debugLog('payment', 'PayPal error', { error: err });
        showToast.error('PayPal payment failed');
      }}
    />
  );
} 