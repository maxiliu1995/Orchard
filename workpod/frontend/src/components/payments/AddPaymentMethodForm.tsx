'use client';

import { useState } from 'react';
import { AddCardForm } from './AddCardForm';
import { PayPalButton } from './PayPalButton';

export function AddPaymentMethodForm() {
  const [method, setMethod] = useState<'card' | 'paypal'>('card');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Add Payment Method</h2>
      
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setMethod('card')}
          className={`px-4 py-2 rounded-lg ${
            method === 'card' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Credit Card
        </button>
        <button
          onClick={() => setMethod('paypal')}
          className={`px-4 py-2 rounded-lg ${
            method === 'paypal' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          PayPal
        </button>
      </div>

      {method === 'card' ? (
        <AddCardForm />
      ) : (
        <div className="p-4 border rounded-lg">
          <PayPalButton 
            amount={0}
            currency="USD"
          />
        </div>
      )}
    </div>
  );
} 