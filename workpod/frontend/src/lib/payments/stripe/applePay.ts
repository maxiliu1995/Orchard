import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, PaymentRequest } from '@stripe/stripe-js';
import { debugLog } from '@/utils/debug';

let stripePromise: Promise<Stripe | null>;

export const initializeStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
    }
    return stripePromise;
};

export const applePayApi = {
    async checkAvailability(): Promise<boolean> {
        const stripe = await initializeStripe();
        if (!stripe) {
            debugLog('payment', 'Stripe not initialized');
            return false;
        }

        const paymentRequest = stripe.paymentRequest({
            country: 'US',
            currency: 'usd',
            total: { label: 'WorkPod Session', amount: 0 },
            requestPayerName: true,
            requestPayerEmail: true,
        });

        const result = await paymentRequest.canMakePayment();
        return !!result?.applePay;
    },

    async createPaymentRequest(amount: number): Promise<PaymentRequest | null> {
        const stripe = await initializeStripe();
        if (!stripe) return null;

        return stripe.paymentRequest({
            country: 'US',
            currency: 'usd',
            total: {
                label: 'WorkPod Session',
                amount: Math.round(amount * 100)
            },
            requestPayerName: true,
            requestPayerEmail: true
        });
    }
};