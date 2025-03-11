// Third-party imports
import { PodStatus, BookingStatus } from '@prisma/client';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Core services
import { LockService } from '../../../core/locks/services/lockService';
import { ttlockService } from '../../../core/locks/services/ttLockService';

// Types
import { AccessCode } from '../../../core/locks/types/lock.types';

// Error handling
import { AppError } from '../../../shared/errors/appError';

// Test utilities
import { prisma } from '../../setup/database';
import { cleanup } from '../../setup/utils/db/database.utils';
import { CleanupScope } from '../../setup/utils/db/types';
import { createTestPod, createTestBooking } from '../../setup/utils/pod/pod.utils';

// Mock setup
jest.mock('../../../core/locks/services/ttlockService', () => ({
  ttlockService: {
    unlockDevice: jest.fn().mockImplementation(async (...args: any[]): Promise<boolean> => true),
    lockDevice: jest.fn().mockImplementation(async (...args: any[]): Promise<boolean> => true),
    generateAccessCode: jest.fn().mockImplementation(async (...args: any[]): Promise<AccessCode> => ({
      code: '123456',
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }))
  }
}));

describe('LockService', () => {
  let lockService: LockService;
  let podId: string;
  let bookingId: string;

  const testWorkPod = {
    name: 'Test Pod',
    status: 'AVAILABLE' as PodStatus,
    hourlyRate: 10,
    latitude: 37.7749,
    longitude: -122.4194,
    address: '123 Test St',
    lockId: 'test-lock-id'
  };

  beforeEach(async () => {
    await cleanup();
    
    const testUser = await prisma.user.create({
      data: {
        id: 'test-id',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }
    });

    const pod = await createTestPod();
    const booking = await createTestBooking(testUser.id, pod.id, {
      status: BookingStatus.CONFIRMED
    });
    
    podId = pod.id;
    bookingId = booking.id;
    lockService = LockService.getInstance();
    jest.clearAllMocks();
  });

  describe('generateAccessCode', () => {
    it('should generate access code for valid booking', async () => {
      const result = await lockService.generateAccessCode(bookingId);
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('expiresAt');
    });

    it('should throw error for invalid booking', async () => {
      await expect(lockService.generateAccessCode('invalid-id'))
        .rejects.toThrow(AppError);
    });
  });

  describe('validateAccessCode', () => {
    it('should validate correct access code', async () => {
      const { code } = await lockService.generateAccessCode(bookingId);
      const result = await lockService.validateAccessCode(podId, code);
      expect(result).toBe(true);
    });

    it('should reject invalid access code', async () => {
      await expect(lockService.validateAccessCode(podId, 'invalid-code'))
        .rejects.toThrow(AppError);
    });
  });

  describe('unlockByBookingId', () => {
    it('should unlock pod for valid booking', async () => {
      await prisma.booking.deleteMany();  // Delete bookings first
      await prisma.user.deleteMany();     // Then users
      const pod = await prisma.workPod.create({ data: testWorkPod });
      const user = await prisma.user.create({
        data: {
          id: 'test-user',
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        }
      });
      
      const booking = await prisma.booking.create({
        data: {
          userId: user.id,
          workPodId: pod.id,
          startTime: new Date(),
          endTime: new Date(Date.now() + 3600000),
          status: BookingStatus.CONFIRMED,  // Use enum instead of string literal
          totalAmount: 1000
        }
      });

      await lockService.unlockByBookingId(pod.id, booking.id);
      expect(ttlockService.unlockDevice).toHaveBeenCalledWith(pod.lockId);
    });

    it('should throw error without active booking', async () => {
      const pod = await prisma.workPod.create({ data: testWorkPod });

      await expect(lockService.unlockByBookingId(pod.id, 'invalid-booking-id'))
        .rejects
        .toThrow('No active booking found');
    });
  });

  describe('lock', () => {
    it('should lock pod after session ends', async () => {
      const pod = await prisma.workPod.create({ data: testWorkPod });
      
      await lockService.lock(pod.id);
      
      expect(ttlockService.lockDevice).toHaveBeenCalledWith(pod.lockId);
    });
  });
}); 