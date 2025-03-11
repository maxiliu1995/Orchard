export type LockStatus = 'LOCKED' | 'UNLOCKED' | 'ERROR';

export interface AccessCode {
  code: string;
  validFrom: Date;
  validUntil: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  expiresAt: Date;
}

export interface LockDevice {
  id: string;
  name: string;
  status: 'LOCKED' | 'UNLOCKED';
  batteryLevel: number;
}

export type LockOperation = 'LOCK' | 'UNLOCK';

export interface TTLockConfig {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  apiUrl: string;
}

export interface TTLockTokenResponse {
  access_token: string;
  expires_in: number;
}

export interface TTLockResponse {
  success: boolean;
  list?: any[];
}

export interface TTLock {
  generateAccessCode: (lockId: string) => Promise<AccessCode>;
  lockDevice: (lockId: string) => Promise<boolean>;
  unlockDevice: (lockId: string) => Promise<boolean>;
  verifyCode: (lockId: string, code: string) => Promise<boolean>;
}

export interface TTLockService extends TTLock {
  lockPod: (lockId: string) => Promise<boolean>;
  unlockPod: (lockId: string) => Promise<void>;
  getLocks: () => Promise<any[]>;
  unlock: (lockId: string) => Promise<void>;
}

export class LockService {
  constructor(private ttlock: TTLockService) {}
  // ... rest of the class
} 