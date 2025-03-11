import { prisma } from '@/shared/database/index';
import { User } from '@prisma/client';
import { NotFoundError } from '@/shared/errors/appError';
import { Booking } from '@prisma/client';

type UserProfile = Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;

export interface IUserService {
  getProfile(userId: string): Promise<UserProfile>;
  updateProfile(userId: string, data: Partial<User>): Promise<UserProfile>;
  getBookingHistory(userId: string): Promise<Booking[]>;
  deleteAccount(userId: string): Promise<void>;
}

export const userService: IUserService = {
  getProfile: async (userId: string): Promise<UserProfile> => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true }
    });
    if (!user) throw new NotFoundError('User not found');
    return user;
  },
  updateProfile: async (userId: string, data: Partial<User>): Promise<UserProfile> => {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, firstName: true, lastName: true }
    });
  },
  async getBookingHistory(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      include: { workPod: true }
    });
  },
  async deleteAccount(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');
    await prisma.user.delete({ where: { id: userId } });
  }
}; 