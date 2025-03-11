// src/utils/error/errorUtils.ts

export class ApiError extends Error {
    statusCode: number;
    errors?: string[];

    constructor(statusCode: number, message: string, errors?: string[]) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = 'ApiError';
    }
}

export const errorMessages = {
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    UNAUTHORIZED: 'Your session has expired. Please log in again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
    DEFAULT: 'Something went wrong. Please try again.'
};

export const handleApiError = (error: any): never => {
    if (error instanceof ApiError) {
        throw error;
    }

    if (error.response) {
        // Server responded with error status
        const statusCode = error.response.status;
        const message = error.response.data?.message || errorMessages[statusCode] || errorMessages.DEFAULT;
        const errors = error.response.data?.errors;

        throw new ApiError(statusCode, message, errors);
    }

    if (error.request) {
        // Request made but no response received
        throw new ApiError(503, errorMessages.NETWORK_ERROR);
    }

    // Something else went wrong
    throw new ApiError(500, errorMessages.SERVER_ERROR);
};
