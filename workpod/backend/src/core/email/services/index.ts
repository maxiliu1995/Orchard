import { NotificationType } from '@/shared/types/notification.types';

export const emailService = {
  async sendEmail(to: string, type: NotificationType, content: string): Promise<boolean> {
    // Mock implementation for tests
    return true;
  }
}; 