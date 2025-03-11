import { AppError } from './appError';
import { ErrorType } from './errorTypes';

export class LockError extends AppError {
  constructor(message: string) {
    super(message, 400, ErrorType.LOCK_ERROR);
    this.name = 'LockError';
  }
} 