import request from 'supertest';
import type { Stripe } from 'stripe';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { PodStatus, WorkPod } from '@prisma/client';
import { prisma } from '../../setup/database';
import { cleanup } from '../../setup/utils/db/database.utils';
import { createTestUser } from '../../setup/utils/auth/auth.utils';
import { testContext } from '../../setup/context';
import { mockTokenService } from '../../mocks/utils/token.mock';
import app from '../../../app';
import { podService } from '../../../core/pods/services/podService';
import { ttlockService } from '../../../core/locks/services/ttLockService';
import { stripeService as stripe } from '../../../core/payments/services/stripeService';

jest.mock('../../../core/payments/services/stripeService', () => ({
  stripeService: {
    stripe: {
      paymentIntents: {
        create: mockCreate
      }
    }
  }
}));

const mockCreate = jest.fn().mockImplementation(() => 
  Promise.resolve({
    id: 'pi_test_123',
    client_secret: 'test_secret_123',
    lastResponse: {
      headers: {},
      requestId: 'req_123',
      statusCode: 200
    }
  } as Stripe.Response<Stripe.PaymentIntent>)
);

describe('Pod Endpoints', () => {
  let authToken: string;
  let testUser: { user: { id: string }, token: string };
  let testPod: WorkPod;

  beforeEach(async () => {
    await cleanup();

    // Create test user and get token
    testUser = await createTestUser();
    authToken = testUser.token;  // This already includes 'Bearer mock-valid-token-{userId}'

    // Create test pod
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

    // Clear all mocks before each test
    mockCreate.mockClear();

    testContext.setUserId(testUser.user.id);

    // Mock auth middleware
    jest.spyOn(mockTokenService, 'verifyToken')
      .mockResolvedValue({ userId: testUser.user.id });
  });

  describe('GET /api/pods/available', () => {
    it('should list available pods', async () => {
      const res = await request(app)
        .get('/api/pods/available')
        .query({
          latitude: 51.5074,
          longitude: -0.1278,
          radius: 5
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('POST /api/pods/book', () => {
    it('should create a booking with payment intent', async () => {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 3600000);

      const res = await request(app)
        .post('/api/pods/book')
        .set('Authorization', authToken)
        .send({
          podId: testPod.id,
          userId: testUser.user.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        });

      expect(res.status).toBe(201);
      expect(res.body.booking).toHaveProperty('status', 'PENDING');
      expect(res.body.booking).toHaveProperty('totalAmount', '25');
      expect(res.body.booking).toHaveProperty('paymentIntentId', 'pi_test_123');
      expect(res.body).toHaveProperty('clientSecret', 'test_secret_123');
    });

    it('should reject booking without auth token', async () => {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 3600000);

      const res = await request(app)
        .post('/api/pods/book')
        .send({
          podId: testPod.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'User not authenticated');
    });

    it('should reject invalid pod ID', async () => {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 3600000);

      const res = await request(app)
        .post('/api/pods/book')
        .set('Authorization', authToken)
        .send({
          podId: 'invalid-uuid',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Pod not found');
    });

    it('should reject booking when end time is before start time', async () => {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() - 3600000); // 1 hour before

      const res = await request(app)
        .post('/api/pods/book')
        .set('Authorization', authToken)
        .send({
          podId: testPod.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'End time must be after start time');
    });

    it('should reject booking when pod is not available', async () => {
      // First make pod unavailable
      await prisma.workPod.update({
        where: { id: testPod.id },
        data: { status: 'OCCUPIED' }
      });

      const response = await request(app)
        .post('/api/pods/book')
        .set('Authorization', authToken)
        .send({
          podId: testPod.id,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString()
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Pod not available');
    });
  });
});

describe('Pod Module', () => {
  let testUser: any;
  let testPod: WorkPod;

  beforeEach(async () => {
    await cleanup();

    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User'
      }
    });

    // Create test pod
    testPod = await podService.createPod({
      name: 'Test Pod',
      latitude: 51.5074,
      longitude: -0.1278,
      address: '123 Test St',
      hourlyRate: 25.0,
      status: PodStatus.AVAILABLE,
      lockId: 'test-lock-123'
    });

    jest.clearAllMocks();

    testContext.setUserId(testUser.id);
  });

  describe('Pod Management', () => {
    it('should create a new pod', async () => {
      const podData = {
        name: 'Test Pod',
        latitude: 51.5074,
        longitude: -0.1278,
        address: '123 Test St',
        hourlyRate: 25.0,
        status: PodStatus.AVAILABLE,
        lockId: 'test-lock-123'
      };

      const pod = await podService.createPod(podData);

      expect(pod).toHaveProperty('id');
      expect(pod.name).toBe(podData.name);
      expect(pod.status).toBe(podData.status);
    });

    it('should find nearby pods', async () => {
      const query = {
        minLat: 51.5,
        maxLat: 51.6,
        minLng: -0.2,
        maxLng: -0.1
      };

      const pods = await podService.findNearbyPods(query);
      expect(Array.isArray(pods)).toBe(true);
    });
  });

  describe('Pod Access Control', () => {
    it('should unlock pod for valid booking', async () => {
      // Create active booking first
      await prisma.booking.create({
        data: {
          userId: testUser.id,
          workPodId: testPod.id,
          startTime: new Date(),
          endTime: new Date(Date.now() + 3600000),
          status: 'CONFIRMED',
          totalAmount: 25.0
        }
      });

      jest.spyOn(ttlockService, 'unlockPod').mockResolvedValue(undefined);

      await expect(
        podService.unlockPod(testPod.id, testUser.id)
      ).resolves.not.toThrow();

      expect(ttlockService.unlockPod).toHaveBeenCalledWith(testPod.id);
    });

    it('should lock pod for valid booking', async () => {
      // Create active booking first
      await prisma.booking.create({
        data: {
          userId: testUser.id,
          workPodId: testPod.id,
          startTime: new Date(),
          endTime: new Date(Date.now() + 3600000),
          status: 'CONFIRMED',
          totalAmount: 25.0
        }
      });

      jest.spyOn(ttlockService, 'lockPod').mockResolvedValue(undefined);

      await expect(
        podService.lockPod(testPod.id, testUser.id)
      ).resolves.not.toThrow();

      expect(ttlockService.lockPod).toHaveBeenCalledWith(testPod.id);
    });

    it('should reject unlock for invalid booking', async () => {
      await expect(
        podService.unlockPod(testPod.id, 'wrong-user')
      ).rejects.toThrow('No active booking found');
    });

    it('should validate booking status before unlock', async () => {
      // Create a booking first
      const booking = await prisma.booking.create({
        data: {
          userId: testUser.id,
          workPodId: testPod.id,
          startTime: new Date(),
          endTime: new Date(Date.now() + 3600000),
          status: 'CONFIRMED',
          totalAmount: 25.0
        }
      });

      // Then update it to cancelled
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'CANCELLED' }
      });

      await expect(
        podService.unlockPod(testPod.id, booking.userId)
      ).rejects.toThrow('No active booking found');
    });
  });
}); 