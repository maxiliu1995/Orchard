import { TTLockResponse } from '../types/lock.types';

interface TTLockAPI {
  unlockDevice: (lockId: string) => Promise<boolean>;
  lockDevice: (lockId: string) => Promise<boolean>;
  getDeviceStatus: (lockId: string) => Promise<string>;
}

export const ttlockAPI: TTLockAPI = {
  unlockDevice: jest.fn().mockResolvedValue(true),
  lockDevice: jest.fn().mockResolvedValue(true),
  getDeviceStatus: jest.fn().mockResolvedValue('LOCKED')
}; 