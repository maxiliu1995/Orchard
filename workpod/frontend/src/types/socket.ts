import { BookingStatus } from './booking';
import { LockStatus } from './lock';

export interface ServerToClientEvents {
  'booking-update': (data: { status: BookingStatus }) => void;
  'lock-status': (data: { status: LockStatus }) => void;
  'payment-update': (data: { status: string }) => void;
}

export interface ClientToServerEvents {
  'join-booking': (bookingId: string) => void;
  'join-pod': (podId: string) => void;
  'leave-booking': (bookingId: string) => void;
  'leave-pod': (podId: string) => void;
} 