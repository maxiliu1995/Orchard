export interface NotificationData {
  userId: string;
  type: string;
  data: Record<string, any>;
}

export interface NotificationResponse {
  success: boolean;
  messageId: string;
}

export interface INotificationService {
  sendNotification: (data: NotificationData) => Promise<NotificationResponse>;
  sendBookingConfirmation: (data: NotificationData) => Promise<NotificationResponse>;
  notifyPodAvailable: (data: NotificationData) => Promise<NotificationResponse>;
  alertMaintenance: (data: NotificationData) => Promise<NotificationResponse>;
  createNotification: (data: NotificationData) => Promise<void>;
  getNotifications: (userId: string) => Promise<any[]>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export enum NotificationType {
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  PAYMENT_SUCCESSFUL = 'PAYMENT_SUCCESSFUL',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  ACCESS_CODE_GENERATED = 'ACCESS_CODE_GENERATED',
  POD_MAINTENANCE = 'POD_MAINTENANCE'
} 