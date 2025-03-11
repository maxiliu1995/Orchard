import { describe, it, expect, beforeEach } from '@jest/globals';
import { profileService } from '../../../core/users/services/profileService';
import { prisma } from '../../setup/database';
import { cleanup } from '../../setup/utils/db/database.utils';
import { generateTestEmail, hashPassword } from '../../setup/utils/auth/auth.utils';
import { User } from '@prisma/client';

describe('ProfileService', () => {
  let testUser: User;

  beforeEach(async () => {
    await cleanup();
    testUser = await prisma.user.create({
      data: {
        email: generateTestEmail(),
        password: await hashPassword('Password123!'),
        firstName: 'Test',
        lastName: 'User'
      }
    });
  });

  it('should update user profile', async () => {
    const updatedProfile = await profileService.updateProfile(testUser.id, {
      firstName: 'Updated',
      lastName: 'Name'
    });

    expect(updatedProfile.firstName).toBe('Updated');
    expect(updatedProfile.lastName).toBe('Name');
  });
}); 