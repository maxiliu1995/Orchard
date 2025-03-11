import { Request, Response } from 'express';
import { notificationService } from '../services';

export class NotificationController {
  async sendNotification(req: Request, res: Response) {
    const notification = await notificationService.send(req.body);
    res.json(notification);
  }
}

export const notificationController = new NotificationController(); 