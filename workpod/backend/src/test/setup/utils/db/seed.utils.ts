import { prisma } from '../../database';
import { hashPassword } from '../auth/auth.utils';

export const seedTestDatabase = async () => {
  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: await hashPassword('password123'),
      firstName: 'Test',
      lastName: 'User'
    }
  });

  // Create test pod
  const pod = await prisma.workPod.create({
    data: {
      name: 'Test Pod',
      status: 'AVAILABLE',
      hourlyRate: 25,
      latitude: 51.5074,
      longitude: -0.1278,
      address: 'Test Location',
      lockId: 'test-lock-id'
    }
  });

  return { user, pod };
}; 