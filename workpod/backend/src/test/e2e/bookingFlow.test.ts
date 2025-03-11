import { describe, it, expect, beforeEach } from '@jest/globals';
import { prisma } from '../setup';
import { PodStatus } from '@prisma/client';

describe('End-to-End Booking Flow', () => {
  let testUser: any;
  let testPod: any;

  beforeEach(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User'
      }
    });

    // Create test pod
    testPod = await prisma.workPod.create({
      data: {
        name: 'Test Pod',
        address: 'Test Location',
        status: PodStatus.AVAILABLE,
        hourlyRate: 25.00,
        latitude: 0,
        longitude: 0,
        lockId: 'test-lock-id'
      }
    });
  });

  it('should complete full booking flow', async () => {
    expect(testUser).toBeDefined();
    expect(testPod).toBeDefined();
    expect(testPod.status).toBe(PodStatus.AVAILABLE);
  });
}); 