import { PrismaClient } from '@prisma/client';
import { logger } from '@/shared/logger/index';
import { execSync } from 'child_process';

// Database configuration
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ?? 'postgresql://test:test@localhost:5432/workpod_test';

// Create Prisma clients
export const prisma = new PrismaClient();

export const testPrisma = new PrismaClient({
  datasources: { db: { url: TEST_DATABASE_URL } },
  log: ['error', 'warn']
});

// Transaction wrapper
export const withTestTransaction = async <T>(
  callback: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>
): Promise<T> => {
  try {
    return await testPrisma.$transaction(callback);
  } catch (error) {
    logger.error('Transaction failed:', error);
    throw error;
  }
};

// Database management functions
export const cleanDatabase = async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Cannot clean database outside test environment');
    }
    
    await testPrisma.$executeRaw`DROP SCHEMA IF EXISTS public CASCADE`;
    await testPrisma.$executeRaw`CREATE SCHEMA public`;
    
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL }
    });
  } catch (error) {
    logger.error('Database cleanup failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  await testPrisma.$disconnect();
};

export const setupTestDatabase = async () => {
  try {
    await testPrisma.$connect();
    await cleanDatabase();
  } catch (error) {
    console.error('Test database setup failed:', error);
    throw error;
  }
}; 