export type LockStatus = 'LOCKED' | 'UNLOCKED' | 'ERROR';

export interface LockAccessCode {
  code: string;
  validFrom: string | Date;
  validUntil: string | Date;
}

export interface Pod {
  id: string;
  name: string;
  location: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'OFFLINE';
  hourlyRate: number;
  lockId: string;
} 