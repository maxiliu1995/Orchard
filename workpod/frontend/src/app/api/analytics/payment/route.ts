import { NextResponse } from 'next/server';
import { debugLog } from '@/utils/debug';

export async function POST(request: Request) {
    const event = await request.json();
    
    // Log the event (in production, send to analytics service)
    debugLog('analytics', 'Payment event received', { event });

    return NextResponse.json({ success: true });
} 