import { beforeAll, afterAll, beforeEach } from '@jest/globals';
import { setupTestEnvironment, resetTestDatabase } from './environment';
import { testPrisma, cleanTestDatabase, closeTestDatabase } from './database';

export default async function globalSetup() {
  // Setup environment variables
  setupTestEnvironment();
  
  // Create a temporary prisma instance just for setup
  const prisma = testPrisma;
  await prisma.$disconnect();

  // Reset the database
  await resetTestDatabase();
}

beforeAll(async () => {
  // Clean database before all tests
  await cleanTestDatabase();
});

afterAll(async () => {
  // Clean up and close connection after all tests
  await cleanTestDatabase();
  await closeTestDatabase();
});

beforeEach(async () => {
  // Clean database before each test
  await cleanTestDatabase();
}); 