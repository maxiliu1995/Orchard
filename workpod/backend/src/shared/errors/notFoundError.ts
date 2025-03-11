import { AppError, ErrorType } from '.';

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, ErrorType.NOT_FOUND);
    this.name = 'NotFoundError';
  }
} 