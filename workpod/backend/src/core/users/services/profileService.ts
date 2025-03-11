import { prisma } from '@/shared/database/index';
import { logger } from '@/shared/logger/index';

export class ProfileService {
  async updateProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatar?: string;
  }) {
    try {
      const profile = await prisma.user.update({
        where: { id: userId },
        data
      });

      logger.info('Profile updated', { userId });
      return profile;
    } catch (error) {
      logger.error('Failed to update profile', { error, userId });
      throw error;
    }
  }
}

export const profileService = new ProfileService(); 