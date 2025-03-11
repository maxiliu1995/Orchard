'use client';

import { PaymentFlow } from '@/components/payments/PaymentFlow';

export default function TestPage() {
    const mockReservation = {
        id: 'test-res',
        podId: 'test-pod',
        userId: 'test-user',
        startTime: new Date().toISOString(),
        status: 'Active' as const
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <PaymentFlow 
                reservation={mockReservation}
                onPaymentCompleted={() => alert('Payment completed!')}
                onPaymentFailed={() => alert('Payment failed!')}
            />
        </div>
    );
} 