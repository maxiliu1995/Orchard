import { Request, Response, NextFunction } from 'express';
import { AuthError } from '@/shared/errors';
import { tokenService } from '@/shared/utils/token';
import { AuthenticatedRequest } from '@/shared/types/express';

export const authMiddleware = async (
  req: Request,
  res: Response, 
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    // For test environment
    if (process.env.NODE_ENV === 'test' && token.startsWith('test-token-')) {
      const userId = token.split('test-token-')[1];
      (req as AuthenticatedRequest).user = { id: userId };
      return next();
    }

    const decoded = await tokenService.verifyToken(token, 'access');
    (req as AuthenticatedRequest).user = { id: decoded.userId };
    next();
  } catch (error) {
    next(new AuthError('Invalid or expired token'));
  }
}; 