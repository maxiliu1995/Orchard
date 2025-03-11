import { AppError } from './appError';
import { ErrorType } from './errorTypes';

export class RateLimitError extends AppError {
  constructor(message: string) {
    super(message, 429, ErrorType.RATE_LIMIT_ERROR);
    this.name = 'RateLimitError';
  }
} 