# Authentication API

## Overview
Authentication endpoints for user login and registration. Uses JWT tokens for secure access.

## Endpoints

### Login
`POST /api/auth/login`

Authenticate user and get access token.

Request:
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### Register
`POST /api/auth/register`

Create new user account.

Request:
```json
{
  "email": "user@example.com",
  "password": "password",
  "name": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### Verify Token
`GET /api/auth/verify`

Verify if token is valid.

Headers:
```
Authorization: Bearer eyJhbG...
```

Response:
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com"
    }
  }
}
```

## Error Responses

### Invalid Login
```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID",
    "message": "Invalid email or password"
  }
}
```

### Registration Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email already exists"
  }
}
```