import { prisma } from '@/shared/database/index';
import { logger } from '@/shared/logger/index';
import { PodStatus } from '@prisma/client';
import { bookingSocketService } from '@/core/bookings/services';

export class PodStatusService {
  async updateStatus(podId: string, status: PodStatus) {
    try {
      const pod = await prisma.workPod.update({
        where: { id: podId },
        data: { status }
      });

      await bookingSocketService.emitPodUpdate(podId, status);

      logger.info('Pod status updated', { podId, status });
      return pod;
    } catch (error) {
      logger.error('Failed to update pod status', { error, podId });
      throw error;
    }
  }
}

export const podStatusService = new PodStatusService(); 