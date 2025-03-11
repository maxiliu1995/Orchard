# Pods API

## Overview
Manage and search for available workpods.

## Endpoints

### List Pods
`GET /api/pods`

Query Parameters:
- `latitude` - User's latitude (required)
- `longitude` - User's longitude (required)
- `radius` - Search radius in km (optional, default: 5)

Response:
```json
{
  "pods": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Pod A1",
      "status": "AVAILABLE",
      "hourlyRate": 2500,
      "location": {
        "latitude": 51.5074,
        "longitude": -0.1278,
        "address": "123 Main St, London"
      }
    }
  ]
}
```

### Get Pod Details
`GET /api/pods/:id`

Response:
```json
{
  "pod": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Pod A1",
    "status": "AVAILABLE",
    "hourlyRate": 2500,
    "features": ["wifi", "desk", "power"],
    "location": {
      "latitude": 51.5074,
      "longitude": -0.1278,
      "address": "123 Main St, London"
    }
  }
}
```

### Check Availability
`GET /api/pods/:id/availability`

Query Parameters:
- `startTime` - ISO datetime
- `endTime` - ISO datetime

Response:
```json
{
  "available": true,
  "conflictingBookings": []
}
```

### Get Pod Status
`GET /api/pods/:id/status`

Response:
```json
{
  "status": "AVAILABLE",
  "lastUpdated": "2024-03-20T10:00:00Z",
  "currentBooking": null
}
```
