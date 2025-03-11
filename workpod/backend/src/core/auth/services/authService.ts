import { prisma } from '@/shared/database';
import { hashPassword, comparePasswords } from '@/shared/utils/password';
import { tokenService } from '@/shared/utils/token';
import { validateEmail, validatePassword, validateName } from '@/shared/utils/validation';
import { AppError, ErrorType } from '@/shared/errors';
import { logger } from '@/shared/logger/index';
import { AuthResponse } from '../types/auth.types';
import { passwordHistoryService } from './passwordHistory';

interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class AuthService {
  private trimRegistrationData(data: UserRegistrationData): UserRegistrationData {
    return {
      ...data,
      email: data.email.trim().toLowerCase(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim()
    };
  }

  private async validateRegistrationData(data: UserRegistrationData) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      throw new AppError('Invalid email format', 400, ErrorType.AUTH);
    }

    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      throw new AppError('Invalid password format', 400, ErrorType.AUTH);
    }

    const firstNameValidation = validateName(data.firstName, 'First name');
    if (!firstNameValidation.isValid) {
      throw new AppError(firstNameValidation.error || 'Invalid first name', 400, ErrorType.AUTH);
    }

    const lastNameValidation = validateName(data.lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      throw new AppError(lastNameValidation.error || 'Invalid last name', 400, ErrorType.AUTH);
    }
  }

  async register(data: UserRegistrationData): Promise<AuthResponse> {
    try {
      const trimmedData = this.trimRegistrationData(data);
      await this.validateRegistrationData(trimmedData);
      
      const existingUser = await prisma.user.findUnique({
        where: { email: trimmedData.email.toLowerCase() }
      });

      if (existingUser) {
        throw new AppError('Email already exists', 409, ErrorType.AUTH);
      }

      const hashedPassword = await hashPassword(trimmedData.password);

      const user = await prisma.user.create({
        data: {
          email: trimmedData.email,
          password: hashedPassword,
          firstName: trimmedData.firstName,
          lastName: trimmedData.lastName
        }
      });

      // Generate tokens
      const accessToken = await tokenService.generateAccessToken(user);
      const refreshToken = await tokenService.generateRefreshToken(user);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        accessToken,
        refreshToken,
        token: accessToken
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;  // Propagate validation errors directly
      }
      logger.error('Registration failed', { error, email: data.email });
      throw new AppError('Registration failed. Please try again later.', 500, ErrorType.AUTH);
    }
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
      if (!user) throw new AppError('Invalid credentials', 401, ErrorType.AUTH);
      
      const isValid = await comparePasswords(data.password, user.password);
      if (!isValid) throw new AppError('Invalid credentials', 401, ErrorType.AUTH);

      const tokens = await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        });

        const tokens = await tokenService.generateTokenPair(user.id, user.email);

        // Delete any existing sessions first
        await tx.session.deleteMany({
          where: { userId: user.id }
        });

        // Create new session with refresh token
        await tx.session.create({
          data: {
            userId: user.id,
            token: tokens.refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          }
        });

        return tokens;
      });

      logger.info('User logged in successfully', { userId: user.id });
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          lastLoginAt: user.lastLoginAt || new Date()
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        token: tokens.accessToken
      };

    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Login failed', { error, email: data.email });
      throw new AppError('Login failed. Please try again later.', 500, ErrorType.AUTH);
    }
  }

  async initiatePasswordReset(email: string): Promise<{ token: string }> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      throw new AppError('User not found', 404, ErrorType.AUTH);
    }

    // Generate reset token
    const token = await tokenService.generateAccessToken(user);

    // Delete any existing reset tokens for this user
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id }
    });

    // Create new reset token record with shorter expiration
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }
    });

    return { token };
  }

  async validateToken(token: string) {
    try {
      const decoded = await tokenService.verifyToken(token, 'access');
      return decoded;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Token expired', 401, ErrorType.AUTH);
      }
      throw new AppError('Invalid token', 400, ErrorType.AUTH);
    }
  }

  async validateResetToken(token: string) {
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetRecord) {
      throw new AppError('Invalid password reset token', 400, ErrorType.AUTH);
    }

    if (resetRecord.expiresAt < new Date()) {
      throw new AppError('Password reset token has expired', 400, ErrorType.AUTH);
    }

    return true;
  }

  async resetPassword(token: string, newPassword: string) {
    const resetRecord = await prisma.passwordReset.findFirst({
      where: { token },
      include: { 
        user: { 
          include: { passwordHistory: { orderBy: { createdAt: 'desc' }, take: 5 } } 
        } 
      }
    });

    if (!resetRecord) {
      throw new AppError('Invalid password reset token', 400, ErrorType.AUTH);
    }

    // Ensure we're comparing timestamps correctly
    const now = Date.now();
    const expiresAt = resetRecord.expiresAt.getTime();
    
    if (expiresAt < now) {
      throw new AppError('Password reset token has expired', 400, ErrorType.AUTH);
    }

    // Check against current password first
    const currentPasswordMatch = await comparePasswords(newPassword, resetRecord.user.password);
    if (currentPasswordMatch) {
      throw new AppError('Cannot reuse any of your last 5 passwords', 400, ErrorType.AUTH);
    }

    // Then check password history
    for (const historyEntry of resetRecord.user.passwordHistory) {
      const matches = await comparePasswords(newPassword, historyEntry.password);
      if (matches) {
        throw new AppError('Cannot reuse any of your last 5 passwords', 400, ErrorType.AUTH);
      }
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { 
          password: hashedPassword,
          passwordHistory: {
            create: { password: hashedPassword }
          }
        }
      }),
      prisma.passwordReset.delete({
        where: { id: resetRecord.id }
      })
    ]);
  }

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    const session = await prisma.session.findFirst({
      where: { token }
    });

    if (!session || session.expiresAt < new Date()) {
      throw new AppError('Invalid refresh token', 401, ErrorType.AUTH);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!user) {
      throw new AppError('User not found', 404, ErrorType.AUTH);
    }

    return tokenService.generateTokenPair(user.id, user.email);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { passwordHistory: { orderBy: { createdAt: 'desc' }, take: 5 } }
    });

    if (!user) {
      throw new AppError('User not found', 404, ErrorType.AUTH);
    }

    const isValid = await comparePasswords(currentPassword, user.password);
    if (!isValid) {
      throw new AppError('Invalid current password', 401, ErrorType.AUTH);
    }

    // Check if new password matches any recent passwords
    for (const historyEntry of user.passwordHistory) {
      const matches = await comparePasswords(newPassword, historyEntry.password);
      if (matches) {
        throw new AppError('Cannot reuse any of your last 5 passwords', 400, ErrorType.AUTH);
      }
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedPassword,
        passwordHistory: {
          create: { password: hashedPassword }
        }
      }
    });
  }
}

export const authService = new AuthService();