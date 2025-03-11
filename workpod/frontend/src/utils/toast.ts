import { toast as sonnerToast } from 'sonner';

// Create a type for our toast options
type ToastOptions = {
  description?: string;
  duration?: number;
};

// Export the toast functions directly
export const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string, options?: ToastOptions) => {
  switch (type) {
    case 'success':
      return sonnerToast.success(message, options);
    case 'error':
      return sonnerToast.error(message, options);
    case 'info':
      return sonnerToast.info(message, options);
    case 'warning':
      return sonnerToast.warning(message, options);
  }
};

// Export individual methods for more specific usage
export const toast = {
  success: (message: string, options?: ToastOptions) => sonnerToast.success(message, options),
  error: (message: string, options?: ToastOptions) => sonnerToast.error(message, options),
  info: (message: string, options?: ToastOptions) => sonnerToast.info(message, options),
  warning: (message: string, options?: ToastOptions) => sonnerToast.warning(message, options),
  loading: (message: string, options?: ToastOptions) => sonnerToast.loading(message, options),
  dismiss: (toastId: string) => sonnerToast.dismiss(toastId)
};