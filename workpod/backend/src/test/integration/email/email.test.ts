import { describe, it, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import { emailService } from '../../../core/email/services';
import { NotificationType } from '../../../shared/types/notification.types';
import {
  prisma,
  cleanDatabase,
  setupTestDatabase
} from '../../setup/utils/test/test.utils';

describe('Email Integration', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
  });

  it('should send email', async () => {
    const result = await emailService.sendEmail(
      'test@example.com',
      NotificationType.BOOKING_CONFIRMED,
      'Test email'
    );
    expect(result).toBeTruthy();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
}); 