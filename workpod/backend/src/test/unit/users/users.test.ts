import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { profileService } from '../../../core/users/services/profileService';
import { prisma } from '../../setup/database';
import { cleanup } from '../../setup/utils/db/database.utils';
import { generateTestEmail, hashPassword, createTestUser } from '../../setup/utils/auth/auth.utils';
import { User } from '@prisma/client';
import request from 'supertest';
import app from '../../../app';

describe('Users Endpoints', () => {
  let testUser: any;

  beforeEach(async () => {
    await cleanup();
    testUser = await createTestUser();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile successfully', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', testUser.token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', testUser.user.email);
      expect(res.body).toHaveProperty('firstName', testUser.user.firstName);
      expect(res.body).toHaveProperty('lastName', testUser.user.lastName);
    });

    it('should not get profile without auth token', async () => {
      const res = await request(app)
        .get('/api/users/profile');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'User not authenticated');
    });
  });
});