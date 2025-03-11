export enum ErrorType {
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  PAYMENT = 'PAYMENT',
  POD = 'POD',
  LOCK = 'LOCK',
  BOOKING = 'BOOKING',
  EMAIL = 'EMAIL',
  MAP = 'MAP',
  DATABASE = 'DATABASE',
  EXTERNAL = 'EXTERNAL',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  LOCK_ERROR = 'LOCK_ERROR',
  NOTIFICATION_ERROR = 'NOTIFICATION_ERROR',
  WEBHOOK_ERROR = 'WEBHOOK_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR'
}

export interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse extends ErrorResponse {
  errors: ValidationError[];
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public type: ErrorType = ErrorType.VALIDATION
  ) {
    super(message);
  }
}