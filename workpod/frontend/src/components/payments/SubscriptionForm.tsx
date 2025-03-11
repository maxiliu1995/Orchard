'use client';

import { useState } from 'react';
import { useCreateSubscriptionMutation, useCancelSubscriptionMutation } from '@/store/api/payments';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';

const PLANS = [
  { id: 'basic', name: 'Basic', price: 999, hours: 10 },
  { id: 'pro', name: 'Professional', price: 1999, hours: 25 },
  { id: 'unlimited', name: 'Unlimited', price: 2999, hours: 'Unlimited' },
] as const;

export function SubscriptionForm() {
  const [selectedPlan, setSelectedPlan] = useState<string>();
  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();
  const [cancelSubscription, { isLoading: isCanceling }] = useCancelSubscriptionMutation();

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    try {
      await createSubscription({ planId: selectedPlan }).unwrap();
      showToast.success('Subscription created successfully');
    } catch (error) {
      debugLog('payment', 'Failed to create subscription', { error });
      showToast.error('Failed to create subscription');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSubscription().unwrap();
      showToast.success('Subscription cancelled');
    } catch (error) {
      debugLog('payment', 'Failed to cancel subscription', { error });
      showToast.error('Failed to cancel subscription');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Subscription Plans</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-lg border-2 cursor-pointer ${
              selectedPlan === plan.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="text-2xl font-bold mt-2">
              ${(plan.price / 100).toFixed(2)}
              <span className="text-sm font-normal text-gray-500">/month</span>
            </p>
            <p className="mt-2 text-gray-600">
              {typeof plan.hours === 'number' ? `${plan.hours} hours` : plan.hours} per month
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={handleCancel}
          disabled={isCanceling}
          className="px-4 py-2 text-red-600 hover:text-red-800"
        >
          {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
        </button>
        <button
          onClick={handleSubscribe}
          disabled={!selectedPlan || isCreating}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isCreating ? 'Processing...' : 'Subscribe'}
        </button>
      </div>
    </div>
  );
} 