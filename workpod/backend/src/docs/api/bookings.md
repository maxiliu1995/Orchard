# Bookings API

## Overview
Manage workpod bookings and access.

## Endpoints

### List Bookings
`GET /api/bookings`

Response:
```json
{
  "bookings": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "podId": "123e4567-e89b-12d3-a456-426614174001",
      "startTime": "2024-03-20T10:00:00Z",
      "endTime": "2024-03-20T11:00:00Z",
      "status": "CONFIRMED",
      "totalAmount": 2500
    }
  ]
}
```

### Create Booking
`POST /api/bookings`

Request:
```json
{
  "podId": "123e4567-e89b-12d3-a456-426614174001",
  "startTime": "2024-03-20T10:00:00Z",
  "endTime": "2024-03-20T11:00:00Z"
}
```

Response:
```json
{
  "booking": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "PENDING",
    "totalAmount": 2500,
    "clientSecret": "pi_..."
  }
}
```

### Get Booking
`GET /api/bookings/:id`

Response:
```json
{
  "booking": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "podId": "123e4567-e89b-12d3-a456-426614174001",
    "startTime": "2024-03-20T10:00:00Z",
    "endTime": "2024-03-20T11:00:00Z",
    "status": "CONFIRMED",
    "totalAmount": 2500
  }
}
```

### Cancel Booking
`DELETE /api/bookings/:id`

Response:
```json
{
  "status": "CANCELLED"
}
```

### Unlock Pod
`POST /api/bookings/:id/unlock`

Response:
```json
{
  "success": true
}
```
