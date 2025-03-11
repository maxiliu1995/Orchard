import { PrismaClient } from '@prisma/client';
import { config } from '../../shared/config';

declare global {
  var __testPrisma: PrismaClient | undefined;
}

const createTestPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: config.database.url
      }
    },
    log: ['error', 'warn']
  });
};

export const testPrisma = global.__testPrisma || createTestPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__testPrisma = testPrisma;
}

export const cleanTestDatabase = async () => {
  const models = Reflect.ownKeys(testPrisma).filter(key => 
    typeof key === 'string' && 
    !key.startsWith('_') && 
    typeof testPrisma[key] === 'object'
  );
  
  await Promise.all(
    models.map(model => testPrisma[model].deleteMany?.())
  );
};

export const closeTestDatabase = async () => {
  await testPrisma.$disconnect();
}; 