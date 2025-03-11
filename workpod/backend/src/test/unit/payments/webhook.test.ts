// Third-party imports
import { jest, describe, it, expect, beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';
import request from 'supertest';
import { BookingStatus } from '@prisma/client';

// App imports
import app from '../../../app';

// Core services
import { BookingService } from '../../../core/bookings/services';

// Error handling
import { WebhookError } from '../../../shared/errors/webhookError';

// Test utilities
import { testPrisma as prisma, setupTestDatabase, cleanDatabase, withTestTransaction } from '../../setup/database';
import { logger } from '../../../shared/logger';
import { mockTTLock } from '../../mocks/services/lock/ttlock.mock';
import { mockStripe } from '../../mocks/services/payment/stripe.mock';

// Mock setup
jest.mock('../../mocks/stripe', () => ({
  mockStripe: {
    webhooks: {
      constructEvent: jest.fn().mockImplementation((body, signature) => {
        logger.info('Stripe webhook event construction', { 
          body: typeof body === 'string' ? JSON.parse(body) : body,
          signature 
        });
        
        if (!signature || signature === 'invalid_signature') {
          throw new WebhookError('Webhook Error');
        }
        
        return typeof body === 'string' ? JSON.parse(body) : body;
      })
    }
  }
}));

// Mock BookingService
jest.mock('@/core/bookings/services', () => ({
  BookingService: {
    getInstance: () => ({
      updateBookingStatus: jest.fn().mockImplementation(
        async (paymentIntentId: string, status: BookingStatus) => {
          logger.info('Updating booking status', { paymentIntentId, status });
          
          const booking = await prisma.booking.update({
            where: { paymentIntentId },
            data: { status }
          });

          logger.info('Booking status updated', { id: booking.id, status: booking.status });
          return booking;
        }
      )
    })
  }
}));

describe('Payment Webhook Endpoints', () => {
  let testBooking: any;
  let server: any;
  const testPort = 3001;

  beforeAll(async () => {
    await setupTestDatabase();
    server = app.listen(testPort);
  });

  beforeEach(async () => {
    await cleanDatabase();
    
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      }
    });

    const testPod = await prisma.workPod.create({
      data: {
        name: 'Test Pod',
        address: 'Test Location',
        status: 'AVAILABLE',
        hourlyRate: 25.00,
        latitude: 0,
        longitude: 0,
        lockId: 'test-lock-id'
      }
    });

    testBooking = await prisma.booking.create({
      data: {
        userId: testUser.id,
        workPodId: testPod.id,
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        status: 'PENDING',
        totalAmount: 25.00,
        paymentIntentId: 'pi_test_123'
      }
    });

    mockTTLock.unlockDevice.mockClear();
    mockTTLock.lockDevice.mockClear();
  });

  afterEach(async () => {
    await prisma.booking.deleteMany();
    await prisma.user.deleteMany();
    await prisma.workPod.deleteMany();
  });

  afterAll(async () => {
    server.close();
    await prisma.$disconnect();
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });

  describe('POST /api/webhooks/stripe', () => {
    it('should handle successful payment', async () => {
      await withTestTransaction(async (tx) => {
        console.log('Initial booking:', testBooking);
        
        const response = await request(app)
          .post('/api/webhooks/stripe')
          .set('stripe-signature', 'valid_signature')
          .send({
            type: 'payment_intent.succeeded',
            data: {
              object: {
                id: testBooking.paymentIntentId,
                status: 'succeeded'
              }
            }
          });

        console.log('Webhook response:', response.body);
        
        const finalBooking = await tx.booking.findUnique({
          where: { id: testBooking.id }
        });
        
        console.log('Final booking state:', finalBooking);
        expect(finalBooking?.status).toBe(BookingStatus.CONFIRMED);
      });
    });
  });
}); 