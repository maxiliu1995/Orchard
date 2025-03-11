import { PrismaClient } from '@prisma/client';

export const cleanDatabase = async (prisma: PrismaClient) => {
  await prisma.booking.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workPod.deleteMany();
}; 