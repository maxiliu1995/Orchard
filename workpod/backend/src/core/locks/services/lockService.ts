import { prisma } from '@/shared/database';
import { AppError, ErrorType } from '@/shared/errors/errorTypes';
import { logger } from '@/shared/logger/index';
import { ttlockService } from './ttLockService';
import type { AccessCode } from '@/core/locks/types/lock.types';

export class LockService {
  private static instance: LockService;
  private readonly ttlock = ttlockService;

  private constructor() {}

  public static getInstance(): LockService {
    if (!LockService.instance) {
      LockService.instance = new LockService();
    }
    return LockService.instance;
  }

  async getLocks() {
    return prisma.lock.findMany();
  }

  async getLockById(id: string) {
    return prisma.lock.findUnique({ where: { id } });
  }

  async createLock(data: any) {
    return prisma.lock.create({ data });
  }

  async updateLock(id: string, data: any) {
    return prisma.lock.update({ where: { id }, data });
  }

  async generateAccessCode(bookingId: string): Promise<AccessCode> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { workPod: true }
    });

    if (!booking) {
      throw new AppError('Booking not found', 404, ErrorType.NOT_FOUND);
    }

    // Generate access code using TTLock API
    const accessCode = await this.ttlock.generateAccessCode(booking.workPod.lockId);

    // Store access code in database
    await prisma.lockAccessCode.create({
      data: {
        code: accessCode.code,
        bookingId: booking.id,
        workPodId: booking.workPodId,
        validFrom: booking.startTime,
        validUntil: booking.endTime || new Date(booking.startTime.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    return accessCode;
  }

  async revokeAccess(bookingId: string): Promise<void> {
    const accessCode = await prisma.lockAccessCode.findFirst({
      where: { 
        bookingId,
        status: 'ACTIVE'
      },
      include: {
        booking: {
          include: {
            workPod: true
          }
        }
      }
    });

    if (!accessCode) {
      throw new AppError('Access code not found', 404, ErrorType.NOT_FOUND);
    }

    // Revoke access code using TTLock API
    await this.ttlock.revokeAccessCode(accessCode.booking.workPod.lockId, accessCode.code);
    
    await prisma.lockAccessCode.update({
      where: { id: accessCode.id },
      data: { 
        status: 'REVOKED',
        validUntil: new Date()
      }
    });
  }

  async validateAccessCode(podId: string, code: string): Promise<boolean> {
    const accessCode = await prisma.lockAccessCode.findFirst({
      where: {
        code,
        booking: {
          workPodId: podId
        },
        status: 'ACTIVE',
        validUntil: { gt: new Date() }
      }
    });

    if (!accessCode) {
      throw new AppError('Invalid access code', 401);
    }

    return true;
  }

  async unlockByBookingId(podId: string, bookingId: string): Promise<void> {
    const booking = await prisma.booking.findFirst({
      where: { 
        id: bookingId,
        workPodId: podId,
        status: 'CONFIRMED'
      },
      include: { workPod: true }
    });

    if (!booking) {
      throw new AppError('No active booking found', 404);
    }

    await this.ttlock.unlockDevice(booking.workPod.lockId);
  }

  async lock(podId: string): Promise<void> {
    const pod = await prisma.workPod.findUnique({
      where: { id: podId }
    });

    if (!pod) {
      throw new AppError('Pod not found', 404);
    }

    await this.ttlock.lockDevice(pod.lockId);
  }

  async getAccessCode(bookingId: string) {
    // Implementation
    return {
      code: '123456',
      status: 'ACTIVE',
      bookingId
    };
  }

  async verifyAccessCode(bookingId: string, code: string): Promise<boolean> {
    try {
      const accessCode = await prisma.lockAccessCode.findFirst({
        where: {
          bookingId,
          code,
          validUntil: { gt: new Date() }
        }
      });
      return !!accessCode;
    } catch (error) {
      logger.error('Failed to verify access code', { error, bookingId });
      return false;
    }
  }

  async unlock(podId: string): Promise<void> {
    try {
      logger.info('Unlocking pod', { podId });
      await this.ttlock.unlock(podId);
    } catch (error) {
      logger.error('Failed to unlock pod', { error, podId });
      throw new AppError('Failed to unlock pod', 500, ErrorType.LOCK);
    }
  }
}

export const lockService = LockService.getInstance(); 