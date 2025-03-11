import { CreateAccessLogParams } from '../validators/access.validator';

export class AccessHistoryService {
  async createAccessLog(data: CreateAccessLogParams) {
    // Map accessType to action
    const logData = {
      ...data,
      action: data.accessType === 'ENTRY' ? 'unlock' : 'lock' as 'lock' | 'unlock'
    };
    return this.logAccess(logData);
  }

  async getHistory(userId: string) {
    // Implementation of getting history
    return [];
  }

  private async logAccess(data: { userId: string; podId: string; action: "lock" | "unlock"; timestamp: Date; }) {
    // Existing implementation
  }
}

export const accessHistoryService = new AccessHistoryService(); 