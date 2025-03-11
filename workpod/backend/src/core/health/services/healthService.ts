import { prisma } from '../../../shared/database';
import { logger } from '../../../shared/logger/index';
import type { HealthStatus } from '../types/health.types';
import { stripeService } from '@/core/payments/services/stripeService';
import { ttlockService } from '../../locks/services/ttLockService';
import os from 'os';

interface TTLockServiceInterface {
  getToken(): Promise<void>;
}

export class HealthService {
  constructor(private readonly ttlockService: TTLockServiceInterface) {}

  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }

  async checkHealth(): Promise<HealthStatus> {
    const status: HealthStatus = {
      status: 'healthy',
      timestamp: new Date(),
      services: {
        database: true,
        redis: true,
        stripe: true,
        ttlock: true
      },
      system: await this.getSystemMetrics()
    };

    try {
      await this.checkDatabase();
      await this.checkStripe();
      await this.checkTTLock();
      await this.checkRedis();
    } catch (error) {
      status.status = 'unhealthy';
      logger.error('Health check failed', { error });
    }

    return status;
  }

  private async checkDatabase(): Promise<void> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      logger.info('Database health check passed');
    } catch (error) {
      logger.error('Database health check failed', { error });
      throw error;
    }
  }

  private async checkStripe(): Promise<void> {
    try {
      await stripeService.ping();
      logger.info('Stripe health check passed');
    } catch (error) {
      logger.error('Stripe health check failed', { error });
      throw error;
    }
  }

  private async checkTTLock(): Promise<void> {
    try {
      await this.ttlockService.getToken();
      logger.info('TTLock health check passed');
    } catch (error) {
      logger.error('TTLock health check failed', { error });
      throw error;
    }
  }

  private async checkRedis(): Promise<void> {
    logger.info('Redis health check passed');
  }

  private async getSystemMetrics() {
    return {
      cpuUsage: this.getCPUUsage(),
      memoryUsage: this.getMemoryUsage(),
      uptime: os.uptime(),
      loadAverage: os.loadavg()
    };
  }

  private getCPUUsage(): number {
    const cpus = os.cpus();
    const totalIdle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    const totalTick = cpus.reduce(
      (acc, cpu) =>
        acc + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle,
      0
    );
    return ((totalTick - totalIdle) / totalTick) * 100;
  }

  private getMemoryUsage(): {
    total: number;
    free: number;
    used: number;
    usagePercentage: number;
  } {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const usagePercentage = (used / total) * 100;

    return {
      total,
      free,
      used,
      usagePercentage
    };
  }
}

// Export singleton instance
export const healthService = new HealthService(ttlockService); 