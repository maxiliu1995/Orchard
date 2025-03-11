import { prisma } from '../../../setup/database';
import { BookingStatus } from '@prisma/client';
import type { PrismaClient, Prisma } from '@prisma/client';

export enum CleanupScope {
  ALL = 'ALL',
  BOOKINGS = 'BOOKINGS',
  USERS = 'USERS',
  PODS = 'PODS',
  PAYMENTS = 'PAYMENTS'
}

// Add transaction helper
const withTestTransaction = async <T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> => {
  return prisma.$transaction(fn);
};

export const cleanup = async (...scopes: CleanupScope[]) => {
  if (scopes.length === 0) {
    scopes = [CleanupScope.ALL];
  }

  await withTestTransaction(async (tx) => {
    for (const scope of scopes) {
      switch (scope) {
        case CleanupScope.ALL:
          // Cancel bookings before deletion
          await tx.booking.updateMany({
            where: { status: { not: BookingStatus.CANCELLED } },
            data: { status: BookingStatus.CANCELLED }
          });
          await tx.booking.deleteMany();
          await tx.payment.deleteMany(); // Add payment cleanup
          await tx.user.deleteMany();
          await tx.workPod.deleteMany();
          break;
        case CleanupScope.BOOKINGS:
          await tx.booking.updateMany({
            where: { status: { not: BookingStatus.CANCELLED } },
            data: { status: BookingStatus.CANCELLED }
          });
          await tx.booking.deleteMany();
          break;
        case CleanupScope.USERS:
          await tx.user.deleteMany();
          break;
        case CleanupScope.PODS:
          await tx.workPod.deleteMany();
          break;
        case CleanupScope.PAYMENTS:
          await tx.payment.deleteMany();
          break;
      }
    }
  });
};

export const resetMocks = () => {
  jest.clearAllMocks();
};

export const createTestPod = async () => {
  return prisma.workPod.create({
    data: {
      name: 'Test Pod',
      status: 'AVAILABLE',
      hourlyRate: 25,
      latitude: 51.5074,
      longitude: -0.1278,
      address: 'Test Location',
      lockId: 'test-lock-id'
    }
  });
};

export const setupTestDatabase = async () => {
  try {
    await prisma.$connect();
    await cleanup();
    return prisma;
  } catch (error) {
    console.error('Test database setup failed:', error);
    throw error;
  }
}; 