'use client';

import { useState, useEffect } from 'react';
import { Pod, Reservation } from '@/lib/pods/types';
import { Button } from '@/components/ui/Button';
import { CountdownTimer } from '@/components/ui/CountdownTimer';

interface ReservationScreenProps {
  pod: Pod;
  reservation: Reservation;
  onCancel: () => void;
  onStart: () => void;
}

export function ReservationScreen({ pod, reservation, onCancel, onStart }: ReservationScreenProps) {
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold">Your Reservation</h2>
          <p className="text-gray-500">Pod #{pod.id}</p>
        </div>

        {/* Timer */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Time remaining to start your session</p>
          <CountdownTimer
            seconds={timeRemaining}
            onComplete={onCancel}
            className="text-3xl font-bold text-primary"
          />
        </div>

        {/* Pod Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{pod.location.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Reservation ID</p>
            <p className="font-medium">{reservation.id}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel Reservation
          </Button>
          <Button
            onClick={onStart}
            className="flex-1"
          >
            Start Session
          </Button>
        </div>
      </div>
    </div>
  );
} 