import { prisma } from '@/shared/database/index';
import { AppError, ErrorType } from '@/shared/errors';
import { logger } from '@/shared/logger/index';
import { ttlockService } from '@/core/locks/services/ttLockService';
import { NearbyPodsQuery } from '../types/pod.types';
import { PodStatus, WorkPod, BookingStatus, Booking } from '@prisma/client';

export interface IPodService {
  getAvailablePods(lat: number, lng: number, radius: number): Promise<WorkPod[]>;
  bookPod(podId: string, userId: string, startTime: Date, endTime: Date): Promise<Booking>;
  findNearbyPods(query: NearbyPodsQuery): Promise<WorkPod[]>;
  getPodById(id: string): Promise<WorkPod>;
  createBooking(userId: string, data: { podId: string; startTime: Date; endTime: Date }): Promise<Booking>;
  unlockPod(podId: string, userId: string): Promise<void>;
  lockPod(podId: string, userId: string): Promise<void>;
  isPodAvailable(podId: string, startTime: Date, endTime: Date): Promise<boolean>;
}

// Add interface for time slot
interface TimeSlot {
  start: Date;
  end: Date;
}

export class PodService implements IPodService {
  async getAvailablePods(lat: number, lng: number, radius: number): Promise<WorkPod[]> {
    return prisma.workPod.findMany({
      where: {
        AND: [
          { latitude: { gte: lat - radius, lte: lat + radius } },
          { longitude: { gte: lng - radius, lte: lng + radius } },
          { status: 'AVAILABLE' }
        ]
      }
    });
  }

  async bookPod(podId: string, userId: string, startTime: Date, endTime: Date): Promise<Booking> {
    return this.createBooking(userId, { podId, startTime, endTime });
  }

  async findNearbyPods(query: NearbyPodsQuery): Promise<WorkPod[]> {
    return prisma.workPod.findMany({
      where: {
        AND: [
          { latitude: { gte: query.minLat, lte: query.maxLat } },
          { longitude: { gte: query.minLng, lte: query.maxLng } },
          { status: 'AVAILABLE' }
        ]
      }
    });
  }

  async getPodById(id: string): Promise<WorkPod> {
    const pod = await prisma.workPod.findUnique({ where: { id } });
    if (!pod) throw new AppError('Pod not found', 404, ErrorType.POD);
    return pod;
  }

