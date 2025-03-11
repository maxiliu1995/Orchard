import { prisma } from '@/shared/database/index';
import { PodStatus, NotificationType } from '@prisma/client';
import { ttlockService } from '@/core/locks/services/ttLockService';
import { notificationService } from '@/core/notifications/services/notificationService';

export class WorkPodService {
  async createPod(data: {
    name: string;
    hourlyRate: number;
    latitude: number;
    longitude: number;
    address: string;
    lockId: string;
  }) {
    return prisma.workPod.create({
      data: {
        ...data,
        status: PodStatus.AVAILABLE
      }
    });
  }

  async updatePodStatus(podId: string, status: PodStatus) {
    if (status === PodStatus.MAINTENANCE) {
      const affectedBookings = await prisma.booking.findMany({
        where: {
          workPodId: podId,
          status: 'CONFIRMED',
          endTime: { gt: new Date() }
        }
      });
      
      for (const booking of affectedBookings) {
        await notificationService.send({
          userId: booking.userId,
          type: NotificationType.POD_MAINTENANCE,
          podId: podId,
          message: 'Pod is under maintenance',
          startTime: new Date()
        });
      }
    }

    return prisma.workPod.update({
      where: { id: podId },
      data: { status }
    });
  }

  async findPodsNearby({ latitude, longitude, radius }: {
    latitude: number;
    longitude: number;
    radius: number;
  }) {
    return prisma.workPod.findMany({
      where: {
        AND: [
          { latitude: { gte: latitude - radius } },
          { latitude: { lte: latitude + radius } },
          { longitude: { gte: longitude - radius } },
          { longitude: { lte: longitude + radius } },
          { status: PodStatus.AVAILABLE }
        ]
      }
    });
  }

  async unlockPod(podId: string, userId: string) {
    const pod = await prisma.workPod.findUnique({
      where: { id: podId },
      include: {
        bookings: {
          where: {
            userId,
            status: 'CONFIRMED',
            startTime: { lte: new Date() },
            endTime: { gte: new Date() }
          }
        }
      }
    });

    if (!pod) {
      throw new Error('Pod not found');
    }

    if (pod.bookings.length === 0) {
      throw new Error('No active booking found');
    }

    return ttlockService.unlockDevice(pod.lockId);
  }

  async checkPodAvailability(podId: string, startTime: Date, endTime: Date) {
    const existingBookings = await prisma.booking.findMany({
      where: {
        workPodId: podId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } }
        ]
      }
    });

    return existingBookings.length === 0;
  }

  async emergencyShutdown(podId: string) {
    const pod = await prisma.workPod.update({
      where: { id: podId },
      data: { status: PodStatus.OFFLINE }
    });
    
    await ttlockService.lockDevice(pod.lockId);
    return pod;
  }

  async createBooking(data: {
    userId: string;
    workPodId: string;
    startTime: Date;
    endTime: Date;
  }) {
    const pod = await prisma.workPod.findUnique({
      where: { id: data.workPodId }
    });

    if (pod?.status === PodStatus.MAINTENANCE) {
      return Promise.reject(new Error('Pod is under maintenance'));
    }

    return prisma.booking.create({
      data: {
        ...data,
        status: 'PENDING'
      }
    });
  }
}

export const workPodService = new WorkPodService(); 