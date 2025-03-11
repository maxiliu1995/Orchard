import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { prisma } from '../../setup/database';
import { cleanup } from '../../setup/utils/db/database.utils';
import { authService } from '../../../core/auth/services/authService';
import { seedTestDatabase } from '../../setup/utils/db/seed.utils';

describe('Auth Integration', () => {
  let testData: Awaited<ReturnType<typeof seedTestDatabase>>;

  beforeEach(async () => {
    await cleanup();
    testData = await seedTestDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Login Flow', () => {
    it('should authenticate valid user', async () => {
      const result = await authService.login({
        email: testData.user.email,
        password: 'password123' // From seed data
      });

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      await expect(
        authService.login({
          email: testData.user.email,
          password: 'wrongpassword'
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('Registration Flow', () => {
    it('should register new user', async () => {
      const newUser = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      const result = await authService.register(newUser);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(newUser.email);
      expect(result.accessToken).toBeDefined();
    });

    it('should prevent duplicate email registration', async () => {
      await expect(
        authService.register({
          email: testData.user.email, // Already exists in seed
          password: 'password123',
          firstName: 'Duplicate',
          lastName: 'User'
        })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('Password Reset Flow', () => {
    it('should handle password reset process', async () => {
      // Initiate reset
      const { token } = await authService.initiatePasswordReset(testData.user.email);
      expect(token).toBeDefined();

      // Validate token
      await expect(
        authService.validateResetToken(token)
      ).resolves.toBe(true);

      // Reset password
      await authService.resetPassword(token, 'newpassword123');

      // Verify new password works
      const loginResult = await authService.login({
        email: testData.user.email,
        password: 'newpassword123'
      });

      expect(loginResult.user).toBeDefined();
    });
  });
}); 