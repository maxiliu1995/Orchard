import { useState } from 'react';
import { useSearchPodsQuery } from '@/store/api/pods';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { PodCard } from './PodCard';

export const PodSearch = () => {
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100,
    status: ['AVAILABLE'],
    radius: 10,
  });

  const { data: pods = [], isLoading } = useSearchPodsQuery(filters);

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleSearch = (value: string) => {
    // Implementation of handleSearch function
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Price Range</h3>
        <RangeSlider
          min={0}
          max={200}
          value={[filters.minPrice, filters.maxPrice]}
          onChange={([min, max]) => setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium">Status</h3>
        <div className="space-y-2 mt-2">
          {['AVAILABLE', 'MAINTENANCE'].map(status => (
            <Checkbox
              key={status}
              label={status.toLowerCase()}
              checked={filters.status.includes(status)}
              onChange={() => handleStatusChange(status)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Distance</h3>
        <select
          value={filters.radius}
          onChange={(e) => setFilters(prev => ({ ...prev, radius: Number(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          {[5, 10, 25, 50].map(km => (
            <option key={km} value={km}>{km} km</option>
          ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="Search locations..."
        data-testid="location-search-input"
        className="w-full rounded-md border-gray-300"
        onChange={(e) => handleSearch(e.target.value)}
      />

      {isLoading ? (
        <div>Loading pods...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pods.length > 0 ? (
            pods.map(pod => (
              <PodCard 
                key={pod.id} 
                pod={pod}
                userLocation={null}
                onSelect={(pod) => {/* Handle selection */}}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No pods found
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 