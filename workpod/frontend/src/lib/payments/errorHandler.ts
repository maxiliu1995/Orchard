import { debugLog } from '@/utils/debug';
import { showToast } from '@/utils/toast';
import type { PaymentError } from './types';
import { paymentAnalytics } from './analytics';
import { paymentMonitoring } from './monitoring';

export const paymentErrorHandler = {
    maxRetries: 3,
    retryDelay: 2000, // 2 seconds

    async handleErrorWithRetry(
        error: PaymentError,
        retryFn: () => Promise<any>,
        currentRetry = 0
    ): Promise<boolean> {
        await paymentAnalytics.trackError(error, { retryCount: currentRetry });

        if (currentRetry < this.maxRetries) {
            showToast.error('Payment failed', {
                description: `Retrying... (${currentRetry + 1}/${this.maxRetries})`
            });

            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            try {
                await retryFn();
                return true;
            } catch (retryError) {
                return this.handleErrorWithRetry(
                    retryError as PaymentError,
                    retryFn,
                    currentRetry + 1
                );
            }
        }

        return this.handleError(error);
    },

    async handleError(error: PaymentError): Promise<boolean> {
        debugLog('payment', 'Handling payment error', { error });

        // Track the error
        await paymentAnalytics.trackError(error);

        // Check payment services health
        const healthChecks = await paymentMonitoring.checkHealth();
        const hasServiceIssues = healthChecks.some(check => check.status === 'down');

        if (hasServiceIssues) {
            showToast.error('Payment service unavailable', {
                description: 'Please try again later'
            });
            return false;
        }

        switch (error.code) {
            case 'authentication_required':
                if (error.requiresAction && error.actionUrl) {
                    return await this.handle3DSecure(error.actionUrl);
                }
                return false;

            case 'card_declined':
                showToast.error('Card declined', {
                    description: 'Please try a different card'
                });
                return false;

            case 'insufficient_funds':
                showToast.error('Insufficient funds', {
                    description: 'Please try a different payment method'
                });
                return false;

            case 'expired_card':
                showToast.error('Card expired', {
                    description: 'Please use a different card'
                });
                return false;

            default:
                showToast.error('Payment failed', {
                    description: 'Please try again or use a different payment method'
                });
                return false;
        }
    },

    async handle3DSecure(url: string): Promise<boolean> {
        await paymentAnalytics.trackEvent({
            eventType: 'authentication_required',
            paymentMethod: 'card',
            amount: 0,
            metadata: { authenticationType: '3ds' }
        });

        return new Promise((resolve) => {
            const popup = window.open(url, '3D Secure', 'width=600,height=600');
            
            window.addEventListener('message', function handler(event) {
                if (event.data.type === '3ds-authentication-complete') {
                    window.removeEventListener('message', handler);
                    popup?.close();
                    resolve(event.data.success);
                }
            });

            // Handle popup blocked or closed
            const checkClosed = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(checkClosed);
                    resolve(false);
                }
            }, 1000);
        });
    }
}; 