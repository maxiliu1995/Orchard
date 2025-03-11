import { PodStatus } from '@prisma/client';

export class BookingService {
  private static instance: BookingService;

  static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  async listAvailablePods(params: { latitude: number; longitude: number; radius: number }) {
    return [{ id: 'test-pod-id', status: PodStatus.AVAILABLE }];
  }

  async createBooking(data: { userId: string; podId: string; startTime: Date; endTime: Date }) {
    return { id: 'test-booking-id', status: 'PENDING', totalAmount: 50.00 };
  }

  async unlockPod(bookingId: string, userId: string) {
    return true;
  }

  async endBooking(bookingId: string) {
    return { id: bookingId, status: 'COMPLETED' };
  }
}

// Export singleton instance
export const bookingService = BookingService.getInstance();

export { bookingSocketService } from './bookingSocketService'; 