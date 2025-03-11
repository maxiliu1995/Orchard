'use client';

import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useCreatePaymentIntentMutation, useConfirmPaymentMutation } from '@/store/api/payments';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { debugLog } from '@/utils/debug';
import { showToast } from '@/utils/toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { paymentsApi } from '@/lib/payments/api';
import { applePayApi } from '@/lib/payments/stripe/applePay';
import { paymentValidation } from '@/lib/payments/validation';
import type { PaymentMethod, PaymentIntent } from '@/lib/payments/types';
import type { Reservation } from '@/lib/pods/types';
import { StripeCardForm } from './forms/StripeCardForm';

interface PaymentFlowProps {
    reservation: Reservation;
    onPaymentCompleted: () => void;
    onPaymentFailed: () => void;
}

export function PaymentFlow({ 
    reservation, 
    onPaymentCompleted, 
    onPaymentFailed 
}: PaymentFlowProps) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
    const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
    const [{ isPending }] = usePayPalScriptReducer();
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;

    const [createPaymentIntent] = useCreatePaymentIntentMutation();
    const [confirmPayment] = useConfirmPaymentMutation();

    useEffect(() => {
        const initialize = async () => {
            try {
                // Check Apple Pay availability
                const hasApplePay = await applePayApi.checkAvailability();
                setIsApplePayAvailable(hasApplePay);

                // Create payment intent
                const intent = await paymentsApi.createPaymentIntent(reservation.id);
                setPaymentIntent(intent);
                debugLog('payment', 'Payment intent created', { intentId: intent.id });
            } catch (error) {
                debugLog('payment', 'Failed to initialize payment', { error });
                showToast('error', 'Failed to initialize payment');
                onPaymentFailed();
            } finally {
                setIsLoading(false);
            }
        };

        initialize();
    }, [reservation.id, onPaymentFailed]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        try {
            // Create payment intent
            const { clientSecret } = await createPaymentIntent({
                bookingId: reservation.id,
                amount: paymentIntent?.amount || 0,
            }).unwrap();

            // Confirm the payment
            const { error: stripeError, paymentIntent: confirmedPayment } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/bookings/${reservation.id}/confirmation`,
                },
                redirect: 'if_required',
            });

            if (stripeError) {
                setError(stripeError.message || 'Payment failed');
                return;
            }

            if (confirmedPayment.status === 'succeeded') {
                await confirmPayment({
                    bookingId: reservation.id,
                    paymentIntentId: confirmedPayment.id,
                }).unwrap();
                
                onPaymentCompleted();
                router.push(`/bookings/${reservation.id}/confirmation`);
            }
        } catch (err) {
            setError('Payment processing failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handlePayment = async (method: PaymentMethod, paymentMethodId?: string) => {
        if (!paymentIntent) return;

        // Validate payment intent and method
        if (!paymentValidation.validatePaymentIntent(paymentIntent)) {
            showToast('error', 'Invalid payment amount');
            onPaymentFailed();
            return;
        }

        if (!paymentValidation.validatePaymentMethod(method)) {
            showToast('error', 'Invalid payment method');
            onPaymentFailed();
            return;
        }

        try {
            const session = await paymentsApi.confirmPayment(paymentIntent.id, method, paymentMethodId);
            if (session.status === 'completed') {
                debugLog('payment', 'Payment completed', { 
                    sessionId: session.paymentIntentId 
                });
                onPaymentCompleted();
            } else {
                throw new Error('Payment not completed');
            }
        } catch (error) {
            debugLog('payment', 'Payment failed', { error, retryCount });
            if (retryCount < MAX_RETRIES) {
                setRetryCount(prev => prev + 1);
                showToast('error', `Payment failed. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                // Retry after a short delay
                setTimeout(() => handlePayment(method), 2000);
            } else {
                showToast('error', 'Payment failed. Please try again or use a different payment method');
                onPaymentFailed();
            }
        }
    };

    return (
        <div className="flex flex-col space-y-4" data-testid="payment-flow">
            {isLoading ? (
                <div className="flex justify-center p-4" role="status">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full space-y-6">
                        <h2 className="text-xl font-semibold">Complete Payment</h2>
                        
                        <div className="flex flex-col space-y-4">
                            <div className="border-b pb-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">
                                    Pay with card
                                </h3>
                                <StripeCardForm
                                    amount={paymentIntent?.amount || 0}
                                    onPaymentCompleted={(paymentMethodId) => handlePayment('card', paymentMethodId)}
                                    onPaymentFailed={() => onPaymentFailed()}
                                />
                            </div>

                            <div className="text-center text-sm text-gray-500">
                                Or pay with
                            </div>

                            {isApplePayAvailable && (
                                <button
                                    onClick={() => handlePayment('apple_pay')}
                                    className="w-full py-3 px-4 bg-black text-white rounded-lg
                                        font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Pay with Apple Pay
                                </button>
                            )}

                            <PayPalButtons
                                style={{ layout: 'horizontal' }}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        intent: 'CAPTURE',
                                        purchase_units: [{
                                            amount: {
                                                currency_code: 'USD',
                                                value: (paymentIntent?.amount || 0).toString()
                                            }
                                        }]
                                    });
                                }}
                                onApprove={() => handlePayment('paypal')}
                                onError={(err) => {
                                    debugLog('payment', 'PayPal error', { error: err });
                                    onPaymentFailed();
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 