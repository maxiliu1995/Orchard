import { Server } from 'socket.io';
import { logger } from '@/shared/logger/index';
import { PodStatus } from '@prisma/client';

export class BookingSocketService {
  private static instance: BookingSocketService;
  private io: Server;

  private constructor() {
    this.io = new Server();
  }

  static getInstance(): BookingSocketService {
    if (!BookingSocketService.instance) {
      BookingSocketService.instance = new BookingSocketService();
    }
    return BookingSocketService.instance;
  }

  async emitPodUpdate(podId: string, status: PodStatus) {
    logger.info('Emitting pod status update', { podId, status });
    this.io.emit(`pod:${podId}:status`, { status });
  }
}

export const bookingSocketService = BookingSocketService.getInstance(); 