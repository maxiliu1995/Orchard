'use client';

import { useState } from 'react';
import { Pod, Reservation } from '@/lib/pods/types';
import { Button } from '@/components/ui/Button';
import { AddOnSelector } from './AddOnSelector';

interface SessionScreenProps {
  pod: Pod;
  reservation: Reservation;
  onPause: () => void;
  onEnd: () => void;
}

export function SessionScreen({ pod, reservation, onPause, onEnd }: SessionScreenProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold">Active Session</h2>
          <p className="text-gray-500">Pod #{pod.id}</p>
        </div>

        {/* Session Timer */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Session Duration</p>
          {/* We'll implement the session timer later */}
          <div className="text-3xl font-bold text-primary">00:00:00</div>
        </div>

        {/* Add-ons */}
        <AddOnSelector
          selectedAddOns={selectedAddOns}
          onSelect={setSelectedAddOns}
        />

        {/* Actions */}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={onPause}
            className="flex-1"
          >
            Pause Session
          </Button>
          <Button
            variant="destructive"
            onClick={onEnd}
            className="flex-1"
          >
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
} 