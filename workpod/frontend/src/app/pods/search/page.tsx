'use client';

import { useState, useEffect } from 'react';
import { useGetPodsQuery } from '@/store/api/pods';
import { PodMap } from '@/components/pods/PodMap';
import { PodList } from '@/components/pods/PodList';
import { PodFilters } from '@/components/pods/PodFilters';
import { useGeolocation } from '@/hooks/useGeolocation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function PodSearchPage() {
  const { location, loading: loadingLocation } = useGeolocation();
  const [filters, setFilters] = useState({
    maxDistance: 5000, // 5km
    minPrice: 0,
    maxPrice: 1000,
    availability: [] as string[]
  });

  const { data: pods, isLoading } = useGetPodsQuery({
    latitude: location?.latitude || 0,
    longitude: location?.longitude || 0,
    radius: filters.maxDistance
  }, {
    skip: !location
  });

  const filteredPods = pods?.filter(pod => {
    const price = pod.hourlyRate;
    return price >= filters.minPrice && 
           price <= filters.maxPrice &&
           (filters.availability.length === 0 || 
            filters.availability.includes(pod.status));
  });

  if (loadingLocation || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PodMap
            pods={filteredPods || []}
            center={location ? {
              lat: location.latitude,
              lng: location.longitude
            } : undefined}
            onPodSelect={(pod) => {
              // Handle pod selection
            }}
          />
        </div>

        <div>
          <PodFilters
            filters={filters}
            onChange={setFilters}
          />
          <div className="mt-6">
            <PodList
              pods={filteredPods || []}
              userLocation={location}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 