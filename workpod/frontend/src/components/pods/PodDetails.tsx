import React from 'react';
import { Pod } from '@/types/lock';

interface PodDetailsProps {
  pod: Pod;
}

export const PodDetails: React.FC<PodDetailsProps> = ({ pod }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">{pod.name}</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Location</p>
          <p className="font-medium">{pod.location}</p>
        </div>
        <div>
          <p className="text-gray-600">Status</p>
          <p className="font-medium capitalize">{pod.status.toLowerCase()}</p>
        </div>
        <div>
          <p className="text-gray-600">Rate</p>
          <p className="font-medium">${pod.hourlyRate}/hour</p>
        </div>
      </div>
    </div>
  );
}; 