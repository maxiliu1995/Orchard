import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/healthService';
import { logger } from '../../../shared/logger/index';
import { ttlockService } from '../../locks/services/ttLockService';

const healthService = new HealthService(ttlockService);

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  async getHealth(req: Request, res: Response) {
    const health = await this.healthService.check();
    res.json(health);
  }

  async check(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await this.healthService.checkHealth();
      res.json(status);
    } catch (error) {
      logger.error('Health check failed', { error });
      next(error);
    }
  }
}

export const healthController = new HealthController(healthService);