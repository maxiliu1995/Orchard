import { Request, Response, NextFunction } from 'express';
import { accessHistoryService } from '../services/accessHistoryService';
import { CreateAccessLogParams } from '../validators/access.validator';

interface IAccessHistoryService {
  createAccessLog: (data: CreateAccessLogParams) => Promise<any>;
  getHistory: (userId: string) => Promise<any>;
}

export class AccessController {
  constructor(private accessService: IAccessHistoryService) {}

  async logAccess(req: Request<{}, {}, CreateAccessLogParams>, res: Response) {
    const accessLog = await this.accessService.createAccessLog(req.body);
    return res.status(201).json(accessLog);
  }

  async getAccessHistory(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    const history = await this.accessService.getHistory(userId);
    return res.json(history);
  }

  async validateAccess(req: Request, res: Response, next: NextFunction) {
    // Implementation
  }
}

export const accessController = new AccessController(accessHistoryService); 