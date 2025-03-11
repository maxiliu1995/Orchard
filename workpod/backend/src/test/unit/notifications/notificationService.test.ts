// Third-party imports
import { describe, it, expect, beforeEach } from '@jest/globals';
import { NotificationType } from '@prisma/client';

// Core services
import { notificationService } from '../../../core/notifications/services/notificationService';

// Types
import type { NotificationData } from '../../../core/notifications/types/notification.types';

describe('NotificationService', () => {
  beforeEach(() => {
    // No need to create new instance
  });

  it('should send notification successfully', async () => {
    const mockPayload: NotificationData = {
      userId: 'test-user-id',
      podId: 'test-pod-id',
      type: 'PAYMENT_SUCCESS' as NotificationType,
      message: 'Payment successful',
      startTime: new Date()
    };

    await expect(notificationService.send(mockPayload)).resolves.not.toThrow();
  });
}); 