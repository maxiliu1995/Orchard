export type NotificationType = 
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'POD_READY'
  | 'POD_MAINTENANCE'
  | 'SUBSCRIPTION_RENEWED'
  | 'SUBSCRIPTION_EXPIRING';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  read: boolean;
  updatedAt: Date;
  status: string;
  data?: Record<string, any>;
  createdAt: Date;
}

export type NotificationPreferences = {
  email: {
    bookings: boolean;
    payments: boolean;
    maintenance: boolean;
    marketing: boolean;
    instant: boolean;
  };
  push: {
    bookings: boolean;
    payments: boolean;
    maintenance: boolean;
    marketing: boolean;
    instant: boolean;
  };
};