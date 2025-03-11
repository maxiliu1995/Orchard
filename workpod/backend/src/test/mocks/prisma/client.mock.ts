import { PrismaClient, Prisma } from '@prisma/client';
import { mockModels } from './models.mock';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $transaction: jest.fn().mockImplementation(/* ... */),
      ...mockModels
    }))
  };
}); 