import { prisma } from '../../setup/database';
import { cleanup } from '../../setup/utils/db/database.utils';
import { authService } from '../../../core/auth/services/authService';
import { tokenService } from '../../../shared/utils/token';
import { comparePasswords } from '../../../shared/utils/password';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Auth Module', () => {
  beforeEach(async () => {
    await cleanup();
  });

  describe('User Registration', () => {
    it('should register new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await authService.register(userData);
      expect(response.user.email).toBe(userData.email);
      expect(response.accessToken).toBeDefined();
    });

    it('should reject registration with existing email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };

      await authService.register(userData);

      await expect(authService.register(userData))
        .rejects
        .toThrow('Email already registered');
    });

    it('should hash password before saving', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };

      await authService.register(userData);
      const savedUser = await prisma.user.findUnique({ 
        where: { email: userData.email } 
      });

      const passwordMatch = await comparePasswords(
        userData.password,
        savedUser!.password
      );

      expect(passwordMatch).toBe(true);
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
      // Create test user
      await authService.register({
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      });
    });

    it('should login user with valid credentials', async () => {
      const result = await authService.login({
        email: 'test@example.com',
        password: 'Password123!'
      });

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
    });

    it('should reject invalid credentials', async () => {
      await expect(authService.login({
        email: 'test@example.com',
        password: 'WrongPassword123!'
      })).rejects.toThrow('Invalid credentials');
    });

    it('should generate valid token', async () => {
      const result = await authService.login({
        email: 'test@example.com',
        password: 'Password123!'
      });

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });
  });

  describe('Password Reset', () => {
    let userId: string;

    beforeEach(async () => {
      const response = await authService.register({
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      });
      userId = response.user.id;  // Store the userId for use in tests
    });

    it('should initiate password reset', async () => {
      const result = await authService.initiatePasswordReset('test@example.com');
      expect(result).toHaveProperty('token');
      
      const resetRecord = await prisma.passwordReset.findFirst({
        where: { userId }  // Use the stored userId here
      });
      
      expect(resetRecord).not.toBeNull();
    });

    it('should validate reset token', async () => {
      const { token } = await authService.initiatePasswordReset('test@example.com');
      
      const isValid = await authService.validateResetToken(token);
      
      expect(isValid).toBe(true);
    });

    it('should update password with valid token', async () => {
      const { token } = await authService.initiatePasswordReset('test@example.com');
      const newPassword = 'NewPassword123!';
      
      await authService.resetPassword(token, newPassword);
      
      // Try logging in with new password
      const loginResult = await authService.login({
        email: 'test@example.com',
        password: newPassword
      });
      
      expect(loginResult).toHaveProperty('token');
    });
  });
}); 