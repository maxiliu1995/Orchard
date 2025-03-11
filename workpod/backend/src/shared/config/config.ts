import { z } from 'zod';

/**
 * Configuration schema with runtime validation
 * All environment variables are validated on app startup
 */
const configSchema = z.object({
  env: z.enum(['development', 'test', 'production']),
  port: z.number().int().positive(),
  
  // Database configuration
  database: z.object({
    url: z.string().url(),
    logging: z.boolean().default(false),
    poolSize: z.number().int().positive().default(10),
    connectionTimeout: z.number().int().positive().default(5000),
    maxQueryExecutionTime: z.number().int().positive().default(5000)
  }),

  // Authentication configuration
  jwt: z.object({
    secret: z.string().min(1),
    accessSecret: z.string().min(1),
    refreshSecret: z.string().min(1),
    expiresIn: z.string().regex(/^\d+[hdwmy]$/, 'Must be a duration like 24h, 7d, etc.'),
    refreshExpiresIn: z.string().regex(/^\d+[hdwmy]$/, 'Must be a duration like 7d, 30d, etc.').default('7d')
  }),

  // Payment configuration
  stripe: z.object({
    secretKey: z.string().startsWith('sk_'),
    webhookSecret: z.string().min(1),
    currency: z.string().length(3).default('EUR'),
    paymentMethods: z.array(z.string()).default(['card'])
  }),

  // Lock system configuration
  ttlock: z.object({
    clientId: z.string().min(1),
    clientSecret: z.string().min(1),
    apiUrl: z.string().url().default('https://euapi.ttlock.com/v3'),
    retryAttempts: z.number().int().positive().default(3)
  }),

  // Frontend configuration
  frontend: z.object({
    url: z.string().url(),
    apiPath: z.string().default('/api')
  }),

  // CORS configuration
  cors: z.object({
    allowedOrigins: z.array(z.string().url()).default([]),
    methods: z.array(z.string()).default(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']),
    allowedHeaders: z.array(z.string()).default([
      'Content-Type',
      'Authorization',
      'X-Requested-With'
    ]),
    exposedHeaders: z.array(z.string()).default(['Set-Cookie']),
    credentials: z.boolean().default(true),
    maxAge: z.number().int().positive().default(86400)
  }),

  // Rate limiting configuration
  rateLimit: z.object({
    windowMs: z.number().int().positive().default(15 * 60 * 1000), // 15 minutes
    max: z.number().int().positive().default(100), // Limit each IP to 100 requests per windowMs
    message: z.string().default('Too many requests, please try again later.')
  })
});

/** Type-safe config interface derived from schema */
type Config = z.infer<typeof configSchema>;

/** Environment-specific configurations */
const configs: Record<string, Config> = {
  development: {
    env: 'development',
    port: 3000,
    database: {
      url: process.env.DATABASE_URL!,
      logging: true,
      poolSize: 10,
      connectionTimeout: 5000,
      maxQueryExecutionTime: 5000
    },
    jwt: {
      secret: process.env.JWT_SECRET!,
      accessSecret: process.env.JWT_ACCESS_SECRET!,
      refreshSecret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: '24h',
      refreshExpiresIn: '7d'
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      currency: 'EUR',
      paymentMethods: ['card']
    },
    ttlock: {
      clientId: process.env.TTLOCK_CLIENT_ID!,
      clientSecret: process.env.TTLOCK_CLIENT_SECRET!,
      apiUrl: 'https://euapi.ttlock.com/v3',
      retryAttempts: 3
    },
    frontend: {
      url: process.env.FRONTEND_URL!,
      apiPath: '/api'
    },
    cors: {
      allowedOrigins: [process.env.FRONTEND_URL!],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Set-Cookie'],
      credentials: true,
      maxAge: 86400
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests, please try again later.'
    }
  },
  test: {
    env: 'test',
    port: 3001,
    database: {
      url: process.env.TEST_DATABASE_URL!,
      logging: false,
      poolSize: 2,
      connectionTimeout: 1000,
      maxQueryExecutionTime: 1000
    },
    jwt: {
      secret: 'test-secret',
      accessSecret: 'test-access-secret',
      refreshSecret: 'test-refresh-secret',
      expiresIn: '1h',
      refreshExpiresIn: '1d'
    },
    stripe: {
      secretKey: 'test-stripe-key',
      webhookSecret: 'test-webhook-secret',
      currency: 'EUR',
      paymentMethods: ['card']
    },
    ttlock: {
      clientId: 'test-ttlock-id',
      clientSecret: 'test-ttlock-secret',
      apiUrl: 'https://euapi.ttlock.com/v3',
      retryAttempts: 1
    },
    frontend: {
      url: 'http://localhost:3000',
      apiPath: '/api'
    },
    cors: {
      allowedOrigins: ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Set-Cookie'],
      credentials: true,
      maxAge: 86400
    },
    rateLimit: {
      windowMs: 1000,
      max: 1000,
      message: 'Too many requests in test environment'
    }
  },
  production: {
    env: 'production',
    port: Number(process.env.PORT) || 3000,
    database: {
      url: process.env.DATABASE_URL!,
      logging: false,
      poolSize: 20,
      connectionTimeout: 10000,
      maxQueryExecutionTime: 10000
    },
    jwt: {
      secret: process.env.JWT_SECRET!,
      accessSecret: process.env.JWT_ACCESS_SECRET!,
      refreshSecret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: '7d',
      refreshExpiresIn: '30d'
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      currency: 'EUR',
      paymentMethods: ['card']
    },
    ttlock: {
      clientId: process.env.TTLOCK_CLIENT_ID!,
      clientSecret: process.env.TTLOCK_CLIENT_SECRET!,
      apiUrl: 'https://euapi.ttlock.com/v3',
      retryAttempts: 3
    },
    frontend: {
      url: process.env.FRONTEND_URL!,
      apiPath: '/api'
    },
    cors: {
      allowedOrigins: [process.env.FRONTEND_URL!].filter(Boolean),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Set-Cookie'],
      credentials: true,
      maxAge: 86400
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 50,
      message: 'Rate limit exceeded. Please try again later.'
    }
  }
};

/**
 * Validates the configuration against the schema
 * @throws {Error} if validation fails
 */
export function validateConfig(config: unknown): Config {
  try {
    return configSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('\n');
      throw new Error(`Invalid configuration:\n${issues}`);
    }
    throw error;
  }
}

// Get current environment
const env = (process.env.NODE_ENV || 'development') as keyof typeof configs;

// Validate and export config
export const config = validateConfig(configs[env]); 