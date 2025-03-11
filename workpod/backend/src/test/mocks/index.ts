// Service mocks
export * from './services/payment/stripe.mock';
export * from './services/payment/paypal.mock';
export * from './services/notification/notification.mock';
export * from './services/lock/lock.service';
export * from './services/booking/booking.mock';

// Utility mocks
export * from './utils/token.mock';

// Aliases for backward compatibility
export { mockTTLock } from './services/lock/ttlock.mock'; 