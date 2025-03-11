import { PrismaClient } from '@prisma/client';
import type Stripe from 'stripe';
import type { PayPal } from '@/test/mocks/services/payment/paypal.mock';

export enum CleanupScope {
  USERS = 'users',
  BOOKINGS = 'bookings',
  PAYMENTS = 'payments',
  PODS = 'pods',
  ALL = 'all'
}

export interface TestContext {
  prisma: PrismaClient;
  mockStripe: jest.Mocked<Stripe>;
  mockPaypal: jest.Mocked<PayPal>;
}

export interface TestUser {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum PodStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

export interface TestBooking {
  id: string;
  userId: string;
  podId: string;
  status: BookingStatus;
  startTime?: Date;
  endTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  totalAmount?: number;
}

// Add helper type for creating test data
export type CreateTestUser = Omit<TestUser, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateTestBooking = Omit<TestBooking, 'id' | 'createdAt' | 'updatedAt'>; 