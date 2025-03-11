import { FC } from 'react';

interface MapProps {
  pods: Array<{
    id: string;
    location: { lat: number; lng: number };
    status: string;
  }>;
}

export const Map: FC<MapProps> = ({ pods }) => {
  return (
    <div data-testid="map">
      {/* Map implementation */}
    </div>
  );
}; 