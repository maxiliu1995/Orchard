import { jest } from '@jest/globals';
import { NotificationStatus } from '@prisma/client';
import type { 
  INotificationService, 
  NotificationData, 
  NotificationResponse 
} from '@/shared/types/notification.types';

export const mockNotificationService = {
  sendNotification: jest.fn().mockImplementation((data) => 
    Promise.resolve({ success: true, messageId: 'test_id' })),
  sendBookingConfirmation: jest.fn().mockImplementation((data) => 
    Promise.resolve({ success: true, messageId: 'test_id' })),
  notifyPodAvailable: jest.fn().mockImplementation((data) => 
    Promise.resolve({ success: true, messageId: 'test_id' })),
  alertMaintenance: jest.fn().mockImplementation((data) => 
    Promise.resolve({ success: true, messageId: 'test_id' })),
  createNotification: jest.fn().mockImplementation((data) => Promise.resolve()),
  getNotifications: jest.fn().mockImplementation((userId) => Promise.resolve([{
    id: 'test-id',
    userId: 'test-user-id',
    type: 'BOOKING_CONFIRMATION',
    data: {},
    status: NotificationStatus.PENDING,
    createdAt: new Date()
  }])),
  markAsRead: jest.fn().mockImplementation((id) => Promise.resolve()),
  deleteNotification: jest.fn().mockImplementation((id) => Promise.resolve())
} as jest.Mocked<INotificationService>;

// Setup mock
jest.mock('@/shared/services/notification', () => ({
  NotificationService: jest.fn().mockImplementation(() => mockNotificationService)
}));

// Export for backward compatibility
export const mockNotifications = mockNotificationService; 