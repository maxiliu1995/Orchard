import { prisma } from '@/shared/database/index';
import { logger } from '@/shared/logger/index';
import { PodStatus, BookingStatus } from '@prisma/client';
import type { PodAvailability } from '../types/pod.types';

export class PodAvailabilityService {
  async checkAvailability(podId: string, startTime: Date, endTime: Date): Promise<PodAvailability> {
    try {
      const pod = await prisma.workPod.findUnique({
        where: { id: podId },
        include: {
          bookings: {
            where: {
              OR: [
                {
                  startTime: { lte: endTime },
                  endTime: { gte: startTime }
                },
                {
                  status: BookingStatus.CONFIRMED
                }
              ]
            }
          }
        }
      });

      if (!pod) {
        throw new Error('Pod not found');
      }

      const isAvailable = pod.status === 'AVAILABLE' && pod.bookings.length === 0;
      const nextAvailable = !isAvailable ? await this.getNextAvailableSlot(pod) : undefined;

      logger.info('Pod availability checked', { podId, isAvailable });
      
      return {
        podId,
        status: pod.status as PodStatus,
        nextAvailable
      };
    } catch (error) {
      logger.error('Failed to check pod availability', { error, podId });
      throw error;
    }
  }

  private async getNextAvailableSlot(pod: any): Promise<Date | undefined> {
    const latestBooking = await prisma.booking.findFirst({
      where: { workPodId: pod.id },
      orderBy: { endTime: 'desc' }
    });

    return latestBooking?.endTime ?? undefined;
  }
}

export const podAvailabilityService = new PodAvailabilityService();
