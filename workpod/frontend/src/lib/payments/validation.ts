import { debugLog } from '@/utils/debug';
import type { PaymentIntent, PaymentMethod } from './types';

export const paymentValidation = {
    validateAmount(amount: number): boolean {
        return amount > 0 && amount <= 10000; // Max $10,000
    },

    validatePaymentIntent(intent: PaymentIntent): boolean {
        if (!intent.id || !intent.amount) {
            debugLog('payment', 'Invalid payment intent', { intent });
            return false;
        }
        return this.validateAmount(intent.amount);
    },

    validatePaymentMethod(method: PaymentMethod): boolean {
        return ['apple_pay', 'paypal', 'card'].includes(method);
    }
}; 