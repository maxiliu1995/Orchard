import { Server, Socket } from 'socket.io';
import { logger } from '@/shared/logger/index';
import { BookingStatus, PodStatus } from '@prisma/client';

export class BookingSocketHandler {
  constructor(private io: Server) {}

  handleConnection(socket: Socket) {
    socket.on('join-booking', (bookingId: string) => {
      socket.join(`booking:${bookingId}`);
      logger.info('Client joined booking room', { socketId: socket.id, bookingId });
    });

    socket.on('leave-booking', (bookingId: string) => {
      socket.leave(`booking:${bookingId}`);
      logger.info('Client left booking room', { socketId: socket.id, bookingId });
    });
  }

  emitBookingUpdate(bookingId: string, status: BookingStatus) {
    this.io.to(`booking:${bookingId}`).emit('booking-update', { status });
    logger.info('Booking update emitted', { bookingId, status });
  }
}

export class PodSocketHandler {
  constructor(private io: Server) {}

  handleConnection(socket: Socket) {
    socket.on('join-pod', (podId: string) => {
      socket.join(`pod:${podId}`);
      logger.info('Client joined pod room', { socketId: socket.id, podId });
    });

    socket.on('leave-pod', (podId: string) => {
      socket.leave(`pod:${podId}`);
      logger.info('Client left pod room', { socketId: socket.id, podId });
    });
  }

  emitPodUpdate(podId: string, status: PodStatus) {
    this.io.to(`pod:${podId}`).emit('pod-update', { status });
    logger.info('Pod update emitted', { podId, status });
  }
}

export const setupSocketHandlers = (io: Server, socket: Socket) => {
  logger.info('Client connected', { socketId: socket.id });

  const bookingHandler = new BookingSocketHandler(io);
  const podHandler = new PodSocketHandler(io);

  bookingHandler.handleConnection(socket);
  podHandler.handleConnection(socket);

  socket.on('disconnect', () => {
    logger.info('Client disconnected', { socketId: socket.id });
  });
}; 