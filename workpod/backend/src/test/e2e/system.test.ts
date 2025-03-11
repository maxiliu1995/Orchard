import { describe, it, expect, beforeAll, beforeEach, afterAll, jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../../app';  // Fix path to src/app
import { cleanup, CleanupScope } from '../setup';  // Import from test setup
import { mockStripe as stripe } from '../mocks/services/payment/stripe.mock';
import { mockTTLock as ttlockAPI } from '../mocks/services/lock/ttlock.mock';
import { mockNotificationService as notificationService } from '../mocks/services/notification/notification.mock';
import Stripe from 'stripe';

jest.mock('@/shared/integrations/stripe');
jest.mock('@/shared/integrations/ttlock');
jest.mock('@/core/notifications/services/notificationService');

describe('WorkPod System E2E', () => {
  const prisma = new PrismaClient();
  let authToken: string;
  let userId: string;
  let podId: string;
  let bookingId: string;

  beforeAll(async () => {
    // Mock external services
    (stripe.paymentIntents.create as jest.MockedFunction<typeof stripe.paymentIntents.create>)
      .mockResolvedValue({
        id: 'pi_test',
        client_secret: 'secret_test',
        status: 'succeeded'
      } as Stripe.Response<Stripe.PaymentIntent>);

    (ttlockAPI.unlockDevice as jest.MockedFunction<typeof ttlockAPI.unlockDevice>)
      .mockResolvedValue(true);

    (notificationService.send as jest.MockedFunction<typeof notificationService.send>)
      .mockResolvedValue(true);
  });

  beforeEach(async () => {
    await cleanup(CleanupScope.ALL);
    
    // Create test pod
    const pod = await prisma.workPod.create({
      data: {
        name: 'Test Pod',
        status: 'AVAILABLE',
        hourlyRate: 25.00,
        latitude: 51.5074,
        longitude: -0.1278,
        address: 'Test Location',
        lockId: 'test-lock-id'
      }
    });
    podId = pod.id;
  });

  it('should complete full booking flow successfully', async () => {
    // 1. User Registration
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      })
      .expect(201);

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;

    // 2. Search for pods
    const searchResponse = await request(app)
      .get('/api/pods/search')
      .query({
        latitude: 51.5074,
        longitude: -0.1278,
        radius: 5
      })
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(searchResponse.body).toHaveLength(1);
    expect(searchResponse.body[0].id).toBe(podId);

    // 3. Create booking
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000)); // 2 hours

    const bookingResponse = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        podId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      })
      .expect(201);

    bookingId = bookingResponse.body.id;
    expect(bookingResponse.body.status).toBe('PENDING');

    // 4. Process payment
    const paymentResponse = await request(app)
      .post(`/api/payments/process`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        bookingId,
        paymentMethodId: 'pm_test'
      })
      .expect(200);

    expect(paymentResponse.body.status).toBe('COMPLETED');

    // 5. Verify booking confirmed
    const bookingCheck = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(bookingCheck.body.status).toBe('CONFIRMED');

    // 6. Unlock pod
    const unlockResponse = await request(app)
      .post(`/api/bookings/${bookingId}/unlock`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(unlockResponse.body.success).toBe(true);
    expect(ttlockAPI.unlockDevice).toHaveBeenCalledWith('test-lock-id');

    // 7. End booking
    const endResponse = await request(app)
      .post(`/api/bookings/${bookingId}/end`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(endResponse.body.status).toBe('COMPLETED');

    // 8. Verify notifications
    expect(notificationService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        type: 'BOOKING_CONFIRMED'
      })
    );
  });

  it('should handle booking validation failures', async () => {
    // First register user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test2@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      })
      .expect(201);

    const authToken = registerResponse.body.token;

    // Try to book with invalid duration (> 24 hours)
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (25 * 60 * 60 * 1000)); // 25 hours

    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        podId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toBe('Booking duration cannot exceed 24 hours');
      });
  });

  it('should handle payment failures', async () => {
    // Register and create valid booking first
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test3@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      })
      .expect(201);

    const authToken = registerResponse.body.token;

    // Create booking
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));

    const bookingResponse = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        podId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      })
      .expect(201);

    const bookingId = bookingResponse.body.id;

    // Mock payment failure
    (stripe.paymentIntents.create as jest.MockedFunction<typeof stripe.paymentIntents.create>)
      .mockRejectedValueOnce(new Stripe.errors.StripeError({
        type: 'card_error',
        message: 'Card declined',
        code: 'card_declined'
      }));

    // Attempt payment
    await request(app)
      .post(`/api/payments/process`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        bookingId,
        paymentMethodId: 'pm_test'
      })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toBe('Payment failed: Card declined');
      });

    // Verify booking status is failed
    const bookingCheck = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(bookingCheck.body.status).toBe('FAILED');
  });

  it('should prevent unauthorized pod access', async () => {
    // Register two users
    const user1Response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user1@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      })
      .expect(201);

    const user2Response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user2@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      })
      .expect(201);

    // User 1 creates booking
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));

    const bookingResponse = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${user1Response.body.token}`)
      .send({
        podId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      })
      .expect(201);

    // User 2 tries to unlock User 1's booking
    await request(app)
      .post(`/api/bookings/${bookingResponse.body.id}/unlock`)
      .set('Authorization', `Bearer ${user2Response.body.token}`)
      .expect(403)
      .expect(res => {
        expect(res.body.message).toBe('Not authorized to access this booking');
      });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
}); 