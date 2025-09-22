# API Documentation

This document provides comprehensive documentation for all API endpoints in the Slot Booking System.

## 🌐 Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## 🔑 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📋 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

## 🔐 Authentication Endpoints

### POST /auth/register
Register a new user account.

**Access**: Public

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "club": "Technical Club"
}
```

**Validation Rules**:
- `name`: Required, 2-100 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `role`: Optional, enum: ["user", "club_admin", "super_admin"]
- `club`: Required if role is "club_admin"

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d5f484f0b8c72b4c8b4567",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2023-06-25T10:30:00.000Z"
    },
    "message": "User registered successfully"
  }
}
```

### POST /auth/login
Authenticate user and receive JWT token.

**Access**: Public

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d5f484f0b8c72b4c8b4567",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "club": "Technical Club"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "message": "Login successful"
  }
}
```

### POST /auth/logout
Logout current user session.

**Access**: Protected

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /auth/me
Get current user profile.

**Access**: Protected

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d5f484f0b8c72b4c8b4567",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "club_admin",
      "club": "Technical Club",
      "avatar": "https://example.com/avatar.jpg",
      "lastLogin": "2023-06-25T10:30:00.000Z"
    }
  }
}
```

### PUT /auth/profile
Update user profile.

**Access**: Protected

**Request Body**:
```json
{
  "name": "John Smith",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d5f484f0b8c72b4c8b4567",
      "name": "John Smith",
      "email": "john@example.com",
      "avatar": "https://example.com/new-avatar.jpg"
    }
  }
}
```

## 🎰 Slot Management Endpoints

### GET /slots
Get all slots with optional filtering.

**Access**: Public (read-only), Protected (full access)

**Query Parameters**:
- `date`: Filter by date (YYYY-MM-DD)
- `venue`: Filter by venue
- `status`: Filter by status (available, booked, cancelled)
- `startTime`: Filter slots starting after this time
- `endTime`: Filter slots ending before this time
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Example Request**:
```
GET /api/slots?date=2023-06-25&venue=Auditorium&status=available&page=1&limit=10
```

