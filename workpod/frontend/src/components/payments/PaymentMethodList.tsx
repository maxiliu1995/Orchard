'use client';

import { useState } from 'react';
import { useGetPaymentMethodsQuery, useRemovePaymentMethodMutation, useSetDefaultPaymentMethodMutation } from '@/store/api/payments';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';
import type { PaymentMethod } from '@/types/payment.types';

export function PaymentMethodList() {
  const { data: paymentMethods, isLoading } = useGetPaymentMethodsQuery();
  const [removeMethod] = useRemovePaymentMethodMutation();
  const [setDefault] = useSetDefaultPaymentMethodMutation();
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemove = async (method: PaymentMethod) => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    setRemoving(method.id);
    try {
      await removeMethod(method.id).unwrap();
      showToast.success('Payment method removed');
    } catch (error) {
      debugLog('payment', 'Failed to remove payment method', { error });
      showToast.error('Failed to remove payment method');
    } finally {
      setRemoving(null);
    }
  };

  const handleSetDefault = async (method: PaymentMethod) => {
    try {
      await setDefault(method.id).unwrap();
      showToast.success('Default payment method updated');
    } catch (error) {
      debugLog('payment', 'Failed to set default payment method', { error });
      showToast.error('Failed to update default payment method');
    }
  };

  if (isLoading) {
    return <div>Loading payment methods...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Payment Methods</h2>
      
      {paymentMethods?.map(method => (
        <div 
          key={method.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
        >
          <div className="flex items-center space-x-4">
            {method.type === 'card' ? (
              <div className="text-2xl">💳</div>
            ) : (
              <div className="text-2xl">PayPal</div>
            )}
            
            <div>
              {method.type === 'card' ? (
                <>
                  <p className="font-medium">
                    {method.brand} •••• {method.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </p>
                </>
              ) : (
                <p className="font-medium">PayPal Account</p>
              )}
              {method.isDefault && (
                <span className="text-xs text-green-500">Default</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!method.isDefault && (
              <button
                onClick={() => handleSetDefault(method)}
                className="text-blue-600 hover:text-blue-800"
              >
                Set Default
              </button>
            )}
            <button
              onClick={() => handleRemove(method)}
              disabled={removing === method.id}
              className="text-red-600 hover:text-red-800"
            >
              {removing === method.id ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 