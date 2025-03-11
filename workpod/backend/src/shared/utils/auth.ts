import { Request } from 'express';
import { tokenService } from './token';

export const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

export const verifyAuthToken = async (token: string) => {
  return tokenService.verifyToken(token, 'access');
}; 