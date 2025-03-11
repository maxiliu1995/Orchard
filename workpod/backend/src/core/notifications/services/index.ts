import { NotificationType } from '../../../shared/types/notification.types';

export const notificationService = {
  async send(data: { userId: string; type: NotificationType; data?: any }) {
    // Mock implementation for tests
    console.log('Sending notification:', data);
    return true;
  }
}; 