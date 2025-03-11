import { PodStatus } from '@/types/api.types';

interface MaintenanceStatusProps {
  status: PodStatus;
  className?: string;
}

export const MaintenanceStatus = ({ status, className = '' }: MaintenanceStatusProps) => {
  const getStatusColor = (status: PodStatus) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500';
      case 'OCCUPIED': return 'bg-yellow-500';
      case 'MAINTENANCE': return 'bg-orange-500';
      case 'OFFLINE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: PodStatus) => {
    switch (status) {
      case 'MAINTENANCE': return 'Under Maintenance';
      case 'OFFLINE': return 'Temporarily Offline';
      case 'OCCUPIED': return 'Currently Occupied';
      case 'AVAILABLE': return 'Available';
      default: return 'Unknown Status';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
      <span className="text-sm text-gray-600">{getStatusText(status)}</span>
    </div>
  );
}; 