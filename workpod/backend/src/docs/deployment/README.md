# Deployment Guide

## Overview
This guide covers deploying the WorkPod backend service.

## Prerequisites
- Node.js 16+
- PostgreSQL 13+
- Stripe account
- TTLock account

## Quick Deploy
1. Follow [setup instructions](./setup.md)
2. Configure using [environment variables](./env.example)
3. Build and start:
```bash
npm run build
npm start
```

## Environment Variables
See [env.example](./env.example) for required configuration.

## Health Check
The service exposes a health check endpoint:
```
GET /api/health
``` 