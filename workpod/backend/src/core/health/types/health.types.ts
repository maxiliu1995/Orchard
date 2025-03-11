export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  services: {
    database: boolean;
    redis: boolean;
    stripe: boolean;
    ttlock: boolean;
  };
  system: {
    cpuUsage: number;
    memoryUsage: {
      total: number;
      free: number;
      used: number;
      usagePercentage: number;
    };
    uptime: number;
    loadAverage: number[];
  };
} 