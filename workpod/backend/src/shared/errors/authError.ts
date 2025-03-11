import { AppError, ErrorType } from '.';

export class AuthError extends AppError {
  constructor(message: string) {
    super(message, 401, ErrorType.AUTH);
    this.name = 'AuthError';
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid email or password');
  }
}

export class EmailAlreadyExistsError extends AuthError {
  constructor(message: string = 'Email already registered') {
    super(message);
  }
}

export class PasswordResetTokenExpiredError extends AuthError {
  constructor() {
    super('Password reset token has expired');
  }
}

export class InvalidPasswordResetTokenError extends AuthError {
  constructor() {
    super('Invalid password reset token');
  }
}

export class PasswordReusedError extends AuthError {
  constructor() {
    super('Cannot reuse any of your last 5 passwords');
  }
}

export class InvalidPasswordError extends AuthError {
  constructor(details: string) {
    super(`Invalid password: ${details}`);
  }
}

export class InvalidEmailError extends AuthError {
  constructor(details: string) {
    super(`Invalid email: ${details}`);
  }
}

export class SessionExpiredError extends AuthError {
  constructor() {
    super('Session has expired');
  }
}

export class InvalidTokenError extends AuthError {
  constructor(details?: string) {
    super(`Invalid token${details ? `: ${details}` : ''}`);
  }
}

export class TooManyRequestsError extends AuthError {
  constructor(waitTime: number) {
    super(`Too many attempts. Please try again in ${waitTime} seconds`);
  }
} 