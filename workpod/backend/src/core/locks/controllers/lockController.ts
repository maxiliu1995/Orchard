import { Request, Response, NextFunction } from 'express';
import { LockService } from '../services/lockService';
import { logger } from '@/shared/logger/index';
import { AuthenticatedRequest } from '@/shared/types/express';
import { ttlockService } from '../services/ttLockService';

export class LockController {
  private static instance: LockController;
  
  private constructor(private lockService: LockService) {}
  
  public static getInstance(): LockController {
    if (!LockController.instance) {
      const lockService = LockService.getInstance();
      LockController.instance = new LockController(lockService);
    }
    return LockController.instance;
  }

  async getLocks(req: Request, res: Response) {
    const locks = await this.lockService.getLocks();
    res.json(locks);
  }

  async getLockById(req: Request, res: Response) {
    const lock = await this.lockService.getLockById(req.params.id);
    res.json(lock);
  }

  async createLock(req: Request, res: Response) {
    const lock = await this.lockService.createLock(req.body);
    res.status(201).json(lock);
  }

  async updateLock(req: Request, res: Response) {
    const lock = await this.lockService.updateLock(req.params.id, req.body);
    res.json(lock);
  }

  async generateAccessCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      const code = await this.lockService.generateAccessCode(bookingId);
      res.json(code);
    } catch (error) {
      logger.error('Generate access code failed', { error, bookingId: req.params.bookingId });
      next(error);
    }
  }

  async revokeAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      await this.lockService.revokeAccess(bookingId);
      res.json({ success: true });
    } catch (error) {
      logger.error('Revoke access failed', { error, bookingId: req.params.bookingId });
      next(error);
    }
  }

  async verifyAccessCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      const { code } = req.body;
      const isValid = await this.lockService.verifyAccessCode(bookingId, code);
      res.json({ isValid });
    } catch (error) {
      logger.error('Verify access code failed', { error, bookingId: req.params.bookingId });
      next(error);
    }
  }

  async validateAccessCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { podId } = req.params;
      const { code } = req.body;
      const isValid = await this.lockService.validateAccessCode(podId, code);
      res.json({ isValid });
    } catch (error) {
      logger.error('Validate access code failed', { error, podId: req.params.podId });
      next(error);
    }
  }

  async unlock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await this.lockService.unlock(req.params.podId);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async lock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await this.lockService.lock(req.params.podId);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  static async unlock(req: Request, res: Response) {
    const { lockId } = req.body;
    await ttlockService.unlock(lockId);
    res.json({ success: true });
  }

  static async lock(req: Request, res: Response) {
    const { lockId } = req.body;
    await ttlockService.lockDevice(lockId);
    res.json({ success: true });
  }

  static async generateAccessCode(req: Request, res: Response) {
    const { lockId } = req.body;
    const code = await ttlockService.generateAccessCode(lockId);
    res.json(code);
  }

  static async verifyCode(req: Request, res: Response) {
    const { lockId, code } = req.body;
    const isValid = await ttlockService.verifyCode(lockId, code);
    res.json({ isValid });
  }

  static async revokeAccess(req: Request, res: Response) {
    const { lockId, code } = req.params;
    await ttlockService.revokeAccessCode(lockId, code);
    res.json({ success: true });
  }

  static async logAccess(req: Request, res: Response) {
    // Implement access logging
    res.json({ success: true });
  }

  static async getAccessHistory(req: Request, res: Response) {
    const { userId } = req.params;
    // Implement access history retrieval
    res.json([]);
  }

  static async getLocks(req: Request, res: Response) {
    const locks = await ttlockService.getLocks();
    res.json(locks);
  }
}

export const lockController = LockController.getInstance(); 