# WorkPod API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints except `/auth/login` and `/auth/register` require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Core Resources

### [Authentication](./authentication.md)
- Login
- Register
- Token management

### [Pods](./pods.md)
- List available pods
- Get pod details
- Check availability
- Get pod status

### [Bookings](./bookings.md)
- Create bookings
- Manage bookings
- Access control

### [Payments](./payments.md)
- Payment intents
- Payment confirmation
- Stripe integration

## Error Handling
See [errors.md](./errors.md) for:
- Error response format
- Common error codes
- HTTP status codes

## Response Format
All responses follow the format:
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

Or for errors:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
``` 