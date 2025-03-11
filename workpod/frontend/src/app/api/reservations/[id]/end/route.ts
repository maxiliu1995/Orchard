import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    // Mock session end
    return NextResponse.json({
        success: true,
        endTime: new Date().toISOString(),
        totalAmount: 25.50
    });
} 