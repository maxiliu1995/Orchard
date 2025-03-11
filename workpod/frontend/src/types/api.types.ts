// Match backend types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  emailVerified: boolean;
  preferences: UserPreferences;
  active: boolean;
}

export type PodStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'OFFLINE';

export interface Pod {
  id: string;
  name: string;
  status: PodStatus;
  hourlyRate: number;
  latitude: number;
  longitude: number;
  address: string;
  lockId: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED' | 'COMPLETED';
export type PaymentProvider = 'STRIPE' | 'PAYPAL';

export interface Booking {
  id: string;
  status: BookingStatus;
  userId: string;
  workPodId: string;
  startTime: string;
  endTime: string | null;
  totalAmount: number;
  paymentIntentId?: string;
  paymentProvider?: PaymentProvider;
  externalPaymentId?: string;
  pod: Pod;
}

export type NotificationType = 
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'PAYMENT_FAILED'
  | 'POD_MAINTENANCE'
  | 'PAYMENT_SUCCESS'
  | 'ACCESS_CODE_GENERATED';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  badge?: string;
  body?: string;
  data?: any;
  dir?: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  language: string;
  timezone: string;
} 