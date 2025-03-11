import { logger } from '@/shared/logger/index';
import { TTLockConfig, TTLockTokenResponse, TTLockResponse, AccessCode } from '../types/lock.types';
import { ttlockAPI } from './ttLockApi';
import { AppError, ErrorType } from '../../../shared/errors';
import { TTLock } from '../types/lock.types';

class TTLockError extends Error {
  code?: string;
  
  constructor(message: string, code?: number | string) {
    super(message);
    this.name = 'TTLockError';
    this.code = code?.toString();
  }
}

export interface TTLockServiceInterface {
  unlockDevice: (lockId: string) => Promise<boolean>;
  lockDevice: (lockId: string) => Promise<boolean>;
  generateAccessCode: (lockId: string) => Promise<AccessCode>;
  revokeAccessCode: (lockId: string, code: string) => Promise<void>;
  getToken(): Promise<void>;
  unlockPod(lockId: string): Promise<void>;
  lockPod(lockId: string): Promise<boolean>;
  getLocks(): Promise<any[]>;
  unlock: (lockId: string) => Promise<void>;
  verifyCode: (lockId: string, code: string) => Promise<boolean>;
}

export class TTLockServiceImpl implements TTLockServiceInterface {
  private config: TTLockConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.config = {
      clientId: process.env.TTLOCK_CLIENT_ID!,
      clientSecret: process.env.TTLOCK_CLIENT_SECRET!,
      tokenUrl: 'https://euapi.ttlock.com/oauth2/token',
      apiUrl: 'https://euapi.ttlock.com/v3'
    };
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken as string;
    }

    try {
      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'client_credentials'
        })
      });

      if (!response.ok) {
        throw new TTLockError('Failed to get access token', response.status);
      }

      const data = await response.json() as TTLockTokenResponse;
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      return this.accessToken;
    } catch (error) {
      logger.error('TTLock token error', error);
      throw error instanceof TTLockError ? error : new TTLockError('Failed to get access token');
    }
  }

  async unlockDevice(lockId: string): Promise<boolean> {
    try {
      const response = await ttlockAPI.unlockDevice(lockId);
      return response;
    } catch (error) {
      throw new AppError('Failed to unlock device', 500, ErrorType.POD);
    }
  }

  async lockDevice(lockId: string): Promise<boolean> {
    try {
      const response = await ttlockAPI.lockDevice(lockId);
      return response;
    } catch (error) {
      throw new AppError('Failed to lock device', 500, ErrorType.POD);
    }
  }

  async getAccessHistory(lockId: string): Promise<Array<{
    timestamp: Date;
    action: 'lock' | 'unlock';
    userId: string;
  }>> {
    const token = await this.getAccessToken();
    const response = await fetch(`${this.config.apiUrl}/lock/listOperationLog?lockId=${lockId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json() as { list: Array<{ timestamp: Date; action: 'lock' | 'unlock'; userId: string; }> };
    return data.list || [];
  }

  async generateAccessCode(lockId: string): Promise<AccessCode> {
    throw new Error('Method not implemented');
  }

  async revokeAccessCode(lockId: string, code: string): Promise<void> {
    throw new Error('Method not implemented');
  }

  async getToken(): Promise<void> {
    await this.getAccessToken();
  }

  async unlockPod(lockId: string): Promise<void> {
    await this.unlockDevice(lockId);
  }

  async lockPod(lockId: string): Promise<boolean> {
    return this.lockDevice(lockId);
  }

  async getLocks(): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async unlock(lockId: string): Promise<void> {
    await this.unlockDevice(lockId);
  }

  async verifyCode(lockId: string, code: string): Promise<boolean> {
    throw new Error('Method not implemented');
  }
}

export const ttlockService = new TTLockServiceImpl();