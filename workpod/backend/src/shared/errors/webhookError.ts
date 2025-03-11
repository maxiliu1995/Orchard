import { AppError } from './appError';
import { ErrorType } from './errorTypes';

export class WebhookError extends AppError {
  constructor(message: string) {
    super(message, 400, ErrorType.WEBHOOK_ERROR);
    this.name = 'WebhookError';
  }
} 