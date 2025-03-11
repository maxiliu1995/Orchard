import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database';

// Generate test data
export const generateTestEmail = () => `test-${uuidv4()}@example.com`;
export const generateTestPassword = () => 'Password123!';

// Create test user with hashed password
export const createTestUser = async () => {
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  const user = await prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User'
    }
  });

  return {
    user,
    token: `Bearer mock-valid-token-${user.id}`
  };
};

export const generateTestToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

// Auth validation
export const validateTestToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
  } catch (error) {
    return null;
  }
};

// Password utilities
export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};
