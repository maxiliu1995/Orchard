import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import { logger } from '@/shared/logger/index';
import { UnauthorizedError } from '@/shared/errors/appError';
import { AuthenticatedRequest } from '@/shared/types/express';

export const userController = {
  getProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('User not authenticated');
      }
      const profile = await userService.getProfile(req.user.id);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await userService.updateProfile(req.user!.id, req.body);
      res.json(profile);
    } catch (error) {
      logger.error('Update profile failed', { error, userId: req.user?.id });
      next(error);
    }
  }
}; 