export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export const ErrorService = {
  parseApiError(error: any): ApiError {
    if (error.data) {
      return {
        code: error.data.code || 'UNKNOWN_ERROR',
        message: error.data.message || 'An unexpected error occurred',
        details: error.data.details,
      };
    }

    return {
      code: 'NETWORK_ERROR',
      message: 'Failed to connect to server',
    };
  },

  getErrorMessage(error: ApiError): string {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'Please log in to continue';
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action';
      case 'NOT_FOUND':
        return 'The requested resource was not found';
      case 'VALIDATION_ERROR':
        return this.formatValidationError(error.details);
      default:
        return error.message;
    }
  },

  formatValidationError(details?: Record<string, any>): string {
    if (!details) return 'Invalid input provided';
    
    return Object.entries(details)
      .map(([field, message]) => `${field}: ${message}`)
      .join(', ');
  }
}; 