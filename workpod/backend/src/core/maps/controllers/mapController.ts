import { Request, Response } from 'express';
import { mapService } from '../services/mapService';
import { logger } from '@/shared/logger/index';

export class MapController {
  async getNearbyPods(req: Request, res: Response) {
    try {
      const { latitude, longitude, radius } = req.query;
      const pods = await mapService.findNearbyPods(
        Number(latitude),
        Number(longitude),
        Number(radius)
      );
      res.json(pods);
    } catch (error) {
      logger.error('Failed to get nearby pods', { error });
      res.status(500).json({ error: 'Failed to get nearby pods' });
    }
  }
}

export const mapController = new MapController();
