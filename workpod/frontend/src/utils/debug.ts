export type LogCategory = 
  | 'auth'
  | 'api'
  | 'payment'
  | 'booking'
  | 'pods'
  | 'user';

export const debugLog = (category: LogCategory, message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${category.toUpperCase()}] ${message}`, data || '');
  }
};
