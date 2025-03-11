import { useState, useEffect } from 'react';
import { useGetPodsQuery } from '@/store/api/pods';
import { calculateDistance } from '@/utils/location';
import { skipToken } from '@reduxjs/toolkit/query';
import type { Pod } from '@/types/api.types';

export function useLocationSearch(searchRadius: number = 5000) {
  const [location, setLocation] = useState<GeolocationPosition>();
  const [searchResults, setSearchResults] = useState<Pod[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { data: pods, isLoading } = useGetPodsQuery(
    location
      ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          radius: searchRadius
        }
      : skipToken
  );

  useEffect(() => {
    if (pods && location) {
      const sortedPods = [...pods].sort((a, b) => {
        const distanceA = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          a.latitude,
          a.longitude
        );
        const distanceB = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          b.latitude,
          b.longitude
        );
        return distanceA - distanceB;
      });
      setSearchResults(sortedPods);
    }
  }, [pods, location]);

  const searchNearby = () => {
    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        setIsSearching(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsSearching(false);
      }
    );
  };

  return {
    searchResults,
    isSearching: isSearching || isLoading,
    searchNearby,
    userLocation: location
  };
} 