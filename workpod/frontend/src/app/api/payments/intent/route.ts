import { NextResponse } from 'next/server';
import type { PaymentIntent } from '@/lib/payments/types';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    // Basic security checks
    const headersList = headers();
    const contentType = headersList.get('content-type');
    
    if (contentType !== 'application/json') {
        return NextResponse.json(
            { error: 'Invalid content type' },
            { status: 415 }
        );
    }

    const { reservationId } = await request.json();

    if (!reservationId) {
        return NextResponse.json(
            { error: 'Missing reservation ID' },
            { status: 400 }
        );
    }

    // Mock payment intent creation
    const intent: PaymentIntent = {
        id: `pi_${Date.now()}`,
        amount: 25.50,
        status: 'requires_payment_method',
        clientSecret: 'mock_secret'
    };

    return NextResponse.json(intent);
} 