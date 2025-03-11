import { AppError } from './appError';
import { ErrorType } from '.';

export class BookingError extends AppError {
  constructor(message: string) {
    super(message, 400, ErrorType.BOOKING);
    this.name = 'BookingError';
  }
} 