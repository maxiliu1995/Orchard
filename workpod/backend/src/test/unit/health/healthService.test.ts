// Third-party imports
import { describe, it, expect, jest } from '@jest/globals';

// Core services
import { healthService } from '../../../core/health/services/healthService';

describe('HealthService', () => {
  describe('checkHealth', () => {
    it('should return health status with all components', async () => {
      const status = await healthService.checkHealth();
      
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('timestamp');
      expect(status).toHaveProperty('services');
      expect(status).toHaveProperty('system');
      
      expect(status.system).toHaveProperty('cpuUsage');
      expect(status.system).toHaveProperty('memoryUsage');
      expect(status.system).toHaveProperty('uptime');
      expect(status.system).toHaveProperty('loadAverage');
    });

    it('should mark status as unhealthy when a service fails', async () => {
      // Mock a service failure
      jest.spyOn(healthService as any, 'checkDatabase').mockRejectedValueOnce(new Error('DB Error'));
      
      const status = await healthService.checkHealth();
      expect(status.status).toBe('unhealthy');
    });
  });
}); 