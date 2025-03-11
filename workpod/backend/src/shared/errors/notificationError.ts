import { AppError } from './appError';
import { ErrorType } from './errorTypes';

export class NotificationError extends AppError {
  constructor(message: string) {
    super(message, 400, ErrorType.NOTIFICATION_ERROR);
    this.name = 'NotificationError';
  }
} 