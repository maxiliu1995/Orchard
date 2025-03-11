import { HealthService } from './healthService';
import { ttlockService } from '../../locks/services/ttLockService';

// Export type
export { HealthService } from './healthService';

// Export singleton instance
export const healthService = new HealthService(ttlockService); 