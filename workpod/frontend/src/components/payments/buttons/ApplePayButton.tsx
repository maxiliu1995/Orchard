'use client';

import { useEffect, useState } from 'react';
import { ApplePayService } from '@/lib/payments/stripe/applePay';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';
import type { PaymentSession } from '@/lib/payments/types';

interface ApplePayButtonProps {
    amount: number;
    onPaymentCompleted: (session: PaymentSession) => void;
    onError?: (error: Error) => void;
}

export function ApplePayButton({ amount, onPaymentCompleted, onError }: ApplePayButtonProps) {
    const [isAvailable, setIsAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const applePayService = ApplePayService.getInstance();

    useEffect(() => {
        const checkAvailability = async () => {
            const available = await applePayService.initialize();
            setIsAvailable(available);
        };

        checkAvailability();
    }, []);

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const session = await applePayService.createPaymentSession(amount);
            debugLog('payment', 'Apple Pay payment completed', { sessionId: session.id });
            onPaymentCompleted(session);
        } catch (error) {
            debugLog('payment', 'Apple Pay payment failed', { error });
            const errorMessage = error instanceof Error ? error.message : 'Payment failed';
            showToast.error('Payment failed', {
                description: errorMessage
            });
            onError?.(error instanceof Error ? error : new Error(errorMessage));
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAvailable) return null;

    return (
        <button
            onClick={handlePayment}
            disabled={isLoading}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 
                bg-black text-white rounded-lg hover:bg-gray-900 transition-colors
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.72 7.71h-1.5c-1.05 0-1.85.31-2.39.93-.54.62-.81 1.46-.81 2.52v1.68h4.05l-.54 4.09h-3.51V24H9.03V16.93H5.5v-4.09h3.53v-1.94c0-1.73.49-3.09 1.47-4.08S12.89 5.5 14.62 5.5c1.24 0 2.2.07 2.87.21l.23 2z"/>
            </svg>
            <span>{isLoading ? 'Processing...' : 'Pay with Apple Pay'}</span>
        </button>
    );
} 