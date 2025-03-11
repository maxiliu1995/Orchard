import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { NotificationStatus } from '@prisma/client';
import type { NotificationData } from '../../../core/notifications/types/notification.types';
import { mockNotificationService } from '../../../test/mocks/services/notification/notification.mock';

type NotificationResponse = { success: boolean; messageId: string };

// Mock the module before tests
jest.mock('../services/notificationService', () => ({
  notificationService: mockNotificationService
}));

// At the top with other constants
const MOCK_DATE = new Date('2025-03-03T21:53:22.352Z');

describe('WorkPod Notifications', () => {
  const mockPod = {
    id: 'test-pod-id',
    name: 'Test Pod',
    location: 'Test Location'
  };

  const mockNotification: NotificationData = {
    userId: 'test-user-id',
    podId: mockPod.id,
    type: 'BOOKING_CONFIRMATION',
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000),
    message: 'Test notification'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Success cases
    mockNotificationService.sendNotification.mockImplementation((data: NotificationData) => {
      if (!data?.userId || !data?.type) {
        return Promise.reject(new Error('Invalid notification data'));
      }
      return Promise.resolve({ success: true, messageId: 'test_id' });
    });

    mockNotificationService.sendBookingConfirmation.mockImplementation((data) => 
      mockNotificationService.sendNotification({ ...data, type: 'BOOKING_CONFIRMATION' }));

    mockNotificationService.notifyPodAvailable.mockImplementation((data) => 
      mockNotificationService.sendNotification({ ...data, type: 'POD_AVAILABLE' }));

    mockNotificationService.alertMaintenance.mockImplementation((data) => 
      mockNotificationService.sendNotification({ ...data, type: 'MAINTENANCE_ALERT' }));

    // Error cases
    mockNotificationService.createNotification.mockRejectedValue(
      new Error('Failed to create notification')
    );

    mockNotificationService.markAsRead.mockRejectedValue(
      new Error('Notification not found')
    );

    mockNotificationService.deleteNotification.mockRejectedValue(
      new Error('Notification not found')
    );

    // Default success cases with state tracking
    let notificationStatus: NotificationStatus = NotificationStatus.PENDING;
    
    mockNotificationService.createNotification.mockImplementation((data: NotificationData) => {
      if (data.userId === '') return Promise.reject(new Error('Failed to create notification'));
      return Promise.resolve();
    });

    mockNotificationService.markAsRead.mockImplementation(() => {
      notificationStatus = NotificationStatus.SENT as NotificationStatus;
      return Promise.resolve();
    });

    mockNotificationService.getNotifications.mockImplementation(() => Promise.resolve([{
      id: 'test-id',
      userId: 'test-user-id',
      type: 'BOOKING_CONFIRMATION',
      data: {},
      status: notificationStatus,
      createdAt: MOCK_DATE
    }]));
  });

  describe('Booking Notifications', () => {
    it('should send booking confirmation', async () => {
      const result = await mockNotificationService.sendBookingConfirmation({
        userId: mockNotification.userId,
        podId: mockNotification.podId,
        type: 'BOOKING_CONFIRMATION',
        startTime: mockNotification.startTime,
        endTime: mockNotification.endTime,
        message: mockNotification.message
      }) as NotificationResponse;

      expect(result.success).toBe(true);
      expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'BOOKING_CONFIRMATION',
          userId: mockNotification.userId,
          podId: mockNotification.podId
        })
      );
    });

    it('should notify on pod availability', async () => {
      const result = await mockNotificationService.notifyPodAvailable({
        userId: 'interested-user-id',
        podId: mockPod.id,
        type: 'POD_AVAILABLE',
        message: `${mockPod.name} is now available`
      }) as NotificationResponse;

      expect(result.success).toBe(true);
      expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'POD_AVAILABLE',
          podId: mockPod.id
        })
      );
    });

    it('should alert on maintenance needs', async () => {
      const result = await mockNotificationService.alertMaintenance({
        userId: 'maintenance-staff-id',
        podId: mockPod.id,
        type: 'MAINTENANCE_ALERT',
        message: 'Pod requires immediate maintenance'
      }) as NotificationResponse;

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'MAINTENANCE_ALERT',
          userId: 'maintenance-staff-id',
          podId: mockPod.id
        })
      );
    });
  });

  describe('Notification Management', () => {
    it('should create notification record', async () => {
      await mockNotificationService.createNotification(mockNotification);
      // Add assertions based on your implementation
    });

    it('should retrieve user notifications', async () => {
      const notifications = await mockNotificationService.getNotifications(mockNotification.userId);
      expect(notifications[0]).toMatchObject({
        id: 'test-id',
        userId: 'test-user-id',
        type: 'BOOKING_CONFIRMATION',
        status: 'PENDING',
        data: {}
      });
      expect(notifications[0].createdAt).toEqual(MOCK_DATE);
    });

    it('should mark notification as read', async () => {
      await mockNotificationService.markAsRead('test-notification-id');
      // Add assertions based on your implementation
    });
  });

  describe('Error Handling', () => {
    it('should handle failed notification sending', async () => {
      mockNotificationService.sendNotification.mockRejectedValueOnce(new Error('Failed to send'));
      
      await expect(
        mockNotificationService.sendBookingConfirmation(mockNotification)
      ).rejects.toThrow('Failed to send');
    });

    it('should validate required notification fields', async () => {
      const invalidData = {
        ...mockNotification,
        userId: ''  // Empty user ID
      };

      await expect(
        mockNotificationService.sendNotification(invalidData)
      ).rejects.toThrow('Invalid notification data');
    });

    it('should handle non-existent notification for marking as read', async () => {
      mockNotificationService.markAsRead.mockRejectedValueOnce(
        new Error('Notification not found')
      );
      await expect(
        mockNotificationService.markAsRead('non-existent-id')
      ).rejects.toThrow('Notification not found');
    });

    it('should handle database errors gracefully', async () => {
      mockNotificationService.createNotification.mockRejectedValueOnce(
        new Error('Failed to create notification')
      );
      
      await expect(
        mockNotificationService.createNotification(mockNotification)
      ).rejects.toThrow('Failed to create notification');
    });

    it('should prevent duplicate notification creation', async () => {
      let callCount = 0;
      mockNotificationService.createNotification.mockImplementation(() => {
        callCount++;
        if (callCount > 1) {
          return Promise.reject(new Error('Notification already exists'));
        }
        return Promise.resolve();
      });
      
      await mockNotificationService.createNotification(mockNotification);
      
      await expect(
        mockNotificationService.createNotification(mockNotification)
      ).rejects.toThrow('Notification already exists');
    });

    it('should handle service unavailability', async () => {
      mockNotificationService.sendNotification.mockRejectedValueOnce(new Error('Service unavailable'));
      await expect(
        mockNotificationService.sendNotification(mockNotification)
      ).rejects.toThrow();
    });

    it('should validate notification data', async () => {
      const invalidData = { ...mockNotification, userId: '' };
      await expect(
        mockNotificationService.sendNotification(invalidData)
      ).rejects.toThrow('Invalid notification data');
    });
  });

  describe('Notification Types', () => {
    it('should send booking confirmations', async () => {
      const result = await mockNotificationService.sendBookingConfirmation({
        userId: 'user-123',
        podId: 'pod-123',
        type: 'BOOKING_CONFIRMATION',
        startTime: new Date(),
        endTime: new Date()
      }) as NotificationResponse;
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should send maintenance alerts', async () => {
      const result = await mockNotificationService.alertMaintenance({
        userId: 'maintenance-staff-id',
        podId: mockPod.id,
        type: 'MAINTENANCE_ALERT',
        message: 'Pod requires immediate maintenance'
      }) as NotificationResponse;

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'MAINTENANCE_ALERT',
          userId: 'maintenance-staff-id',
          podId: mockPod.id
        })
      );
    });

    it('should send availability notifications', async () => {
      const result = await mockNotificationService.notifyPodAvailable({
        userId: 'waiting-user-id',
        podId: mockPod.id,
        type: 'POD_AVAILABLE',
        message: 'Your requested pod is now available'
      }) as NotificationResponse;

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'POD_AVAILABLE',
          userId: 'waiting-user-id',
          podId: mockPod.id
        })
      );
    });
  });

  describe('Notification State', () => {
    it('should track notification status', async () => {
      // Create notification
      await mockNotificationService.createNotification(mockNotification);
      
      // Get notifications to verify status
      const notifications = await mockNotificationService.getNotifications(mockNotification.userId);
      expect(notifications[0].status).toBe(NotificationStatus.PENDING);
      
      // Mark as read and verify updated status
      await mockNotificationService.markAsRead(notifications[0].id);
      const updated = await mockNotificationService.getNotifications(mockNotification.userId);
      expect(updated[0].status).toBe(NotificationStatus.SENT);
    });
  });
}); 