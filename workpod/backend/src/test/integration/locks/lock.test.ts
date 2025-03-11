import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { mockTTLock } from '../../mocks/services/lock/ttlock.mock';
import { LockService } from '../../../core/locks/services/lockService';
import { resetMocks } from '../../setup/utils';
import { prisma } from '../../setup/database';

describe('Lock Integration', () => {
  let lockService: LockService;

  beforeEach(() => {
    resetMocks();
    lockService = new LockService(mockTTLock);
  });

  describe('Access Code Lifecycle', () => {
    // ... existing tests ...
  });

  describe('Access Verification', () => {
    // ... existing tests ...
  });
}); 