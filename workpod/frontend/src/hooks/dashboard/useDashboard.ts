import { useState, useEffect } from 'react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  completedProjects: number;
  metrics: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: any[];
  isLoading: boolean;
}

export const useDashboard = (): DashboardData => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for now
  const data = {
    stats: {
      totalUsers: 1250,
      activeUsers: 850,
      totalProjects: 320,
      completedProjects: 275,
      metrics: {
        daily: 85,
        weekly: 450,
        monthly: 1800
      }
    },
    recentActivity: []
  };

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return {
    ...data,
    isLoading
  };
};
