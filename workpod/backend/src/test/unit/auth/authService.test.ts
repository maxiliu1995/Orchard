import { prisma } from '../../setup/database';
import { cleanup } from '../../setup/utils/db/database.utils';
import { generateTestEmail } from '../../setup/utils/auth/auth.utils';
import { AuthService } from '../../../core/auth/services/authService';
import { AuthenticationError as UnauthorizedError } from '../../../shared/errors/appError';
import { tokenService } from '../../../shared/utils/token';
import { 
  PasswordResetTokenExpiredError,
  InvalidPasswordResetTokenError 
} from '../../../shared/errors/authError';

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('AuthService', () => {
  let authService: AuthService;

  const testUser = {
    email: 'test@example.com',
    password: 'StrongPassword123!',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '+1234567890'
  };

  beforeEach(async () => {
    await cleanup();
    authService = new AuthService();
    testUser.email = generateTestEmail();
  });

  describe('register', () => {
    it('should create new user account', async () => {
      const result = await authService.register(testUser);
      
      expect(result.user.email).toBe(testUser.email);
      const dbUser = await prisma.user.findUnique({ 
        where: { email: testUser.email } 
      });
      expect(dbUser?.password).not.toBe(testUser.password);
      expect(result.user).toHaveProperty('id');
      expect(result).toHaveProperty('accessToken');
    });

    it('should throw error for duplicate email', async () => {
      await authService.register(testUser);
      
      await expect(authService.register(testUser))
        .rejects
        .toThrow('Email already registered');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await authService.register(testUser);
    });

    it('should authenticate valid credentials', async () => {
      const result = await authService.login({
        email: testUser.email,
        password: testUser.password
      });

      expect(result).toHaveProperty('accessToken');
      expect(result.user.email).toBe(testUser.email);
    });

    it('should reject invalid password', async () => {
      await expect(authService.login({
        email: testUser.email,
        password: 'wrongpassword'
      })).rejects.toThrow(UnauthorizedError);
    });

    it('should reject non-existent user', async () => {
      await expect(authService.login({
        email: 'nonexistent@example.com',
        password: 'anypassword'
      })).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('validateToken', () => {
    let validToken: string;

    beforeEach(async () => {
      const result = await authService.register(testUser);
      validToken = result.accessToken;
    });

    it('should validate valid token', async () => {
      const validated = await authService.validateToken(validToken);
      expect(validated).toHaveProperty('userId');
    });

    it('should reject invalid token', async () => {
      jest.spyOn(tokenService, 'verifyToken')
        .mockImplementation(() => { throw new UnauthorizedError('Invalid token'); });
      
      await expect(authService.validateToken('invalid-token'))
        .rejects
        .toThrow(UnauthorizedError);
    });
  });

  describe('resetPassword', () => {
    let resetToken: string;

    beforeEach(async () => {
      await authService.register(testUser);
      const result = await authService.initiatePasswordReset(testUser.email);
      resetToken = result.token;
    });

    it('should update password with valid reset token', async () => {
      const newPassword = 'NewPassword123!';
      await authService.resetPassword(resetToken, newPassword);

      // Should be able to login with new password
      const result = await authService.login({
        email: testUser.email,
        password: newPassword
      });
      expect(result).toHaveProperty('accessToken');
    });

    it('should reject invalid reset token', async () => {
      await expect(authService.resetPassword(
        'invalid-token',
        'NewPassword123!'
      )).rejects.toThrow(InvalidPasswordResetTokenError);
    });

    it('should reject expired reset token', async () => {
      // Mock findFirst to return an expired token record
      jest.spyOn(prisma.passwordReset, 'findFirst')
        .mockResolvedValueOnce({
          id: '1',
          token: resetToken,
          userId: 'user-1',
          expiresAt: new Date(Date.now() - 1000), // Expired
          createdAt: new Date()
        });

      await expect(authService.resetPassword(
        resetToken,
        'NewPassword123!'
      )).rejects.toThrow(PasswordResetTokenExpiredError);
    });
  });
}); 