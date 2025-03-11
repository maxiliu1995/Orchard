import { prisma } from '@/test/setup/database';
import { generateTestEmail, hashPassword } from '../../utils/auth/auth.utils';
import type { User } from '@prisma/client';

// Test user data generator
export const generateUserData = (overrides = {}) => ({
  email: generateTestEmail(),
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'User',
  ...overrides
});

// Create test user with options
export const createTestUser = async (overrides = {}) => {
  const userData = generateUserData(overrides);
  const hashedPassword = await hashPassword(userData.password);

  return prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword
    }
  });
};

// Create multiple test users
export const createTestUsers = async (count: number) => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push(await createTestUser());
  }
  return users;
};

// Validate user response shape
export const validateUserResponse = (user: any) => {
  expect(user).toMatchObject({
    id: expect.any(String),
    email: expect.stringMatching(/@example.com$/),
    firstName: expect.any(String),
    lastName: expect.any(String),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date)
  });
  // Password should not be included in response
  expect(user).not.toHaveProperty('password');
}; 