# Setup Guide

## Prerequisites
- Node.js 16+
- PostgreSQL 13+
- Stripe account
- TTLock account

## Local Development Setup

1. Clone Repository
```bash
git clone https://github.com/your-org/workpod.git
cd workpod/backend
```

2. Install Dependencies
```bash
npm install
```

3. Environment Setup
```bash
cp deployment/env.example .env
# Edit .env with your configuration
```

4. Database Setup
```bash
# Run migrations
npm run migrate

# Optional: Seed database
npm run seed
```

5. Start Development Server
```bash
npm run dev
```

## Testing
```bash
# Run all tests
npm test

# Run specific tests
npm test -- --grep "auth"
```

## Common Issues
- Database connection errors: Check PostgreSQL is running
- Auth errors: Verify JWT_SECRET is set
- Payment errors: Confirm Stripe keys are valid 