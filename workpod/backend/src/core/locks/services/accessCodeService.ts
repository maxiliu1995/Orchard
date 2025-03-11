import { prisma } from '@/shared/database/index';
import { logger } from '@/shared/logger/index';
import { ttlockService } from './ttLockService';

type AccessCodeStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';

export class AccessCodeService {
  async generateForBooking(bookingId: string) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { workPod: true }
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      const code = await ttlockService.generateAccessCode(bookingId);
      
      const accessCode = await prisma.lockAccessCode.create({
        data: {
          code: code.code,
          bookingId,
          workPodId: booking.workPod.id,
          status: 'ACTIVE',
          validFrom: new Date(),
          validUntil: booking.endTime ?? new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      });

      logger.info('Access code generated for booking', { bookingId });
      return accessCode;
    } catch (error) {
      logger.error('Failed to generate access code', { error, bookingId });
      throw error;
    }
  }

  async revokeCode(bookingId: string) {
    try {
      await prisma.lockAccessCode.updateMany({
        where: { 
          bookingId,
          status: 'ACTIVE'
        },
        data: {
          status: 'REVOKED',
          validUntil: new Date()
        }
      });

      logger.info('Access code revoked for booking', { bookingId });
    } catch (error) {
      logger.error('Failed to revoke access code', { error, bookingId });
      throw error;
    }
  }
}

export const accessCodeService = new AccessCodeService(); 