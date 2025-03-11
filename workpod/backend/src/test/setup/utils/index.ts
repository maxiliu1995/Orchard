// Import from mocks directory
import { mockStripe } from '@/test/mocks/services/payment/stripe.mock';
import { mockTTLock } from '@/test/mocks/services/lock/ttlock.mock';

// Import from local setup
import { prisma, cleanDatabase } from '../database';
import { testContext } from '../context';

// Export utilities by category
export {
  // Database
  prisma,
  cleanDatabase,
  
  // Test context
  testContext,
  
  // Mocks
  mockStripe,
  mockTTLock
};

// Database utilities
export * from './db';

// Auth utilities
export * from './auth';

// Test utilities
export * from './test';

// User utilities
export * from './user'; 