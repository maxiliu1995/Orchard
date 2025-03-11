// Third-party imports
import request from 'supertest';
import { BookingStatus, PodStatus } from '@prisma/client';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Core services
import { podService } from '../../../core/pods/services/podService';
import { paymentService } from '../../../core/payments/services/paymentService';

// App imports
import app from '../../../app';

// Test utilities
import { prisma } from '../../setup/database';
import { cleanup } from '../../setup/utils/db/database.utils';
import { generateTestEmail, hashPassword } from '../../setup/utils/auth/auth.utils';
import { testContext } from '../../setup/context';
import { tokenService } from '../../../shared/utils/token';

// Before mock implementation
interface TTLockAPI {
  unlockDevice: jest.MockedFunction<(lockId: string) => Promise<boolean>>;
  lockDevice: jest.MockedFunction<(lockId: string) => Promise<boolean>>;
  getDeviceStatus: jest.MockedFunction<(lockId: string) => Promise<string>>;
}

const mockTtlockAPI = {
  unlockDevice: jest.fn<(lockId: string) => Promise<boolean>>().mockImplementation(
    async (lockId: string) => true
  ),
  lockDevice: jest.fn<(lockId: string) => Promise<boolean>>().mockImplementation(
    async (lockId: string) => true
  ),
  getDeviceStatus: jest.fn<(lockId: string) => Promise<string>>().mockImplementation(
    async (lockId: string) => 'LOCKED'
  )
} as TTLockAPI;

describe('Booking Module', () => {
  let authToken: string;
  let testUser: any;
  let testPod: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    await cleanup();
    
    // Create test data in correct order
    testUser = await prisma.user.create({
      data: {
        email: generateTestEmail(),
        password: await hashPassword('Password123!'),
        firstName: 'Test',
        lastName: 'User'
      }
    });

    // Generate valid auth token
    const { accessToken } = tokenService.generateTokenPair(testUser.id);
    authToken = accessToken;

    // Create test pod after user
    testPod = await prisma.workPod.create({
      data: {
        name: 'Test Pod',
        address: 'Test Location',
        latitude: 51.5074,
        longitude: -0.1278,
        status: PodStatus.AVAILABLE,
        hourlyRate: 25.00,
        lockId: 'test-lock-id'
      }
    });

    testContext.setUserId(testUser.id);
  });

  // ... rest of test cases that use authToken for authentication

  describe('Pod Access Control', () => {
    it('should unlock pod when user slides to open', async () => {
      // Create an active booking first
      const booking = await prisma.booking.create({
        data: {
          userId: testUser.id,
          workPodId: testPod.id,
          startTime: new Date(),
          endTime: new Date(Date.now() + 3600000),
          status: BookingStatus.CONFIRMED,
          totalAmount: testPod.hourlyRate
        }
      });

      const res = await request(app)
        .post(`/api/bookings/${booking.id}/unlock`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(mockTtlockAPI.unlockDevice).toHaveBeenCalledWith(testPod.lockId);
    }, 10000);
  });

  describe('Booking CRUD Operations', () => {
    it('should create a new booking', async () => {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 3600000);
      const bookingData = {
        podId: testPod.id,
        startTime: now.toISOString(),
        endTime: oneHourLater.toISOString()
      };

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookingData)
        .expect(201);

      expect(res.body.booking).toHaveProperty('id');
      expect(res.body.booking.userId).toBe(testUser.id);
      expect(res.body.booking.workPodId).toBe(testPod.id);
    });

    it('should list user bookings', async () => {
      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should cancel a booking', async () => {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 3600000);
      const booking = await prisma.booking.create({
        data: {
          userId: testUser.id,
          workPodId: testPod.id,
          startTime: now,
          endTime: oneHourLater,
          status: BookingStatus.CONFIRMED,
          totalAmount: testPod.hourlyRate
        }
      });

      const res = await request(app)
        .post(`/api/bookings/${booking.id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.status).toBe(BookingStatus.CANCELLED);
    });

    it('should create a booking with payment intent', async () => {
      const startTime = new Date();
      startTime.setSeconds(0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          podId: testPod.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        })
        .expect(201);

      // Check for payment intent
      expect(res.body).toHaveProperty('booking');
      expect(res.body).toHaveProperty('clientSecret');
      expect(res.body.booking.status).toBe('PENDING');
    });
  });

  describe('Booking Validation', () => {
    it('should not allow booking duration over 24 hours', async () => {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + (25 * 60 * 60 * 1000)); // 25 hours

      const bookingData = {
        podId: testPod.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      };

      await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookingData)
        .expect(400)
        .expect(res => {
          expect(res.body.message).toBe('Booking duration cannot exceed 24 hours');
        });
    });

    it('should not allow booking a pod that is not available', async () => {
      // First make pod unavailable
      await prisma.workPod.update({
        where: { id: testPod.id },
        data: { status: PodStatus.OCCUPIED }
      });

      const bookingData = {
        podId: testPod.id,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString()
      };

      await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookingData)
        .expect(400);
    });

    it('should validate end time is after start time', async () => {
      const startTime = new Date();
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() - 1); // End time before start time

      await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          podId: testPod.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        })
        .expect(400)
        .expect(res => {
          expect(res.body.message).toBe('End time must be after start time');
        });
    });
  });
});