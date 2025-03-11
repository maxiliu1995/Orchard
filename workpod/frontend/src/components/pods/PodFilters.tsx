interface PodFiltersProps {
  filters: {
    maxDistance: number;
    minPrice: number;
    maxPrice: number;
    availability: string[];
  };
  onChange: (filters: PodFiltersProps['filters']) => void;
}

export const PodFilters = ({ filters, onChange }: PodFiltersProps) => {
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h3 className="font-medium">Filters</h3>
      
      <div>
        <label className="block text-sm text-gray-500">Max Distance (km)</label>
        <input
          type="range"
          min="1"
          max="50"
          value={filters.maxDistance / 1000}
          onChange={(e) => onChange({
            ...filters,
            maxDistance: Number(e.target.value) * 1000
          })}
          className="w-full"
        />
        <span className="text-sm">{filters.maxDistance / 1000}km</span>
      </div>

      <div>
        <label className="block text-sm text-gray-500">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(e) => onChange({
              ...filters,
              minPrice: Number(e.target.value)
            })}
            className="w-24 rounded border-gray-300"
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => onChange({
              ...filters,
              maxPrice: Number(e.target.value)
            })}
            className="w-24 rounded border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}; 