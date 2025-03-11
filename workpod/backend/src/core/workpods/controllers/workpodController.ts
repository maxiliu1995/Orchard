import { Request, Response } from 'express';
import { WorkPodService } from '../services/workpodService';
import { CreateWorkPodParams } from '../validators/workpod.validator';

export class WorkPodController {
  constructor(private workPodService: WorkPodService) {}

  async createWorkPod(req: Request<{}, {}, CreateWorkPodParams>, res: Response) {
    const workPod = await this.workPodService.createPod(req.body);
    return res.status(201).json(workPod);
  }

  async getWorkPodAvailability(req: Request, res: Response) {
    const { id } = req.params;
    const { startTime, endTime } = req.query;
    const availability = await this.workPodService.checkPodAvailability(
      id,
      new Date(startTime as string),
      new Date(endTime as string)
    );
    return res.json(availability);
  }
} 