declare module 'react-hot-toast' {
  export interface Toast {
    id: string;
    type: 'success' | 'error' | 'loading' | 'blank' | 'custom';
    message: string;
  }

  export interface ToasterProps {
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    toastOptions?: {
      duration?: number;
      style?: React.CSSProperties;
      className?: string;
      success?: {
        duration?: number;
        iconTheme?: {
          primary: string;
          secondary: string;
        };
      };
      error?: {
        duration?: number;
        iconTheme?: {
          primary: string;
          secondary: string;
        };
      };
    };
  }

  export const toast: {
    (message: string): string;
    success(message: string): string;
    error(message: string): string;
    loading(message: string): string;
    dismiss(toastId?: string): void;
  };

  export function Toaster(props: ToasterProps): JSX.Element;
} 