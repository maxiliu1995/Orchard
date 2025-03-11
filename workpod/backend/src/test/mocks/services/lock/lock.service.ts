import { mockTTLock } from './ttlock.mock';
import { LockService as BaseLockService } from '@/core/locks/types/lock.types';

export class LockService extends BaseLockService {
  constructor() {
    super(mockTTLock);
  }

  async lock(lockId: string): Promise<boolean> {
    return mockTTLock.lockDevice(lockId);
  }

  async unlock(lockId: string): Promise<boolean> {
    return mockTTLock.unlockDevice(lockId);
  }

  async verifyAccess(userId: string, lockId: string): Promise<boolean> {
    // Add verification logic
    return true;
  }
} 