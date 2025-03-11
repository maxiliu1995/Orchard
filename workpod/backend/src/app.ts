import express from 'express';
import cors from 'cors';
import { errorHandler } from '@/shared/middleware/errorHandler';
import { authRouter } from '@/core/auth/routes';
import { bookingRouter } from '@/core/bookings/routes';
import { paymentRouter } from '@/core/payments/routes';
import { podRouter } from '@/core/pods/routes';
import { userRouter } from '@/core/users/routes';
import { healthRouter } from '@/core/health/routes';
import { lockRouter } from '@/core/locks/routes';
import { config } from './shared/config/config';
import { logger } from './shared/logger';

// Validate configuration on startup
try {
  logger.info('Starting server with configuration:', {
    env: config.env,
    port: config.port,
    databaseUrl: config.database.url.replace(/:\/\/.*@/, '://***@'), // Hide credentials
    frontendUrl: config.frontend.url,
    corsOrigins: config.cors.allowedOrigins
  });
} catch (error) {
  logger.error('Configuration validation failed:', error);
  process.exit(1);
}

export const app = express();

// Apply CORS before any other middleware
app.use(cors(config.cors));
app.options('*', cors(config.cors));

// Debug endpoint
app.get('/api/debug/cors', (req, res) => {
  res.json({
    message: 'CORS is working',
    origin: req.headers.origin,
    headers: req.headers,
    env: {
      FRONTEND_URL: process.env.FRONTEND_URL,
      NODE_ENV: process.env.NODE_ENV
    }
  });
});

// JSON middleware for all other routes
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/pods', podRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/locks', lockRouter);

// Error handling
app.use(errorHandler);

export default app; 