// Third-party imports
import { PodStatus, BookingStatus, User } from '@prisma/client';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Core services
import { BookingService } from '../../../core/bookings/services/bookingService';
import { authService } from '../../../core/auth/services/authService';

// Error types
import { AppError, NotFoundError } from '../../../shared/errors/appError';

// Test utilities
import { prisma } from '../../setup/database';
import { cleanup } from '../../setup/utils/db/database.utils';
import { generateTestEmail, hashPassword } from '../../setup/utils/auth/auth.utils';

// Test setup
let bookingService: BookingService;
let testUser: User;
let testBooking: any;
let testWorkPod: any;

// Update the testWorkPod fixture to generate unique IDs
const createTestWorkPod = () => ({
  id: `test-pod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Pod',
  status: 'AVAILABLE' as PodStatus,
  hourlyRate: 25,
  latitude: 51.5074,
  longitude: -0.1278,
  address: 'Test Location',
  lockId: 'test-lock-id'
});

// Update the beforeEach to create a fresh testWorkPod
beforeEach(async () => {
  await cleanup();
  
  testWorkPod = createTestWorkPod();

  // Create test user and assign to testUser variable
  testUser = await prisma.user.create({
    data: {
      email: generateTestEmail(),
      password: await hashPassword('Password123!'),
      firstName: 'Test',
      lastName: 'User'
    }
  });

  // Initialize testBooking with testUser.id
  testBooking = {
    userId: testUser.id,
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000),
    status: 'PENDING' as BookingStatus,
    totalAmount: 25,
    paymentIntentId: 'pi_test_123'
  };
  
  bookingService = BookingService.getInstance();
});

// Update createTestBooking to use unique IDs
async function createTestBooking(userId: string) {
  const pod = await prisma.workPod.create({
    data: createTestWorkPod()
  });

  return prisma.booking.create({
    data: {
      userId,
      workPodId: pod.id,
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      status: 'PENDING',
      totalAmount: 25
    }
  });
}

describe('BookingService', () => {
  describe('createBooking', () => {
    it('should create a new booking', async () => {
      const pod = await prisma.workPod.create({ data: testWorkPod });
      const startTime = new Date();
      const endTime = new Date(Date.now() + 3600000);

      const booking = await bookingService.createBooking({
        userId: testUser.id,
        podId: pod.id,
        startTime,
        endTime
      });

      expect(booking).toHaveProperty('id');
      expect(booking.status).toBe('PENDING');
      expect(booking.userId).toBe(testUser.id);
      expect(booking.workPodId).toBe(pod.id);
    });

    it('should throw error if pod is not available', async () => {
      const pod = await prisma.workPod.create({ data: testWorkPod });
      
      await prisma.workPod.update({
        where: { id: pod.id },
        data: { status: 'OCCUPIED' }
      });

      const startTime = new Date();
      const endTime = new Date(Date.now() + 3600000);

      await expect(bookingService.createBooking({
        userId: testUser.id,
        podId: pod.id,
        startTime,
        endTime
      })).rejects.toThrow(AppError);
    });

    it('should throw error if booking times are invalid', async () => {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() - 3600000); // End time before start time

      await expect(bookingService.createBooking({
        userId: testUser.id,
        podId: 'test-pod-id',
        startTime,
        endTime
      })).rejects.toThrow(AppError);
    });
  });

  describe('cancelBooking', () => {
    it('should cancel an existing booking', async () => {
      const booking = await createTestBooking(testUser.id);
      const result = await bookingService.cancelBooking(booking.id, testUser.id);

      expect(result.status).toBe('CANCELLED');
    });

    it('should throw error when cancelling non-existent booking', async () => {
      await expect(bookingService.cancelBooking('non-existent-id', testUser.id))
        .rejects.toThrow(AppError);
    });

    it('should throw error when cancelling already cancelled booking', async () => {
      const booking = await createTestBooking(testUser.id);
      await bookingService.cancelBooking(booking.id, testUser.id);

      await expect(bookingService.cancelBooking(booking.id, testUser.id))
        .rejects.toThrow(AppError);
    });

    it('should allow cancelling confirmed bookings', async () => {
      const pod = await prisma.workPod.create({ 
        data: testWorkPod 
      });
      
      const booking = await prisma.booking.create({
        data: {
          userId: testUser.id,
          workPodId: pod.id,
          status: BookingStatus.CONFIRMED,
          startTime: new Date(),
          endTime: new Date(Date.now() + 60 * 60 * 1000),
          totalAmount: 25,
          paymentIntentId: 'pi_test_123'
        }
      });

      const cancelledBooking = await bookingService.cancelBooking(booking.id, testUser.id);
      expect(cancelledBooking.status).toBe(BookingStatus.CANCELLED);
    });
  });

  describe('getUserBookings', () => {
    it('should return all bookings for a user', async () => {
      await createTestBooking(testUser.id);
      await createTestBooking(testUser.id);

      const bookings = await bookingService.getUserBookings(testUser.id);

      expect(Array.isArray(bookings)).toBe(true);
      expect(bookings.length).toBe(2);
      expect(bookings[0].userId).toBe(testUser.id);
    });

    it('should return empty array for user with no bookings', async () => {
      const bookings = await bookingService.getUserBookings('non-existent-id');
      expect(bookings).toHaveLength(0);
    });
  });

  describe('getBooking', () => {
    it('should return booking details', async () => {
      const booking = await createTestBooking(testUser.id);
      const result = await bookingService.getBooking(booking.id);

      expect(result).toHaveProperty('id', booking.id);
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('userId', testUser.id);
    });

    it('should throw error for non-existent booking', async () => {
      await expect(bookingService.getBooking('non-existent-id'))
        .rejects.toThrow(AppError);
    });
  });

  describe('createBooking', () => {
    it('should create a new booking', async () => {
      const pod = await prisma.workPod.create({ data: testWorkPod });
      
      const booking = await bookingService.createBooking({
        userId: testUser.id,
        podId: pod.id,
        startTime: testBooking.startTime,
        endTime: testBooking.endTime
      });

      expect(booking.workPodId).toBe(pod.id);
      expect(booking.status).toBe('PENDING');
    });

    it('should throw error if pod not available', async () => {
      const pod = await prisma.workPod.create({ 
        data: { ...testWorkPod, status: 'OCCUPIED' } 
      });

      await expect(bookingService.createBooking({
        userId: testUser.id,
        podId: pod.id,
        startTime: testBooking.startTime,
        endTime: testBooking.endTime
      })).rejects.toThrow('Pod not available');
    });
  });

  describe('getBooking', () => {
    it('should return booking by id', async () => {
      const pod = await prisma.workPod.create({ data: testWorkPod });
      const created = await prisma.booking.create({
        data: { 
          ...testBooking, 
          workPodId: pod.id,
          status: 'PENDING' as BookingStatus 
        }
      });

      const booking = await bookingService.getBooking(created.id);
      expect(booking.id).toBe(created.id);
    });

    it('should throw error if booking not found', async () => {
      await expect(bookingService.getBooking('non-existent'))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('getUserBookings', () => {
    it('should return user bookings', async () => {
      const pod = await prisma.workPod.create({ data: testWorkPod });
      await prisma.booking.create({
        data: { 
          ...testBooking, 
          workPodId: pod.id,
          status: 'PENDING' as BookingStatus 
        }
      });

      const bookings = await bookingService.getUserBookings(testUser.id);
      expect(bookings).toHaveLength(1);
      expect(bookings[0].userId).toBe(testUser.id);
    });
  });

  describe('cancelBooking', () => {
    it('should cancel pending booking', async () => {
      const pod = await prisma.workPod.create({ data: testWorkPod });
      const booking = await prisma.booking.create({
        data: { 
          ...testBooking, 
          workPodId: pod.id,
          status: 'PENDING' as BookingStatus 
        }
      });

      await bookingService.cancelBooking(booking.id, testUser.id);
      
      const updated = await prisma.booking.findUnique({
        where: { id: booking.id }
      });
      expect(updated?.status).toBe('CANCELLED');
    });
  });

  describe('confirmBooking', () => {
    it('should confirm pending booking', async () => {
      const pod = await prisma.workPod.create({ data: testWorkPod });
      const booking = await prisma.booking.create({
        data: {
          userId: testUser.id,
          workPodId: pod.id,
          startTime: new Date(),
          endTime: new Date(Date.now() + 3600000),
          status: 'PENDING' as BookingStatus,
          totalAmount: 25
        }
      });

      const confirmed = await bookingService.confirmBooking(booking.id);
      expect(confirmed.status).toBe('CONFIRMED');
    });
  });

  describe('getActiveBooking', () => {
    it('should get active booking for pod', async () => {
      const pod = await prisma.workPod.create({ data: testWorkPod });
      const booking = await prisma.booking.create({
        data: {
          userId: testUser.id,
          workPodId: pod.id,
          startTime: new Date(),
          endTime: new Date(Date.now() + 3600000),
          status: 'CONFIRMED' as BookingStatus,
          totalAmount: 25
        }
      });

      const active = await bookingService.getActiveBooking(pod.id);
      expect(active?.id).toBe(booking.id);
    });
  });

  describe('login', () => {
    it('should return user and access token', async () => {
      const credentials = {
        email: testUser.email,
        password: 'Password123!'
      };
      const { user: { id } } = await authService.login(credentials);
      expect(id).toBe(testUser.id);
    });
  });
}); 