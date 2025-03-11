import { jest } from '@jest/globals';
import { prisma } from '@/test/setup/database';
import { cleanup } from '../db/cleanup.utils';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Reset all mocks between tests
export const resetMocks = () => {
  jest.clearAllMocks();
  jest.resetModules();
};

// Reset environment between tests
export const resetEnvironment = () => {
  process.env = {
    ...process.env,
    NODE_ENV: 'test',
    DATABASE_URL: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    JWT_SECRET: 'test-secret',
    STRIPE_SECRET_KEY: 'test-stripe-key',
    PAYPAL_CLIENT_ID: 'test-paypal-id',
    PAYPAL_CLIENT_SECRET: 'test-paypal-secret'
  };
};

// Setup test environment
export const setupTestEnvironment = async () => {
  resetEnvironment();
  resetMocks();
  await cleanup();
};

// Teardown test environment
export const teardownTestEnvironment = async () => {
  await cleanup();
  await prisma.$disconnect();
};

// Test helper to wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Test helper to catch errors
export const catchError = async (promise: Promise<any>) => {
  try {
    await promise;
    return null;
  } catch (error) {
    return error;
  }
};

// Test helper to mock Date.now()
export const mockDate = (isoDate: string) => {
  const now = new Date(isoDate).getTime();
  jest.spyOn(Date, 'now').mockImplementation(() => now);
};

// Test helper to restore Date.now()
export const restoreDate = () => {
  jest.spyOn(Date, 'now').mockRestore();
};

export const prismaClient = new PrismaClient();

export const cleanDatabase = async (prisma: PrismaClient) => {
  // Add tables to clean in the correct order based on foreign key constraints
  await prisma.booking.deleteMany();
  await prisma.workPod.deleteMany();
  await prisma.user.deleteMany();
};

export const setupTestDatabase = async () => {
  // Setup code for test database
  return true;
};

export const generateTestEmail = () => {
  return `test-${Math.random().toString(36).substring(7)}@example.com`;
};

// Add hashPassword function
export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

// Re-export prisma
export { prisma };
