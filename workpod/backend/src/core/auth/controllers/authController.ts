import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { logger } from '@/shared/logger/index';

interface AuthRequest extends Request {
  user: any; // Replace 'any' with your User type if available
}

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });
      res.json(result);
    } catch (error) {
      logger.error('Login failed', { error, email: req.body.email });
      res.status(400).json({ error: error.message });
    }
  }

  register = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      logger.error('Registration failed', { error });
      res.status(400).json({ error: error.message });
    }
  }

  logout = async (_req: Request, res: Response) => {
    // TODO: Implement logout logic
    res.status(200).json({ message: 'Logged out successfully' });
  }

  refreshToken = async (_req: Request, res: Response) => {
    // TODO: Implement token refresh logic
    res.status(200).json({ message: 'Token refreshed' });
  }

  async getCurrentUser(req: AuthRequest, res: Response) {
    const user = req.user;
    return res.json(user);
  }
} 