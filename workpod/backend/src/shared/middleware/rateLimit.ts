import rateLimit from 'express-rate-limit';
import { RateLimitError } from '@/shared/errors';

// General API rate limit
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    throw new RateLimitError('Too many requests, please try again later.');
  }
});

// Stricter limit for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  handler: (req, res, next) => {
    throw new RateLimitError('Too many attempts. Please try again later.');
  }
}); 