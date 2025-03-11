import { AppError, ErrorType } from '.';

export class ValidationError extends AppError {
  constructor(message: string, public details?: any) {
    super(message, 400, ErrorType.VALIDATION);
    this.name = 'ValidationError';
  }
} 