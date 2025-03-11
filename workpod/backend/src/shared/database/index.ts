import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { logger } from '@/shared/logger/index';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create singleton Prisma instance
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: config.database.url
      }
    }
  });

  // Add logging
  client.$use(async (params, next) => {
    const startTime = Date.now();
    const result = await next(params);
    const duration = Date.now() - startTime;
    logger.debug('Database query', { model: params.model, action: params.action, duration });
    return result;
  });

  return client;
};

// Export singleton instance
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Export cleanup utility for tests
export const cleanDatabase = async () => {
  const models = Reflect.ownKeys(prisma).filter(key => 
    typeof key === 'string' && 
    !key.startsWith('_') && 
    typeof prisma[key] === 'object'
  );
  return Promise.all(models.map(model => prisma[model].deleteMany?.()));
};