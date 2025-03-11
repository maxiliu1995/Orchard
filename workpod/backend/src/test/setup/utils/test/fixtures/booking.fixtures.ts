import { testUser } from './user.fixtures';
import { testPod } from './pod.fixtures';

export const testBooking = {
  id: 'test-booking-id',
  userId: testUser.id,
  workPodId: testPod.id,
  startTime: new Date(),
  endTime: new Date(Date.now() + 3600000),
  status: 'PENDING',
  totalAmount: null,
  paymentIntentId: null,
  paymentProvider: null,
  externalPaymentId: null,
  createdAt: new Date(),
  updatedAt: new Date()
} as const; 