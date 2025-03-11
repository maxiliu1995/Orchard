import { useMemo } from 'react';

interface RevenueChartProps {
  data: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Daily</span>
        <span className="font-medium">${data.daily}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Weekly</span>
        <span className="font-medium">${data.weekly}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Monthly</span>
        <span className="font-medium">${data.monthly}</span>
      </div>
    </div>
  );
}; 