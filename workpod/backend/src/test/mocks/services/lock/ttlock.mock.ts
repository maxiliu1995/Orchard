import { jest } from '@jest/globals';
import { TTLockResponse, TTLock, AccessCode, TTLockService } from '@/core/locks/types/lock.types';

// Mock TTLock API responses
export const mockTTLockAPI = {
  unlockDevice: jest.fn<() => Promise<TTLockResponse>>()
    .mockResolvedValue({ success: true } as TTLockResponse),
  lockDevice: jest.fn<() => Promise<TTLockResponse>>()
    .mockResolvedValue({ success: true } as TTLockResponse)
};

// Mock TTLock service implementation
export const mockTTLockService = {
  unlockDevice: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
  lockDevice: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
  generateAccessCode: jest.fn<() => Promise<AccessCode>>().mockResolvedValue({
    code: '123456',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'ACTIVE'
  }),
  verifyCode: jest.fn<() => Promise<boolean>>().mockResolvedValue(true)
};

// Setup mocks
jest.mock('@/shared/integrations/ttlock', () => ({
  ttlockAPI: mockTTLockAPI,
  ttlockService: mockTTLockService
}));

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Single mockTTLock export with just the interface methods
export const mockTTLock: TTLockService = {
  unlockDevice: jest.fn<(lockId: string) => Promise<boolean>>().mockResolvedValue(true),
  lockDevice: jest.fn<(lockId: string) => Promise<boolean>>().mockResolvedValue(true),
  generateAccessCode: jest.fn<(lockId: string) => Promise<AccessCode>>().mockResolvedValue({
    code: '123456',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'ACTIVE'
  }),
  verifyCode: jest.fn<(lockId: string, code: string) => Promise<boolean>>().mockResolvedValue(true),
  lockPod: jest.fn<(lockId: string) => Promise<boolean>>().mockResolvedValue(true),
  unlockPod: jest.fn<(lockId: string) => Promise<void>>().mockResolvedValue(),
  getLocks: jest.fn<() => Promise<any[]>>().mockResolvedValue([]),
  unlock: jest.fn<(lockId: string) => Promise<void>>().mockResolvedValue()
}; 