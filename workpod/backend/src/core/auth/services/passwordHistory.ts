import { prisma } from '@/shared/database';
import { comparePasswords } from '@/shared/utils/password';

export const passwordHistoryService = {
  async add(userId: string, hashedPassword: string) {
    return prisma.passwordHistory.create({
      data: {
        userId,
        password: hashedPassword
      }
    });
  },

  async getRecent(userId: string, limit = 5) {
    return prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}; 