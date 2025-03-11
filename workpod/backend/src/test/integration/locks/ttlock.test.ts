import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { mockTTLock } from '../../mocks';
import { resetMocks } from '../../setup/utils';
import type { TTLock, TTLockResponse } from '../../../core/locks/types/lock.types';

describe('TTLock Integration', () => {
  const mockLockId = 'test-lock-123';
  let ttlockAPI: TTLock;

  beforeEach(() => {
    resetMocks();
    ttlockAPI = mockTTLock;
  });

  describe('Basic Lock Operations', () => {
    it('should successfully lock a device', async () => {
      const result = await mockTTLock.lockDevice(mockLockId);
      expect(result.success).toBe(true);
    });

    it('should successfully unlock a device', async () => {
      const result = await mockTTLock.unlockDevice(mockLockId);
      expect(result.success).toBe(true);
    });

    it('should handle empty lock ID', async () => {
      const result = await mockTTLock.lockDevice('');
      expect(result.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      jest.spyOn(mockTTLock, 'lockDevice').mockRejectedValue(new Error('API Error'));
      
      const result = await mockTTLock.lockDevice(mockLockId).catch(() => ({ success: false }));
      expect(result.success).toBe(false);
    });
  });
}); 