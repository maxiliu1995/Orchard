# Payments API

## Overview
Handle payments for pod bookings using Stripe integration.

## Endpoints

### Create Payment Intent
`POST /api/payments/intent`

Request:
```json
{
  "bookingId": "123e4567-e89b-12d3-a456-426614174000",
  "amount": 2500,
  "currency": "usd"
}
```

Response:
```json
{
  "clientSecret": "pi_3MkCkf2eZvKYlo2C1ghhN8XN_secret_MK6SXiK7lP8YJJHzxOV6ySSCv",
  "publicKey": "pk_test_..."
}
```

### Confirm Payment
`POST /api/payments/confirm`

Request:
```json
{
  "paymentIntentId": "pi_3MkCkf2eZvKYlo2C1ghhN8XN"
}
```

Response:
```json
{
  "success": true,
  "status": "CONFIRMED"
}
```

### Get Payment Status
`GET /api/payments/:id`

Response:
```json
{
  "status": "COMPLETED",
  "amount": 2500,
  "currency": "usd",
  "createdAt": "2024-03-20T10:00:00Z"
}
```

## Webhooks
`POST /api/payments/webhooks/stripe`

Handles Stripe payment webhooks. Requires Stripe signature header.