**Response**:
```json
{
  "success": true,
  "data": {
    "slots": [
      {
        "_id": "60d5f484f0b8c72b4c8b4567",
        "date": "2023-06-25T00:00:00.000Z",
        "startTime": "09:00",
        "endTime": "11:00",
        "venue": "Auditorium",
        "capacity": 200,
        "status": "available",
        "bookedBy": null,
        "eventName": null,
        "eventDescription": null,
        "createdAt": "2023-06-20T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### GET /slots/available
Get only available slots.

**Access**: Public

**Query Parameters**: Same as GET /slots

**Response**: Same format as GET /slots but only available slots

### GET /slots/:id
Get a specific slot by ID.

**Access**: Public

**Response**:
```json
{
  "success": true,
  "data": {
    "slot": {
      "_id": "60d5f484f0b8c72b4c8b4567",
      "date": "2023-06-25T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "11:00",
      "venue": "Auditorium",
      "capacity": 200,
      "status": "available",
      "bookedBy": null,
      "eventName": null,
      "eventDescription": null
    }
  }
}
```

### POST /slots
Create a new slot.

**Access**: Super Admin only

**Request Body**:
```json
{
  "date": "2023-06-25",
  "startTime": "09:00",
  "endTime": "11:00",
  "venue": "Auditorium",
  "capacity": 200
}
```

**Validation Rules**:
- `date`: Required, must be future date
- `startTime`: Required, HH:MM format
- `endTime`: Required, HH:MM format, must be after startTime
- `venue`: Required, must be valid venue
- `capacity`: Required, positive integer

**Response**:
```json
{
  "success": true,
  "data": {
    "slot": {
      "_id": "60d5f484f0b8c72b4c8b4567",
      "date": "2023-06-25T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "11:00",
      "venue": "Auditorium",
      "capacity": 200,
      "status": "available",
      "createdAt": "2023-06-20T10:30:00.000Z"
    }
  }
}
```

### PUT /slots/:id
Update a slot.

**Access**: Super Admin only

**Request Body**: Same as POST /slots (all fields optional)

**Response**: Updated slot object

### DELETE /slots/:id
Delete a slot.

**Access**: Super Admin only

**Response**:
```json
{
  "success": true,
  "message": "Slot deleted successfully"
}
```

### PUT /slots/:id/book
Book a specific slot.

**Access**: Club Admin only

**Request Body**:
```json
{
  "eventName": "Tech Workshop",
  "eventDescription": "Introduction to React.js",
  "expectedParticipants": 50,
  "requirements": ["Projector", "Microphone"],
  "contactPerson": {
    "name": "Jane Smith",
    "phone": "1234567890",
    "email": "jane@example.com"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "slot": {
      "_id": "60d5f484f0b8c72b4c8b4567",
      "status": "booked",
      "bookedBy": "60d5f484f0b8c72b4c8b4568",
      "eventName": "Tech Workshop",
      "eventDescription": "Introduction to React.js"
    },
    "booking": {
      "_id": "60d5f484f0b8c72b4c8b4569",
      "slot": "60d5f484f0b8c72b4c8b4567",
      "user": "60d5f484f0b8c72b4c8b4568",
      "status": "pending"
    }
  }
}
```

## 📋 Booking Management Endpoints

### GET /bookings
Get all bookings (Admin) or user's bookings.

**Access**: Protected

**Query Parameters**:
- `status`: Filter by status
- `club`: Filter by club (Admin only)
- `startDate`: Filter bookings from this date
- `endDate`: Filter bookings until this date
- `page`: Page number
- `limit`: Items per page

**Response**:
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "_id": "60d5f484f0b8c72b4c8b4567",
        "slot": {
          "_id": "60d5f484f0b8c72b4c8b4568",
          "date": "2023-06-25T00:00:00.000Z",
          "startTime": "09:00",
          "endTime": "11:00",
          "venue": "Auditorium"
        },
        "user": {
          "_id": "60d5f484f0b8c72b4c8b4569",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "club": "Technical Club",
        "eventName": "Tech Workshop",
        "eventDescription": "Introduction to React.js",
        "expectedParticipants": 50,
        "status": "pending",
        "requirements": ["Projector", "Microphone"],
        "contactPerson": {
          "name": "Jane Smith",
          "phone": "1234567890",
          "email": "jane@example.com"
        },
        "createdAt": "2023-06-20T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  }
}
```

### GET /bookings/my-bookings
Get current user's bookings.

**Access**: Protected

**Response**: Same format as GET /bookings

### GET /bookings/:id
Get a specific booking by ID.

**Access**: Protected (own bookings) or Admin

**Response**:
```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "60d5f484f0b8c72b4c8b4567",
      "slot": {
        "date": "2023-06-25T00:00:00.000Z",
        "startTime": "09:00",
        "endTime": "11:00",
        "venue": "Auditorium"
      },
      "eventName": "Tech Workshop",
      "status": "pending"
    }
  }
}
```

### POST /bookings
Create a new booking.

**Access**: Club Admin only

**Request Body**:
```json
{
  "slot": "60d5f484f0b8c72b4c8b4567",
  "eventName": "Tech Workshop",
  "eventDescription": "Introduction to React.js",
  "expectedParticipants": 50,
  "requirements": ["Projector", "Microphone"],
  "contactPerson": {
    "name": "Jane Smith",
    "phone": "1234567890",
    "email": "jane@example.com"
  },
  "specialInstructions": "Please ensure AC is working"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "60d5f484f0b8c72b4c8b4567",
      "slot": "60d5f484f0b8c72b4c8b4568",
      "user": "60d5f484f0b8c72b4c8b4569",
      "club": "Technical Club",
      "eventName": "Tech Workshop",
      "status": "pending",
      "createdAt": "2023-06-20T10:30:00.000Z"
    }
  }
}
```

### PUT /bookings/:id/status
Update booking status.

**Access**: Super Admin only

**Request Body**:
```json
{
  "status": "approved",
  "rejectionReason": null
}
```

**Valid Status Values**: `pending`, `approved`, `rejected`, `cancelled`

