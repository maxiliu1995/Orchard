import { prisma } from '@/shared/database/index';
import { logger } from '@/shared/logger/index';
import { NotificationData } from '../types';
import { NotificationType } from '@prisma/client';

class NotificationService {
  async send(notification: NotificationData): Promise<void> {
    try {
      await prisma.notification.create({
        data: {
          userId: notification.userId,
          type: notification.type as NotificationType,
          data: {
            podId: notification.podId,
            message: notification.message,
            startTime: notification.startTime,
            endTime: notification.endTime
          }
        }
      });
      logger.info('Notification sent', { type: notification.type, userId: notification.userId });
    } catch (error) {
      logger.error('Failed to send notification', { error });
    }
  }
}

export const notificationService = new NotificationService();