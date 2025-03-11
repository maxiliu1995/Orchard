export enum CleanupScope {
  ALL = 'all',
  USERS = 'users',
  BOOKINGS = 'bookings',
  PODS = 'pods',
  PAYMENTS = 'payments'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

export interface TestTransaction {
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
}