**Response**:
```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "60d5f484f0b8c72b4c8b4567",
      "status": "approved",
      "approvedBy": "60d5f484f0b8c72b4c8b456a",
      "approvalDate": "2023-06-20T15:30:00.000Z"
    }
  }
}
```

### PUT /bookings/:id
Update booking details.

**Access**: Booking owner or Admin

**Request Body**: Same as POST /bookings (all fields optional)

**Response**: Updated booking object

### DELETE /bookings/:id
Cancel/Delete a booking.

**Access**: Booking owner or Admin

**Response**:
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

## 👥 User Management Endpoints (Admin Only)

### GET /users
Get all users with filtering options.

**Access**: Super Admin only

**Query Parameters**:
- `role`: Filter by role
- `club`: Filter by club
- `isActive`: Filter by active status
- `search`: Search by name or email
- `page`: Page number
- `limit`: Items per page

**Response**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "60d5f484f0b8c72b4c8b4567",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "club_admin",
        "club": "Technical Club",
        "isActive": true,
        "lastLogin": "2023-06-20T10:30:00.000Z",
        "createdAt": "2023-06-15T08:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### PUT /users/:id/role
Update user role.

**Access**: Super Admin only

**Request Body**:
```json
{
  "role": "club_admin",
  "club": "Technical Club"
}
```

**Response**: Updated user object

### PUT /users/:id/status
Update user active status.

**Access**: Super Admin only

**Request Body**:
```json
{
  "isActive": false
}
```

**Response**: Updated user object

## 📊 Analytics and Statistics Endpoints

### GET /analytics/dashboard
Get dashboard statistics.

**Access**: Admin only

**Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalSlots": 100,
      "availableSlots": 45,
      "bookedSlots": 40,
      "cancelledSlots": 15
    },
    "bookings": {
      "total": 85,
      "pending": 12,
      "approved": 60,
      "rejected": 8,
      "cancelled": 5
    },
    "venues": [
      {
        "name": "Auditorium",
        "totalSlots": 30,
        "bookedSlots": 18,
        "utilizationRate": 60
      }
    ],
    "clubs": [
      {
        "name": "Technical Club",
        "totalBookings": 25,
        "approvedBookings": 20,
        "approvalRate": 80
      }
    ],
    "recentActivity": [
      {
        "type": "booking_created",
        "user": "John Doe",
        "event": "Tech Workshop",
        "timestamp": "2023-06-20T10:30:00.000Z"
      }
    ]
  }
}
```

### GET /analytics/bookings
Get booking analytics.

**Access**: Admin only

**Query Parameters**:
- `startDate`: Analysis start date
- `endDate`: Analysis end date
- `groupBy`: Group by period (day, week, month)

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBookings": 150,
      "approvalRate": 85,
      "averageParticipants": 45,
      "topVenue": "Auditorium"
    },
    "timeline": [
      {
        "period": "2023-06-01",
        "bookings": 12,
        "approved": 10,
        "rejected": 2
      }
    ],
    "byVenue": [
      {
        "venue": "Auditorium",
        "bookings": 45,
        "utilizationRate": 75
      }
    ],
    "byClub": [
      {
        "club": "Technical Club",
        "bookings": 30,
        "successRate": 90
      }
    ]
  }
}
```

### GET /analytics/slots
Get slot analytics.

**Access**: Admin only

**Response**:
```json
{
  "success": true,
  "data": {
    "utilization": {
      "overall": 68,
      "byVenue": [
        {
          "venue": "Auditorium",
          "utilizationRate": 75,
          "totalSlots": 50,
          "bookedSlots": 38
        }
      ],
      "byTimeSlot": [
        {
          "timeRange": "09:00-12:00",
          "utilizationRate": 85
        }
      ]
    },
    "capacity": {
      "totalCapacity": 5000,
      "averageBookingSize": 45,
      "capacityUtilization": 60
    }
  }
}
```

## 🔍 Search and Filter Endpoints

### GET /search/slots
Advanced slot search.

**Access**: Public

**Query Parameters**:
- `q`: Search query
- `date`: Specific date or date range
- `venue`: Venue filter
- `capacity`: Minimum capacity
- `duration`: Minimum duration in hours
- `timePreference`: morning, afternoon, evening

**Response**: Paginated slot results with relevance scoring

