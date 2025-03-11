import { debugLog } from '@/utils/debug';
import type { PaymentIntent, PaymentError } from './types';

interface HealthCheck {
    service: 'stripe' | 'paypal';
    status: 'healthy' | 'degraded' | 'down';
    latency: number;
}

export const paymentMonitoring = {
    async checkHealth(): Promise<HealthCheck[]> {
        const checks: HealthCheck[] = [];
        
        // Check Stripe
        const stripeStart = Date.now();
        try {
            const response = await fetch('/api/health/stripe');
            checks.push({
                service: 'stripe',
                status: response.ok ? 'healthy' : 'degraded',
                latency: Date.now() - stripeStart
            });
        } catch (error) {
            checks.push({
                service: 'stripe',
                status: 'down',
                latency: Date.now() - stripeStart
            });
        }

        // Check PayPal
        const paypalStart = Date.now();
        try {
            const response = await fetch('/api/health/paypal');
            checks.push({
                service: 'paypal',
                status: response.ok ? 'healthy' : 'degraded',
                latency: Date.now() - paypalStart
            });
        } catch (error) {
            checks.push({
                service: 'paypal',
                status: 'down',
                latency: Date.now() - paypalStart
            });
        }

        return checks;
    },

    async monitorPaymentIntent(intent: PaymentIntent): Promise<void> {
        const start = Date.now();
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/payments/intent/${intent.id}`);
                const updated = await response.json();
                
                if (updated.status === 'succeeded') {
                    clearInterval(interval);
                    debugLog('monitoring', 'Payment completed successfully', {
                        duration: Date.now() - start
                    });
                } else if (Date.now() - start > 300000) { // 5 minutes timeout
                    clearInterval(interval);
                    debugLog('monitoring', 'Payment monitoring timeout', { intent });
                }
            } catch (error) {
                debugLog('monitoring', 'Payment monitoring failed', { error });
            }
        }, 5000); // Check every 5 seconds
    }
}; 