import { paymentValidation } from '../validation';
import type { PaymentIntent } from '../types';

describe('paymentValidation', () => {
    describe('validateAmount', () => {
        it('should accept valid amounts', () => {
            expect(paymentValidation.validateAmount(10)).toBe(true);
            expect(paymentValidation.validateAmount(9999.99)).toBe(true);
        });

        it('should reject invalid amounts', () => {
            expect(paymentValidation.validateAmount(0)).toBe(false);
            expect(paymentValidation.validateAmount(-10)).toBe(false);
            expect(paymentValidation.validateAmount(10001)).toBe(false);
        });
    });

    describe('validatePaymentIntent', () => {
        const validIntent: PaymentIntent = {
            id: 'pi_123',
            amount: 100,
            status: 'requires_payment_method'
        };

        it('should accept valid payment intents', () => {
            expect(paymentValidation.validatePaymentIntent(validIntent)).toBe(true);
        });

        it('should reject payment intents without ID', () => {
            const invalidIntent = { ...validIntent, id: '' };
            expect(paymentValidation.validatePaymentIntent(invalidIntent)).toBe(false);
        });

        it('should reject payment intents with invalid amounts', () => {
            const invalidIntent = { ...validIntent, amount: 0 };
            expect(paymentValidation.validatePaymentIntent(invalidIntent)).toBe(false);
        });
    });

    describe('validatePaymentMethod', () => {
        it('should accept valid payment methods', () => {
            expect(paymentValidation.validatePaymentMethod('card')).toBe(true);
            expect(paymentValidation.validatePaymentMethod('apple_pay')).toBe(true);
            expect(paymentValidation.validatePaymentMethod('paypal')).toBe(true);
        });

        it('should reject invalid payment methods', () => {
            expect(paymentValidation.validatePaymentMethod('invalid' as any)).toBe(false);
        });
    });
}); 