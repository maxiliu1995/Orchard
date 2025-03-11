import { describe, it, expect, jest, beforeEach, beforeAll, afterAll } from '@jest/globals';
import { PodStatus } from '@prisma/client';
import { mockStripe as stripe } from '../../mocks/services/payment/stripe.mock';
import { ttlockAPI } from '../../../core/locks/services/ttLockApi';
import { authService } from '../../../core/auth/services';
import { BookingService } from '../../../core/bookings/services';
import { paymentService } from '../../../core/payments/services';
import { notificationService } from '../../../core/notifications/services';
import { BookingError, PaymentError } from '../../../shared/errors';
import { 
  prisma,
  cleanDatabase,
  generateTestEmail,
  setupTestDatabase 
} from '../../setup/utils/test/test.utils';

jest.mock('../../mocks/services/payment/stripe.mock');
jest.mock('../../../core/locks/services/ttLockApi');
jest.mock('../../../core/notifications/services');

describe('Booking Flow Integration', () => {
  let user: any;
  let pod: any;
  let booking: any;
  const bookingService = BookingService.getInstance();

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);

    // Create test data...
    const testUser = {
      email: generateTestEmail(),
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User'
    };
    
    const authResponse = await authService.register(testUser);
    user = authResponse.user;

    pod = await prisma.workPod.create({
      data: {
        name: 'Test Pod',
        status: 'AVAILABLE',
        hourlyRate: 25.00,
        latitude: 0,
        longitude: 0,
        address: '123 Test St',
        lockId: 'lock-123'
      }
    });

    // Fix mock typing
    (stripe.paymentIntents.create as jest.Mock<any>).mockResolvedValue({
      id: 'pi_test123',
      status: 'succeeded',
      client_secret: 'secret_test123',
      amount: 2500,
      currency: 'usd'
    });

    // Update TTLock mock type
    (ttlockAPI.unlockDevice as jest.Mock).mockImplementation(() => Promise.resolve(true));
  });

  describe('Complete Booking Flow', () => {
    it('should complete a successful end-to-end booking flow', async () => {
      // Register user
      const testUser = {
        email: generateTestEmail(),
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };
      
      const authResponse = await authService.register(testUser);
      const user = authResponse.user;
      
      // Create test pod
      const pod = await prisma.workPod.create({
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

      // 2. Pod Selection
      const availablePods = await bookingService.listAvailablePods({
        latitude: pod.latitude,
        longitude: pod.longitude,
        radius: 10
      });
      expect(availablePods).toContainEqual(expect.objectContaining({
        id: pod.id,
        status: 'AVAILABLE'
      }));

      // 3. Booking Creation
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000)); // 2 hours later
      
      booking = await bookingService.createBooking({
        userId: user.id,
        podId: pod.id,
        startTime,
        endTime
      });

      expect(booking.status).toBe('PENDING');
      expect(Number(booking.totalAmount)).toBe(50.00);

      // 4. Payment Processing
      const payment = await paymentService.processStripePayment({
        bookingId: booking.id,
        paymentMethodId: 'pm_test123',
        amount: booking.totalAmount
      });

      expect(payment.status).toBe('COMPLETED');

      // Verify booking updated
      const confirmedBooking = await prisma.booking.findUnique({
        where: { id: booking.id }
      });
      expect(confirmedBooking?.status).toBe('CONFIRMED');

      // 5. Pod Unlocking
      const unlockResult = await bookingService.unlockPod(booking.id, user.id);
      expect(unlockResult).toBe(true);
      expect(ttlockAPI.unlockDevice).toHaveBeenCalledWith(pod.lockId);

      // Verify pod status
      const inUsePod = await prisma.workPod.findUnique({
        where: { id: pod.id }
      });
      expect(inUsePod?.status).toBe('OCCUPIED');

      // 6. Verify Notifications
      expect(notificationService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: user.id,
          type: 'BOOKING_CONFIRMED'
        })
      );

      // 7. Session Completion
      const endedBooking = await bookingService.endBooking(booking.id);
      expect(endedBooking.status).toBe('COMPLETED');

      // Verify pod available again
      const availablePod = await prisma.workPod.findUnique({
        where: { id: pod.id }
      });
      expect(availablePod?.status).toBe('AVAILABLE');
    });

    it('should handle payment failure gracefully', async () => {
      // Create booking
      booking = await bookingService.createBooking({
        userId: user.id,
        podId: pod.id,
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000)
      });

      // Mock payment failure
      (stripe.paymentIntents.create as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Card declined');
      });

      // Attempt payment
      await expect(
        paymentService.processStripePayment({
          bookingId: booking.id,
          paymentMethodId: 'pm_test123',
          amount: booking.totalAmount
        })
      ).rejects.toThrow('Card declined');

      // Verify booking failed
      const failedBooking = await prisma.booking.findUnique({
        where: { id: booking.id }
      });
      expect(failedBooking?.status).toBe('FAILED');

      // Verify pod still available
      const availablePod = await prisma.workPod.findUnique({
        where: { id: pod.id }
      });
      expect(availablePod?.status).toBe('AVAILABLE');
    });
  });

  describe('Error Handling', () => {
    // Add error handling tests here
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
}); 