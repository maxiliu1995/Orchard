import { debugLog } from '@/utils/debug';
import type { PaymentIntent, PaymentMethod, PaymentSession } from './types';

export const paymentsApi = {
    createPaymentIntent: async (reservationId: string) => {
        const response = await fetch('/api/payments/intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reservationId })
        });

        if (!response.ok) {
            debugLog('payment', 'Failed to create payment intent', { 
                status: response.status 
            });
            throw new Error('Failed to create payment intent');
        }

        return response.json();
    },

    confirmPayment: async (
        paymentIntentId: string, 
        method: PaymentMethod,
        paymentMethodId?: string
    ) => {
        const response = await fetch(`/api/payments/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                paymentIntentId, 
                method,
                paymentMethodId 
            }),
        });
        return response.json();
    }
};