import { useState } from 'react';
import { PodStatus } from '@/types/api.types';
import { Button } from '@/components/ui/Button';
import { SearchFilters as SearchFiltersType } from '@/store/api/search';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFiltersType) => void;
}

export const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFiltersType>({
    status: [],
    priceRange: { min: 0, max: 100 },
    distance: 10,
  });

  const handleStatusToggle = (status: PodStatus) => {
    const newStatus = filters.status?.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...(filters.status || []), status];

    const newFilters = { ...filters, status: newStatus };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Status</h3>
        <div className="flex gap-2">
          {['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'].map(status => (
            <Button
              key={status}
              variant={filters.status?.includes(status) ? 'primary' : 'secondary'}
              onClick={() => handleStatusToggle(status as PodStatus)}
              size="sm"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Price Range</h3>
        <div className="flex gap-4 items-center">
          <input
            type="number"
            value={filters.priceRange?.min}
            onChange={(e) => {
              const newFilters = {
                ...filters,
                priceRange: { ...filters.priceRange!, min: Number(e.target.value) }
              };
              setFilters(newFilters);
              onFiltersChange(newFilters);
            }}
            className="w-24 px-2 py-1 border rounded"
            min={0}
          />
          <span>to</span>
          <input
            type="number"
            value={filters.priceRange?.max}
            onChange={(e) => {
              const newFilters = {
                ...filters,
                priceRange: { ...filters.priceRange!, max: Number(e.target.value) }
              };
              setFilters(newFilters);
              onFiltersChange(newFilters);
            }}
            className="w-24 px-2 py-1 border rounded"
            min={0}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Distance (km)</h3>
        <input
          type="range"
          min={1}
          max={50}
          value={filters.distance}
          onChange={(e) => {
            const newFilters = { ...filters, distance: Number(e.target.value) };
            setFilters(newFilters);
            onFiltersChange(newFilters);
          }}
          className="w-full"
        />
        <div className="text-sm text-gray-500 mt-1">
          Within {filters.distance}km
        </div>
      </div>
    </div>
  );
}; 