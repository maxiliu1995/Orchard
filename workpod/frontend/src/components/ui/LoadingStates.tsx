export const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div 
      data-testid="loading-spinner"
      className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" 
    />
  </div>
);

export const SkeletonLoader = ({ count = 1 }) => (
  <div className="animate-pulse space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        data-testid="skeleton-item"
        className="h-4 bg-gray-200 rounded w-full"
      />
    ))}
  </div>
); 