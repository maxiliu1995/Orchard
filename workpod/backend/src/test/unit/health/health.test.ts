// Third-party imports
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// App imports
import app from '../../../app';

// Test utilities
import { prisma } from '../../setup/database';

describe('Health Check', () => {
  beforeAll(async () => {
    // Ensure database connection
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should report healthy when database is connected', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'healthy',
        database: 'connected'
      })
    );
  });
}); 