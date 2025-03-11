import { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGetPodsQuery } from '@/store/api/pods';
import { skipToken } from '@reduxjs/toolkit/query';
import type { Pod } from '@/types/api.types';

export function PodMap() {
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number}>();
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default
  
  const { data: nearbyPods } = useGetPodsQuery(
    userLocation 
      ? { 
          latitude: userLocation.lat, 
          longitude: userLocation.lng, 
          radius: searchRadius 
        }
      : skipToken
  );

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  return (
    <GoogleMap
      center={userLocation}
      zoom={13}
      mapContainerClassName="w-full h-[500px]"
    >
      {nearbyPods?.map(pod => (
        <Marker
          key={pod.id}
          position={{ lat: pod.latitude, lng: pod.longitude }}
          title={pod.name}
        />
      ))}
    </GoogleMap>
  );
} 