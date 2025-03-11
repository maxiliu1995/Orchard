import { prisma } from '../../../setup/database';
import { PodStatus, BookingStatus } from '@prisma/client';

export const createTestPod = async () => {
  return prisma.workPod.create({
    data: {
      name: 'Test Pod',
      status: PodStatus.AVAILABLE,
      hourlyRate: 10,
      latitude: 37.7749,
      longitude: -122.4194,
      address: '123 Test St',
      lockId: 'test-lock-id'
    }
  });
};

export const createTestBooking = async (userId: string, podId: string, data: any = {}) => {
  return prisma.booking.create({
    data: {
      userId,
      workPodId: podId,
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      status: BookingStatus.CONFIRMED,
      totalAmount: 25,
      ...data
    }
  });
}; 