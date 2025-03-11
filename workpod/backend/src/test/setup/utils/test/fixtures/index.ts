export * from './user.fixtures';
export * from './pod.fixtures';
export * from './booking.fixtures';

import { prisma } from '@/test/setup';

export const seedDatabase = async () => {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User'
    }
  });

  const pod = await prisma.workPod.create({
    data: {
      name: 'Test Pod 1',
      status: 'AVAILABLE',
      hourlyRate: 25.00,
      latitude: 0,
      longitude: 0,
      address: 'Test Location',
      lockId: 'test-lock-1'
    }
  });

  return { user, pods: [pod] };
}; 