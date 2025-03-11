import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

interface ApiError {
  status?: number;
  data?: {
    message?: string;
  };
}

export const errorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload as ApiError;
    
    if (error.status === 401) {
      window.location.href = '/login';
    } else if (error.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.status === 404) {
      toast.error('Resource not found');
    } else {
      toast.error(error.data?.message || 'An unexpected error occurred');
    }
  }

  return next(action);
}; 