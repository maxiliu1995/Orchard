'use client';

import { useCallback, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Pod } from '@/types/api.types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PodMapProps {
  pods: Pod[];
  onPodSelect: (pod: Pod) => void;
  center?: { lat: number; lng: number };
}

export const PodMap = ({ pods, onPodSelect, center }: PodMapProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();
    pods.forEach(pod => {
      bounds.extend({ 
        lat: pod.location.latitude, 
        lng: pod.location.longitude 
      });
    });
    map.fitBounds(bounds);
    setMap(map);
  }, [pods]);

  if (!isLoaded) return <LoadingSpinner />;

  return (
    <GoogleMap
      mapContainerClassName="w-full h-[400px] rounded-lg"
      onLoad={onLoad}
      center={center || { lat: 0, lng: 0 }}
      zoom={12}
    >
      {pods.map(pod => (
        <Marker
          key={pod.id}
          position={{
            lat: pod.location.latitude,
            lng: pod.location.longitude
          }}
          onClick={() => onPodSelect(pod)}
          icon={{
            url: `/markers/${pod.status.toLowerCase()}.svg`,
            scaledSize: new google.maps.Size(30, 30)
          }}
        />
      ))}
    </GoogleMap>
  );
}; 