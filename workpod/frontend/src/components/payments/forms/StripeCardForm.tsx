'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface StripeCardFormProps {
    amount: number;
    onPaymentCompleted: (paymentId: string) => void;
    onPaymentFailed: (error: Error) => void;
}

export const StripeCardForm = ({ amount, onPaymentCompleted, onPaymentFailed }: StripeCardFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement)!,
            });

            if (error) {
                throw error;
            }

            onPaymentCompleted(paymentMethod.id);
        } catch (err) {
            onPaymentFailed(err as Error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button 
                type="submit" 
                disabled={!stripe || isProcessing}
                className="mt-4 w-full py-2 px-4 bg-primary text-white rounded-md"
            >
                {isProcessing ? <LoadingSpinner size="sm" /> : `Pay $${amount.toFixed(2)}`}
            </button>
        </form>
    );
}; 