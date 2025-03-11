import { NextResponse } from 'next/server';
import type { Reservation } from '@/lib/pods/types';

let mockReservations: Reservation[] = [];

export async function POST(request: Request) {
    const { podId } = await request.json();
    
    const newReservation: Reservation = {
        id: `res-${Date.now()}`,
        podId,
        userId: 'user-1', // Mock user ID
        startTime: new Date().toISOString(),
        status: 'Active'
    };
    
    mockReservations.push(newReservation);
    return NextResponse.json(newReservation);
} 