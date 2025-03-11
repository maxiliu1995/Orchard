'use client';

import { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Pod } from '@/lib/pods/types';
import { PodCard } from '@/components/pods/PodCard';

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194
};

const mockPods: Pod[] = [
  {
    id: 'pod-1',
    status: 'Available',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: '123 Market St, San Francisco, CA'
    }
  }
];

export default function HomePage() {
  const [selectedPod, setSelectedPod] = useState<Pod | null>(null);

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={defaultCenter}
        zoom={14}
      >
        {/* Markers will be added here */}
      </GoogleMap>

      {selectedPod && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96">
          <PodCard
            pod={selectedPod}
            onClose={() => setSelectedPod(null)}
            onReserve={() => {/* Handle reservation */}}
          />
        </div>
      )}
    </div>
  );
}
