import { Request } from 'express';

// Type extensions
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        [key: string]: any;
      };
    }
  }
}

// Custom request types
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    [key: string]: any;
  };
} 