### GET /search/bookings
Advanced booking search.

**Access**: Protected

**Query Parameters**:
- `q`: Search in event names and descriptions
- `club`: Club filter
- `status`: Status filter
- `dateRange`: Date range filter

**Response**: Paginated booking results with highlights

## 🔔 Notification Endpoints

### GET /notifications
Get user notifications.

**Access**: Protected

**Response**:
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "60d5f484f0b8c72b4c8b4567",
        "type": "booking_approved",
        "title": "Booking Approved",
        "message": "Your booking for Tech Workshop has been approved",
        "read": false,
        "createdAt": "2023-06-20T10:30:00.000Z",
        "data": {
          "bookingId": "60d5f484f0b8c72b4c8b4568"
        }
      }
    ],
    "unreadCount": 5
  }
}
```

### PUT /notifications/:id/read
Mark notification as read.

**Access**: Protected

**Response**:
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### PUT /notifications/read-all
Mark all notifications as read.

**Access**: Protected

**Response**:
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

## ⚠️ Error Codes and Status Codes

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource conflict (e.g., slot already booked) |
| 422 | Unprocessable Entity - Validation errors |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

### Custom Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication token required |
| `INVALID_TOKEN` | Invalid or expired token |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `VALIDATION_ERROR` | Request data validation failed |
| `SLOT_NOT_AVAILABLE` | Slot is not available for booking |
| `SLOT_ALREADY_BOOKED` | Slot has already been booked |
| `BOOKING_NOT_FOUND` | Booking does not exist |
| `USER_NOT_FOUND` | User does not exist |
| `DUPLICATE_EMAIL` | Email address already registered |
| `TIME_CONFLICT` | Time slot conflicts with existing booking |
| `CAPACITY_EXCEEDED` | Expected participants exceed slot capacity |
| `INVALID_DATE_RANGE` | Invalid date range provided |
| `PAST_DATE_BOOKING` | Cannot book slots in the past |

### Error Response Examples

**Validation Error (422)**:
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "statusCode": 422,
  "details": [
    {
      "field": "eventName",
      "message": "Event name is required"
    },
    {
      "field": "expectedParticipants",
      "message": "Expected participants must be a positive number"
    }
  ]
}
```

**Slot Conflict Error (409)**:
```json
{
  "success": false,
  "error": "Slot is already booked",
  "code": "SLOT_ALREADY_BOOKED",
  "statusCode": 409,
  "details": {
    "slotId": "60d5f484f0b8c72b4c8b4567",
    "bookedBy": "Technical Club",
    "eventName": "Existing Event"
  }
}
```

## 🚀 Rate Limiting

API endpoints are rate-limited to prevent abuse:

| Endpoint Type | Limit |
|---------------|-------|
| Authentication | 10 requests/minute |
| Public Endpoints | 100 requests/minute |
| Protected Endpoints | 200 requests/minute |
| Admin Endpoints | 500 requests/minute |

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1624192800
```

## 📄 Pagination

All list endpoints support pagination:

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response Format**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🔒 Security Features

### CORS Configuration
```javascript
// Allowed origins
origins: ['http://localhost:3000', 'https://yourdomain.com']
```

### Request Validation
- All inputs are sanitized and validated
- SQL injection prevention
- XSS protection
- File upload restrictions

### Authentication Security
- JWT tokens with expiration
- Password hashing with bcrypt
- Session management
- Automatic token refresh

## 🧪 Testing the API

### Using cURL

**Login Example**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Slots Example**:
```bash
curl -X GET http://localhost:5000/api/slots?venue=Auditorium&status=available \
  -H "Authorization: Bearer your-jwt-token"
```

**Create Booking Example**:
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "slot": "60d5f484f0b8c72b4c8b4567",
    "eventName": "Tech Workshop",
    "eventDescription": "React.js basics",
    "expectedParticipants": 50
  }'
```

### API Testing Tools

**Recommended Tools**:
- Postman: GUI-based testing
- Insomnia: Alternative to Postman
- Thunder Client: VS Code extension
- Jest + Supertest: Automated testing

### Environment Variables

Required environment variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/slot-booking
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```