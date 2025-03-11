declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
      STRIPE_SECRET_KEY: string;
      PAYPAL_CLIENT_ID: string;
      PAYPAL_CLIENT_SECRET: string;
      TTLOCK_CLIENT_ID: string;
      TTLOCK_CLIENT_SECRET: string;
    }
  }
}

export {}; 