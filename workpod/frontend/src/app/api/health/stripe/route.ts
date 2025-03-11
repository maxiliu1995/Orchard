import { NextResponse } from 'next/server';
import { debugLog } from '@/utils/debug';

export async function GET() {
    try {
        // In production, perform actual Stripe API health check
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call
        return NextResponse.json({ status: 'healthy' });
    } catch (error) {
        debugLog('health', 'Stripe health check failed', { error });
        return NextResponse.json(
            { status: 'down', error: 'Service unavailable' },
            { status: 503 }
        );
    }
} 