  async createBooking(userId: string, data: { podId: string; startTime: Date; endTime: Date }): Promise<Booking> {
    try {
      logger.info('Finding pod', { podId: data.podId });
      
      const pod = await prisma.workPod.findUnique({
        where: { id: data.podId }
      });

      if (!pod) {
        logger.error('Pod not found', { podId: data.podId });
        throw new AppError('Pod not found', 404, ErrorType.POD);
      }

      logger.info('Found pod', { 
        podId: pod.id, 
        status: pod.status,
        hourlyRate: pod.hourlyRate 
      });

      if (pod.status !== PodStatus.AVAILABLE) {
        logger.error('Pod not available', { 
          podId: data.podId, 
          currentStatus: pod.status 
        });
        throw new AppError('Pod not available', 400, ErrorType.POD);
      }

      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);

      if (endTime <= startTime) {
        throw new AppError('End time must be after start time', 400, ErrorType.VALIDATION);
      }

      const hours = this.calculateHours(startTime, endTime);
      const totalAmount = hours * Number(pod.hourlyRate);

      logger.info('Creating booking record', { 
        userId,
        podId: data.podId,
        totalAmount
      });

      const booking = await prisma.booking.create({
        data: {
          userId,
          workPodId: data.podId,
          startTime,
          endTime,
          totalAmount,
          status: BookingStatus.PENDING,
        }
      });

      logger.info('Booking created successfully', { 
        bookingId: booking.id,
        status: booking.status
      });

      return booking;
    } catch (error) {
      logger.error('Error creating booking', { 
        error: error instanceof Error ? error.message : error,
        userId,
        podId: data.podId
      });
      throw error;
    }
  }

  async unlockPod(podId: string, userId: string): Promise<void> {
    const booking = await prisma.booking.findFirst({
      where: {
        workPodId: podId,
        userId,
        status: 'CONFIRMED'
      }
    });

    if (!booking) {
      throw new AppError('No active booking found', 403, ErrorType.POD);
    }

    await ttlockService.unlockPod(podId);
    logger.info('Pod unlocked', { podId, userId });
  }

  private calculateHours(startTime: Date, endTime: Date): number {
    const diffMs = endTime.getTime() - startTime.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60));
  }

  async getPods(filters?: { status?: PodStatus }) {
    return prisma.workPod.findMany({
      where: filters,
      include: {
        bookings: {
          where: {
            status: 'CONFIRMED',
            endTime: { gt: new Date() }
          }
        }
      }
    });
  }

  async getPodAvailability(podId: string) {
    const pod = await prisma.workPod.findUnique({
      where: { id: podId },
      include: { bookings: true }
    });

    return {
      availableSlots: this.calculateAvailableSlots(pod?.bookings || [])
    };
  }

  private calculateAvailableSlots(bookings: Array<{ startTime: Date; endTime: Date | null }>): TimeSlot[] {
    const validBookings = bookings.filter((b): b is { startTime: Date; endTime: Date } => 
      b.endTime !== null
    );
    const slots: TimeSlot[] = [];
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Sort valid bookings by start time
    const sortedBookings = validBookings.sort((a, b) => 
      a.startTime.getTime() - b.startTime.getTime()
    );

    // Find gaps between bookings
    let currentTime = now;
    for (const booking of sortedBookings) {
      if (booking.startTime > currentTime) {
        slots.push({
          start: currentTime,
          end: booking.startTime
        });
      }
      currentTime = booking.endTime;
    }

    // Add final slot if there's time remaining
    if (currentTime < weekFromNow) {
      slots.push({
        start: currentTime,
        end: weekFromNow
      });
    }

    return slots;
  }

  async createPod(data: {
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    hourlyRate: number;
    status: PodStatus;
    lockId: string;
  }): Promise<WorkPod> {
    return prisma.workPod.create({ data });
  }

  async updatePodStatus(podId: string, status: PodStatus): Promise<WorkPod> {
    return prisma.workPod.update({
      where: { id: podId },
      data: { status }
    });
  }

  async updateLocation(podId: string, location: {
    latitude: number;
    longitude: number;
    address: string;
  }) {
    return prisma.workPod.update({
      where: { id: podId },
      data: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address
      }
    });
  }

  async lockPod(podId: string, userId: string): Promise<void> {
    const booking = await prisma.booking.findFirst({
      where: {
        workPodId: podId,
        userId,
        status: 'CONFIRMED'
      }
    });
    if (!booking) throw new AppError('No active booking found', 403, ErrorType.POD);
    await ttlockService.lockPod(podId);
  }

  async getAvailableSlots(podId: string, startDate: Date, endDate: Date): Promise<TimeSlot[]> {
    const bookings = await prisma.booking.findMany({
      where: {
        workPodId: podId,
        startTime: { gte: startDate },
        endTime: { lte: endDate }
      },
      orderBy: { startTime: 'asc' }
    });

    const slots: TimeSlot[] = [];
    let currentTime = new Date();
    const weekFromNow = new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Add slots between bookings
    for (const booking of bookings) {
      if (!booking.endTime) continue; // Skip bookings with null endTime
      if (currentTime < booking.startTime) {
        slots.push({
          start: currentTime,
          end: booking.startTime
        });
      }
      currentTime = booking.endTime;
    }

    // Add final slot if there's time remaining
    if (currentTime < weekFromNow) {
      slots.push({
        start: currentTime,
        end: weekFromNow
      });
    }

    return slots;
  }

  async isPodAvailable(podId: string, startTime: Date, endTime: Date): Promise<boolean> {
    const bookings = await prisma.booking.count({
      where: {
        workPodId: podId,
        status: 'CONFIRMED',
        startTime: { lte: endTime },
        endTime: { gte: startTime }
      }
    });
    return bookings === 0;
  }
}

export const podService = new PodService(); 