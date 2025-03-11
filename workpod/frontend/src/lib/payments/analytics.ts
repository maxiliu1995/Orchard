import { debugLog } from '@/utils/debug';
import type { PaymentMethod, PaymentError } from './types';

interface PaymentEvent {
    eventType: 'payment_started' | 'payment_completed' | 'payment_failed' | 'authentication_required';
    paymentMethod: PaymentMethod;
    amount: number;
    error?: PaymentError;
    metadata?: Record<string, any>;
}

export const paymentAnalytics = {
    async trackEvent(event: PaymentEvent) {
        try {
            await fetch('/api/analytics/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...event,
                    timestamp: new Date().toISOString()
                })
            });
            debugLog('analytics', 'Payment event tracked', { event });
        } catch (error) {
            debugLog('analytics', 'Failed to track payment event', { error });
        }
    },

    async trackError(error: PaymentError, metadata?: Record<string, any>) {
        await this.trackEvent({
            eventType: 'payment_failed',
            paymentMethod: 'card',
            amount: 0,
            error,
            metadata
        });
    }
}; 