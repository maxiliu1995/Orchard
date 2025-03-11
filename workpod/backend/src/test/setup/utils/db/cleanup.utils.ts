import { prisma } from '@/test/setup/database';
import { CleanupScope } from './types';
import { BookingStatus } from '@prisma/client';

// File system cleanup
import fs from 'fs/promises';
import path from 'path';

// Define file paths for cleanup
const filePathMappings: Record<string, string[]> = {
  logs: ['logs'],
  migrations: ['prisma/migrations/.logs'],
  uploads: ['uploads'],
  temp: ['tmp'],
  prisma: [
    'node_modules/.prisma',
    'prisma/dev.db',
    'prisma/migrations/.logs'
  ]
};

// Database cleanup
export const cleanup = async (...scopes: CleanupScope[]) => {
  if (scopes.length === 0) {
    scopes = [CleanupScope.ALL];
  }

  await prisma.$transaction(async (tx) => {
    for (const scope of scopes) {
      switch (scope) {
        case CleanupScope.ALL:
          await tx.booking.updateMany({
            where: { status: { not: BookingStatus.CANCELLED } },
            data: { status: BookingStatus.CANCELLED }
          });
          await tx.booking.deleteMany();
          await tx.payment.deleteMany();
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

// File system cleanup
export const cleanupFiles = async (scope: string) => {
  const paths = filePathMappings[scope];
  if (!paths) return;

  for (const relativePath of paths) {
    const fullPath = path.join(process.cwd(), relativePath);
    try {
      await fs.rm(fullPath, { recursive: true, force: true });
    } catch (error) {
      console.warn(`Failed to clean ${scope} at ${fullPath}:`, error);
    }
  }
};
