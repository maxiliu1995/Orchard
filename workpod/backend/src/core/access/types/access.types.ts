export interface AccessHistory {
  userId: string;
  podId: string;
  accessTime: Date;
  accessType: 'ENTRY' | 'EXIT';
  success: boolean;
}

export interface AccessLog {
  id: string;
  timestamp: Date;
  action: string;
  details: Record<string, any>;
} 