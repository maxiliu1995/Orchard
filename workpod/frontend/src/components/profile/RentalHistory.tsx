'use client';

import { useState } from 'react';
import { Reservation } from '@/lib/pods/types';
import { format } from 'date-fns';

const MOCK_RENTALS: Reservation[] = [
  {
    id: '1',
    podId: 'pod-1',
    userId: 'user-1',
    startTime: '2024-01-01T10:00:00Z',
    endTime: '2024-01-01T12:00:00Z',
    status: 'Completed',
    totalAmount: 25.00,
  }
];

export function RentalHistory() {
  const [rentals] = useState(MOCK_RENTALS);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Rental History</h3>
      
      <div className="space-y-4">
        {rentals.map((rental) => (
          <div
            key={rental.id}
            className="bg-white border rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Pod #{rental.podId}</h4>
                <p className="text-sm text-gray-500">
                  {format(new Date(rental.startTime), 'PPP')}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                rental.status === 'Completed' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {rental.status}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <div className="space-y-1">
                <p className="text-gray-500">Duration</p>
                <p className="font-medium">
                  {format(new Date(rental.startTime), 'p')} - {format(new Date(rental.endTime!), 'p')}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-gray-500">Total Amount</p>
                <p className="font-medium">${rental.totalAmount?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 