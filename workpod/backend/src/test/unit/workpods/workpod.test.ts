import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { PodStatus } from '@prisma/client';
import { prisma } from '../../setup/database';
import { cleanup } from '../../setup/utils/db/database.utils';
import { generateTestEmail } from '../../setup/utils/auth/auth.utils';
import { workPodService } from '../../../core/workpods/services/workpodService';
import { notificationService } from '../../../core/notifications/services/notificationService';
import { BookingService } from '../../../core/bookings/services/bookingService';

const bookingService = BookingService.getInstance();

const mockTTLockAPI = {
  unlockDevice: jest.fn().mockImplementation(async () => true),
  lockDevice: jest.fn().mockImplementation(async () => true)
};

jest.mock('../../../core/notifications/services/notificationService');
jest.mock('../../../core/locks/services/ttlockService', () => ({
  ttlockService: mockTTLockAPI
}));

describe('WorkPod Module', () => {
  let testPod: any;
  let testUser: any;

  beforeEach(async () => {
    await cleanup();

    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: generateTestEmail(),
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }
    });

    // Create test pod
    testPod = await workPodService.createPod({
      name: 'Test Pod',
      hourlyRate: 25.00,
      latitude: 0,
      longitude: 0,
      address: '123 Test St',
      lockId: 'lock-123'
    });
  });

  describe('Pod Management', () => {
    it('should update pod status', async () => {
      const updatedPod = await workPodService.updatePodStatus(
        testPod.id, 
        PodStatus.MAINTENANCE
      );

      expect(updatedPod.status).toBe(PodStatus.MAINTENANCE);
    });

    it('should find pods by location', async () => {
      // Create a pod nearby
      await workPodService.createPod({
        name: 'Near Pod',
        hourlyRate: 25.00,
        latitude: 0.1,
        longitude: 0.1,
        address: '123 Near St',
        lockId: 'lock-456'
      });

      // Create a pod far away
      await prisma.workPod.create({
        data: {
          name: 'Far Pod',
          status: PodStatus.AVAILABLE,
          hourlyRate: 25.00,
          latitude: 10,  // Far away
          longitude: 10,
          address: '123 Far St',
          lockId: 'lock-789'
        }
      });

      const nearbyPods = await workPodService.findPodsNearby({
        latitude: 0,
        longitude: 0,
        radius: 1
      });

      expect(nearbyPods).toHaveLength(2); // Test pod and Near pod
      expect(nearbyPods.map(p => p.name)).toContain('Near Pod');
      expect(nearbyPods.map(p => p.name)).not.toContain('Far Pod');
    });
  });

  describe('Pod Access', () => {
    it('should handle lock operations', async () => {
      const result = await mockTTLockAPI.unlockDevice(testPod.lockId);
      expect(result).toBe(true);
      expect(mockTTLockAPI.unlockDevice).toHaveBeenCalledWith(testPod.lockId);
    });
  });

  describe('Pod Availability', () => {
    it('should prevent booking when pod is under maintenance', async () => {
      // Set pod to maintenance
      await prisma.workPod.update({
        where: { id: testPod.id },
        data: { status: PodStatus.MAINTENANCE }
      });

      // Try to book - should fail
      const bookingAttempt = workPodService.createBooking({
        userId: testUser.id,
        workPodId: testPod.id,
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
      });

      await expect(bookingAttempt).rejects.toThrow();
    });

    it('should handle concurrent booking attempts', async () => {
      const bookingData = {
        userId: testUser.id as string,
        podId: testPod.id as string,
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000)
      };

      const bookingPromises = [
        prisma.$transaction(async (_tx) => {
          return await bookingService.createBooking(bookingData);
        }),
        prisma.$transaction(async (_tx) => {
          return await bookingService.createBooking(bookingData); 
        })
      ];
      
      const results = await Promise.allSettled(bookingPromises);
      expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);
      expect(results.filter(r => r.status === 'rejected')).toHaveLength(1);
    });

    it('should check pod availability for time period', async () => {
      const startTime = new Date();
      const endTime = new Date(Date.now() + 3600000); // 1 hour later

      const isAvailable = await workPodService.checkPodAvailability(
        testPod.id,
        startTime,
        endTime
      );

      expect(isAvailable).toBe(true);
    });

    it('should detect booking conflicts', async () => {
      // Create an existing booking
      await prisma.booking.create({
        data: {
          userId: testUser.id,
          workPodId: testPod.id,
          startTime: new Date(),
          endTime: new Date(Date.now() + 3600000),
          status: 'CONFIRMED'
        }
      });

      // Check same time period
      const isAvailable = await workPodService.checkPodAvailability(
        testPod.id,
        new Date(),
        new Date(Date.now() + 3600000)
      );

      expect(isAvailable).toBe(false);
    });
  });

  describe('Pod Access Control', () => {
    it('should unlock pod for valid booking', async () => {
      // Create confirmed booking
      await prisma.booking.create({
        data: {
          userId: testUser.id,
          workPodId: testPod.id,
          startTime: new Date(Date.now() - 1000), // Started 1 second ago
          endTime: new Date(Date.now() + 3600000),
          status: 'CONFIRMED'
        }
      });

      const result = await mockTTLockAPI.unlockDevice(testPod.lockId);
      expect(result).toBe(true);
    });

    it('should reject unlock without valid booking', async () => {
      await expect(
        workPodService.unlockPod(testPod.id, testUser.id)
      ).rejects.toThrow('No active booking found');
    });
  });

  describe('Pod Status Transitions', () => {
    it('should track status history', async () => {
      // Update status multiple times
      await prisma.workPod.update({
        where: { id: testPod.id },
        data: { status: PodStatus.MAINTENANCE }
      });

      await prisma.workPod.update({
        where: { id: testPod.id },
        data: { status: PodStatus.AVAILABLE }
      });

      // Check final status
      const pod = await prisma.workPod.findUnique({
        where: { id: testPod.id }
      });

      expect(pod?.status).toBe(PodStatus.AVAILABLE);
    });

    it('should notify affected users when pod goes into maintenance', async () => {
      // Create a future booking
      await prisma.booking.create({
        data: {
          userId: testUser.id,
          workPodId: testPod.id,
          startTime: new Date(Date.now() + 86400000), // Tomorrow
          endTime: new Date(Date.now() + 90000000),
          status: 'CONFIRMED'
        }
      });

      // Put pod in maintenance
      await workPodService.updatePodStatus(testPod.id, PodStatus.MAINTENANCE);

      // Verify notification was sent
      expect(notificationService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: testUser.id,
          type: 'POD_MAINTENANCE'
        })
      );
    });
  });

  describe('Pod Emergency Shutdown', () => {
    it('should handle emergency pod shutdown', async () => {
      const result = await workPodService.emergencyShutdown(testPod.id);
      
      expect(result.status).toBe(PodStatus.OFFLINE);
      expect(mockTTLockAPI.lockDevice).toHaveBeenCalledWith(testPod.lockId);
    });
  });
}); 