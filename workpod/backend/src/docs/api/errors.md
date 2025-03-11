# Error Handling

## Overview
All API errors follow a standard format with HTTP status codes and error details.

## Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## Common Error Codes

### Authentication (401, 403)
- `AUTH_REQUIRED` - No authentication token provided
- `AUTH_INVALID` - Invalid or expired token
- `AUTH_FORBIDDEN` - Not authorized for this resource

### Validation (400)
- `VALIDATION_ERROR` - Invalid request data
- `INVALID_PARAMS` - Missing or invalid parameters

### Bookings (400, 404)
- `BOOKING_NOT_FOUND` - Booking doesn't exist
- `BOOKING_CONFLICT` - Time slot not available
- `BOOKING_EXPIRED` - Booking time has passed
- `BOOKING_CANCELLED` - Booking already cancelled

### Payments (400, 402)
- `PAYMENT_REQUIRED` - Payment needed
- `PAYMENT_FAILED` - Payment processing failed
- `PAYMENT_CANCELLED` - Payment was cancelled

### Pods (404, 409)
- `POD_NOT_FOUND` - Pod doesn't exist
- `POD_UNAVAILABLE` - Pod not available
- `POD_MAINTENANCE` - Pod under maintenance

### System (500)
- `INTERNAL_ERROR` - Internal server error
- `SERVICE_UNAVAILABLE` - External service unavailable
