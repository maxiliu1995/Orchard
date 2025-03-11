// Import environment setup first
import './environment';

// Import core setup
import { prisma } from './database';
import { setupTestDatabase } from './utils/db/database.utils';

// Export utilities - be explicit about what we're exporting
export { cleanup, CleanupScope, setupTestDatabase } from './utils/db/database.utils';
export { generateTestEmail, generateTestToken, createTestUser } from './utils/auth/auth.utils';
export { createTestPod, createTestBooking } from './utils/pod/pod.utils';
export { prisma, testPrisma, withTestTransaction } from './database';

// Import and re-export mocks
export { mockStripe } from '@/test/mocks/services/payment/stripe.mock';
export { mockPayPal } from '@/test/mocks/services/payment/paypal.mock';

// Set test environment variables
process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.DATABASE_URL = "postgresql://postgres:password@localhost:5432/workpod_test";
process.env.TEST_DATABASE_URL = "postgresql://postgres:password@localhost:5432/workpod_test";
process.env.STRIPE_SECRET_KEY = 'test_stripe_key';

// Test lifecycle hooks
beforeAll(async () => {
  await setupTestDatabase();
  jest.setTimeout(60000);
});

beforeEach(async () => {
  const tables = ['Booking', 'LockAccessCode', 'WorkPod', 'User'];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});