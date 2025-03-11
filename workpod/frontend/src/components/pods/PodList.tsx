import { Pod } from '@/types/api.types';
import { PodCard } from './PodCard';

interface PodListProps {
  pods: Pod[];
  userLocation: { latitude: number; longitude: number } | null;
}

export const PodList = ({ pods, userLocation }: PodListProps) => {
  return (
    <div className="space-y-4">
      {pods.map(pod => (
        <PodCard
          key={pod.id}
          pod={pod}
          userLocation={userLocation}
        />
      ))}
      {pods.length === 0 && (
        <p className="text-gray-500 text-center">No pods found in this area</p>
      )}
    </div>
  );
}; 