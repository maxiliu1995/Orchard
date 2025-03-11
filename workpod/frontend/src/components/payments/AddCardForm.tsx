'use client';

import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useAddPaymentMethodMutation } from '@/store/api/payments';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';

export function AddCardForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [addPaymentMethod] = useAddPaymentMethodMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (error) {
        throw new Error(error.message);
      }

      await addPaymentMethod({ paymentMethodId: paymentMethod.id }).unwrap();
      showToast.success('Card added successfully');
      elements.getElement(CardElement)?.clear();
    } catch (error) {
      debugLog('payment', 'Failed to add card', { error });
      showToast.error('Failed to add card');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Add New Card</h2>
      
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full btn-primary"
      >
        {isLoading ? 'Adding...' : 'Add Card'}
      </button>
    </form>
  );
} 