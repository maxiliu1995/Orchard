import { describe, it, expect, jest, beforeEach, beforeAll, afterAll } from '@jest/globals';
import { paymentService } from '../../../core/payments/services';
import { BookingService } from '../../../core/bookings/services';
import {
  prisma,
  cleanDatabase,
  generateTestEmail,
  setupTestDatabase
} from '../../setup/utils/test/test.utils';
import { BookingError, PaymentError } from '../../../shared/errors';
import { mockStripe } from '../../mocks/services/payment/stripe.mock';

const bookingService = BookingService.getInstance();

describe('Payment and Booking Integration', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a booking with payment', async () => {
    // Create test pod
    const pod = await prisma.workPod.create({
      data: {
        id: '1',
        name: 'Test Pod',
        status: 'AVAILABLE',
        hourlyRate: 10,
        latitude: 0,
        longitude: 0,
        address: 'Test Address',
        lockId: 'test-lock-id'
      }
    });

    // Create booking data
    const bookingData = {
      podId: pod.id,
      userId: 'test-user-1',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000)
    };

    // Create booking
    const booking = await bookingService.createBooking(bookingData);
    expect(booking).toBeDefined();
    expect(booking.status).toBe('PENDING');

    // Verify Stripe was called
    expect(mockStripe.paymentIntents.create).toHaveBeenCalled();
  });

  it('should handle payment failure', async () => {
    const pod = await prisma.workPod.create({
      data: {
        id: '2',
        name: 'Test Pod 2',
        status: 'AVAILABLE',
        hourlyRate: 25.00,
        latitude: 0,
        longitude: 0,
        address: 'Test Address 2',
        lockId: 'test-lock-id-2'
      }
    });

    const bookingData = {
      podId: pod.id,
      userId: 'test-user-1',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000)
    };

    await expect(
      bookingService.createBooking(bookingData)
    ).rejects.toThrow(BookingError);
  });

  it('should process payment', async () => {
    // Add test that uses paymentService
    const result = await paymentService.createPaymentIntent({
      amount: 1000,
      currency: 'usd',
      bookingId: 'test-booking',
      userId: 'test-user'
    });
    expect(result).toBeDefined();
  });
}); 