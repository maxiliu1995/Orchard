import { describe, it, expect, beforeEach } from '@jest/globals';
import { prisma } from '../../setup/database';
import { cleanup } from '../../setup/utils/db/database.utils';
import { userService } from '../../../core/users/services/userService';
import { NotFoundError } from '../../../shared/errors/appError';

describe('UserService', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User'
  };

  beforeEach(async () => {
    await cleanup();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user = await prisma.user.create({
        data: testUser
      });

      const profile = await userService.getProfile(user.id);
      expect(profile.email).toBe(testUser.email);
      expect(profile.firstName).toBe(testUser.firstName);
      expect(profile).not.toHaveProperty('password');
    });

    it('should throw error for non-existent user', async () => {
      await expect(userService.getProfile('non-existent-id'))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const user = await prisma.user.create({
        data: testUser
      });

      const updates = {
        firstName: 'Updated',
        lastName: 'Name',
        phoneNumber: '+9876543210'
      };

      const updated = await userService.updateProfile(user.id, updates);
      expect(updated.firstName).toBe(updates.firstName);
      expect(updated.lastName).toBe(updates.lastName);
    });

    it('should reject invalid update fields', async () => {
      const user = await prisma.user.create({
        data: testUser
      });

      await expect(userService.updateProfile(user.id, {
        invalidField: 'value'
      } as any)).rejects.toThrow();
    });
  });

  describe('getBookingHistory', () => {
    it('should return user booking history', async () => {
      const user = await prisma.user.create({
        data: testUser
      });

      const pod = await prisma.workPod.create({
        data: {
          name: 'Test Pod',
          status: 'AVAILABLE',
          hourlyRate: 10,
          latitude: 37.7749,
          longitude: -122.4194,
          address: '123 Test St',
          lockId: 'test-lock-id'
        }
      });

      await prisma.booking.create({
        data: {
          userId: user.id,
          workPodId: pod.id,
          startTime: new Date(),
          endTime: new Date(Date.now() + 3600000),
          status: 'CONFIRMED',
          totalAmount: 1000
        }
      });

      const bookings = await userService.getBookingHistory(user.id);
      expect(bookings).toHaveLength(1);
      expect(bookings[0].userId).toBe(user.id);
    });
  });

  describe('deleteAccount', () => {
    it('should delete user account', async () => {
      const user = await prisma.user.create({
        data: testUser
      });

      await userService.deleteAccount(user.id);

      const deleted = await prisma.user.findUnique({
        where: { id: user.id }
      });
      expect(deleted).toBeNull();
    });

    it('should throw error for non-existent user', async () => {
      await expect(userService.deleteAccount('non-existent-id'))
        .rejects
        .toThrow(NotFoundError);
    });
  });
}); 