import { useState, useEffect } from 'react';
import { LocationService, Coordinates } from '@/services/location';

export const useLocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LocationService.getCurrentPosition()
      .then(setLocation)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const refreshLocation = async () => {
    setLoading(true);
    try {
      const newLocation = await LocationService.getCurrentPosition();
      setLocation(newLocation);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  return { location, error, loading, refreshLocation };
}; 