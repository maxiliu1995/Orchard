import { NextResponse } from 'next/server';
import type { PaymentSession } from '@/lib/payments/types';

export async function POST(request: Request) {
    const { paymentIntentId, method } = await request.json();

    // Mock payment confirmation
    const session: PaymentSession = {
        reservationId: 'mock_reservation',
        paymentIntentId,
        amount: 25.50,
        status: 'completed',
        method
    };

    return NextResponse.json(session);
} 