import { NextResponse } from 'next/server';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    // Mock cancellation
    return NextResponse.json({ success: true });
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    // Mock get reservation
    return NextResponse.json({
        id: params.id,
        podId: 'pod-1',
        userId: 'user-1',
        startTime: new Date().toISOString(),
        status: 'Active'
    });
} 