import { AppError, ErrorType } from '.';

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 403, ErrorType.AUTH);
    this.name = 'UnauthorizedError';
  }
} 