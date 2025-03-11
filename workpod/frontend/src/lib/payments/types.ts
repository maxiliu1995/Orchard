export type PaymentMethod = 'apple_pay' | 'paypal' | 'card';

export type PaymentError = {
    code: 'card_declined' | 'authentication_required' | 'insufficient_funds' | 'expired_card' | 'unknown';
    message: string;
    requiresAction?: boolean;
    actionUrl?: string;
};

export interface PaymentIntent {
    id: string;
    amount: number;
    status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'failed';
    clientSecret?: string;
    requiresAction?: boolean;
    nextAction?: {
        type: 'redirect_to_url' | '3ds2_fingerprint' | '3ds2_challenge';
        url?: string;
    };
}

export interface PaymentSession {
    reservationId: string;
    paymentIntentId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    method?: PaymentMethod;
}

export interface CardDetails {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
} 