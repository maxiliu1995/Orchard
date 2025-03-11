import { execSync } from 'child_process';

// Test environment variables
export const setupTestEnvironment = () => {
  process.env.JWT_ACCESS_SECRET = 'test-access-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
  process.env.DATABASE_URL = "postgresql://postgres:password@localhost:5432/workpod_test";
  process.env.TEST_DATABASE_URL = "postgresql://test:test@localhost:5432/workpod_test";
  process.env.STRIPE_SECRET_KEY = 'test_stripe_key';
  process.env.NODE_ENV = 'test';
};

// Database reset function
export const resetTestDatabase = async () => {
  if (!process.env.TEST_DATABASE_URL) {
    throw new Error('TEST_DATABASE_URL is not defined');
  }

  execSync('npx prisma db push --force-reset --accept-data-loss', {
    env: {
      ...process.env,
      NODE_ENV: 'test',
      DATABASE_URL: process.env.TEST_DATABASE_URL
    },
    stdio: 'inherit'
  });
}; 