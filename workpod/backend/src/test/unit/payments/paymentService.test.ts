// Third-party imports
import { BookingStatus, PodStatus } from '@prisma/client';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Core services
import { PaymentService } from '../../../core/payments/services/paymentService';

// Test utilities
import { prisma } from '../../setup/database';
import { cleanup, CleanupScope } from '../../setup/utils/db/database.utils';

// Mock setup
jest.mock('../../../shared/integrations/stripe', () => ({
  stripe: {
    paymentIntents: {
      create: jest.fn().mockImplementation(async () => ({
        id: 'pi_test_123',
        clientSecret: 'secret_123',
        amount: 2500,
        status: 'succeeded',
        metadata: { bookingId: 'test-booking-id' }
      })),
      cancel: jest.fn().mockImplementation(async () => ({
        id: 'ref_test_123',
        status: 'succeeded'
      }))
    },
    refunds: {
      create: jest.fn().mockImplementation(async () => ({
        id: 'ref_test_123',
        status: 'succeeded'
      }))
    }
  }
}));

jest.mock('../../../shared/notifications/services/notificationService');

describe('PaymentService', () => {
  let paymentService: PaymentService;

  const testUser = {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'Password123!'
  };

  const testWorkPod = {
    name: 'Test Pod',
    latitude: 37.7749,
    longitude: -122.4194,
    address: '123 Test St',
    hourlyRate: 25,
    status: 'AVAILABLE' as PodStatus,
    lockId: 'test-lock-123'
  };

  const testBooking = {
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000),
    status: 'PENDING' as BookingStatus,
    totalAmount: 25
  };

  beforeEach(async () => {
    await cleanup(CleanupScope.ALL);
    await prisma.booking.deleteMany();
    await prisma.workPod.deleteMany();
    await prisma.user.deleteMany();
    paymentService = new PaymentService();
    jest.clearAllMocks();
  });

  describe('createPaymentIntent', () => {
    it('should create payment intent for booking', async () => {
      const user = await prisma.user.create({ data: testUser });
      const pod = await prisma.workPod.create({ data: testWorkPod });
      const booking = await prisma.booking.create({
        data: {
          ...testBooking,
          userId: user.id,
          workPodId: pod.id
        }
      });

      const paymentIntent = await paymentService.createPaymentIntent({
        bookingId: booking.id,
        amount: Number(booking.totalAmount),
        currency: 'usd',
        userId: user.id
      });

      expect(paymentIntent).toHaveProperty('id');
      expect(paymentIntent).toHaveProperty('clientSecret');
      expect(paymentIntent.amount).toBe(Number(booking.totalAmount) * 100);
    });

    it('should throw error if booking not found', async () => {
      await expect(paymentService.createPaymentIntent({
        bookingId: 'non-existent',
        amount: 1000,
        currency: 'usd',
        userId: 'test-user'
      })).rejects.toThrow('Booking not found');
    });
  });

  describe('handlePaymentSuccess', () => {
    it('should confirm booking on successful payment', async () => {
      const user = await prisma.user.create({ data: testUser });
      const pod = await prisma.workPod.create({ data: testWorkPod });
      const booking = await prisma.booking.create({
        data: {
          ...testBooking,
          userId: user.id,
          workPodId: pod.id
        }
      });

      const mockPaymentIntent = {
        id: 'pi_test_123',
        status: 'succeeded',
        metadata: {
          bookingId: booking.id
        }
      };

      await paymentService.handlePaymentSuccess(mockPaymentIntent);

      const updatedBooking = await prisma.booking.findUnique({
        where: { id: booking.id }
      });
      expect(updatedBooking?.status).toBe('CONFIRMED');
    });
  });

  describe('handlePaymentFailure', () => {
    it('should cancel booking on payment failure', async () => {
      const user = await prisma.user.create({ data: testUser });
      const pod = await prisma.workPod.create({ data: testWorkPod });
      const booking = await prisma.booking.create({
        data: {
          ...testBooking,
          userId: user.id,
          workPodId: pod.id
        }
      });

      await paymentService.handlePaymentFailure({
        metadata: {
          bookingId: booking.id
        }
      });

      const updatedBooking = await prisma.booking.findUnique({
        where: { id: booking.id }
      });
      expect(updatedBooking?.status).toBe('FAILED');
    });
  });

  describe('refundPayment', () => {
    it('should process refund for booking', async () => {
      const user = await prisma.user.create({ data: testUser });
      const pod = await prisma.workPod.create({ data: testWorkPod });
      const booking = await prisma.booking.create({
        data: {
          ...testBooking,
          userId: user.id,
          workPodId: pod.id,
          status: 'CONFIRMED'
        }
      });

      const refund = await paymentService.refundPayment(booking.id);
      expect(refund).toHaveProperty('id');
      expect(refund.status).toBe('succeeded');
    });
  });
}); 