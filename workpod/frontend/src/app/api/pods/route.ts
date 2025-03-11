import { NextResponse } from 'next/server';
import type { Pod } from '@/lib/pods/types';

const mockPods: Pod[] = [
    {
        id: 'pod-1',
        status: 'Available',
        location: { lat: 37.7749, lng: -122.4194 }
    },
    {
        id: 'pod-2',
        status: 'Occupied',
        location: { lat: 37.7748, lng: -122.4193 }
    }
];

export async function GET() {
    return NextResponse.json(mockPods);
} 