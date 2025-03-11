import { AppError, NotFoundError, UnauthorizedError, ValidationError, ErrorType } from '@/shared/errors';
import { BookingStatus, PodStatus, Booking } from '@prisma/client';
import { ttlockService } from '@/core/locks/services/ttLockService';
import { prisma } from '@/shared/database';

export class BookingService {
  private static instance: BookingService;

  private constructor() {}

  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  async getUserBookings(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      include: { workPod: true }
    });
  }

  async getBookingById(bookingId: string, userId: string) {
    if (!bookingId) {
      throw new Error('Booking ID is required');
    }
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { workPod: true }
    });

    if (!booking) {
      throw new AppError('Booking not found', 404, ErrorType.NOT_FOUND);
    }

    if (booking.userId !== userId) {
      throw new AppError('Not authorized to access this booking', 403, ErrorType.AUTH);
    }

    return booking;
  }

  async createBooking(data: any) {
    // Mock implementation
    return {
      id: 'test-booking-id',
      ...data
    };
  }

  async updateBooking(bookingId: string, userId: string, data: { endTime: string }) {
    const booking = await this.getBookingById(bookingId, userId);

    if (booking.status !== BookingStatus.PENDING) {
      throw new AppError('Cannot modify confirmed or cancelled booking', 400, ErrorType.VALIDATION);
    }

    const newEndTime = new Date(data.endTime);
    const hours = this.calculateHours(booking.startTime, newEndTime);
    const totalAmount = hours * Number(booking.workPod.hourlyRate);

    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        endTime: newEndTime,
        totalAmount
      }
    });
  }

  async cancelBooking(bookingId: string, userId: string): Promise<Booking> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new UnauthorizedError('Not authorized to cancel this booking');
    }

    if (booking.status === 'CANCELLED') {
      throw new ValidationError('Booking is already cancelled');
    }

    // Allow cancelling any booking that isn't already cancelled
    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' }
    });
  }

  async unlockPod(bookingId: string, userId: string) {
    const booking = await this.getBookingById(bookingId, userId);
    console.log('Unlock pod service:', { 
      booking,
      now: new Date(),
      status: booking.status
    });

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new AppError('Booking is not confirmed', 400, ErrorType.VALIDATION);
    }

    const now = new Date();
    if (now < booking.startTime) {
      throw new AppError('Booking has not started yet', 400, ErrorType.VALIDATION);
    }

    if (!booking.endTime || now > booking.endTime) {
      throw new AppError('Booking has expired', 400, ErrorType.VALIDATION);
    }

    const success = await ttlockService.unlockDevice(booking.workPod.lockId);
    
    if (success) {
      // Update pod status to OCCUPIED
      await prisma.workPod.update({
        where: { id: booking.workPodId },
        data: { status: PodStatus.OCCUPIED }
      });
    }

    return success;
  }

  async listAvailablePods({ latitude, longitude, radius }: {
    latitude: number;
    longitude: number;
    radius: number;
  }) {
    return prisma.workPod.findMany({
      where: {
        status: 'AVAILABLE',
        AND: [
          { latitude: { gte: latitude - radius } },
          { latitude: { lte: latitude + radius } },
          { longitude: { gte: longitude - radius } },
          { longitude: { lte: longitude + radius } }
        ]
      }
    });
  }

  async endBooking(bookingId: string) {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: BookingStatus.COMPLETED,
        endTime: new Date()
      }
    });

    await prisma.workPod.update({
      where: { id: booking.workPodId },
      data: { status: 'AVAILABLE' }
    });

    return booking;
  }

  async getBooking(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    return booking;
  }

  async confirmBooking(bookingId: string) {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CONFIRMED }
    });
    return booking;
  }

  async getActiveBooking(podId: string) {
    return prisma.booking.findFirst({
      where: {
        workPodId: podId,
        status: BookingStatus.CONFIRMED,
        startTime: { lte: new Date() },
        endTime: { gte: new Date() }
      }
    });
  }

  private calculateHours(startTime: Date, endTime: Date): number {
    const diffMs = endTime.getTime() - startTime.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    return Math.round(hours);
  }

  async updateBookingStatus(paymentIntentId: string, status: BookingStatus) {
    const booking = await prisma.booking.findFirst({
      where: { paymentIntentId }
    });
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    return prisma.booking.update({
      where: { id: booking.id },
      data: { status }
    });
  }

  async getPodBookingStatus(podId: string) {
    const currentBooking = await prisma.booking.findFirst({
      where: {
        workPodId: podId,
        status: BookingStatus.CONFIRMED,
        startTime: { lte: new Date() },
        endTime: { gte: new Date() }
      }
    });

    return {
      podId,
      isOccupied: !!currentBooking,
      currentBooking
    };
  }
} 