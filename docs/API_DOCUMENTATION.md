# API v1 Documentation

This document lists all available API endpoints in the Next.js v1 API.

**Base URL:** `/api/v1`

**Authentication:** Most endpoints require authentication via Bearer token in the Authorization header.

---

## Table of Contents

1. [Health Check](#health-check)
2. [Authentication](#authentication)
3. [Packages](#packages)
4. [Destinations](#destinations)
5. [Bookings](#bookings)
6. [Cart](#cart)
7. [Payment](#payment)
8. [User](#user)
9. [Coupons](#coupons)
10. [Interests](#interests)
11. [Plans](#plans)

---

## Health Check

### GET `/api/v1/health`

Health check endpoint to verify API is running.

**Authentication:** Not required

**Response:**

```json
{
  "success": true,
  "message": "API v1 is running",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Authentication

### POST `/api/v1/auth/register`

Register a new user account.

**Authentication:** Not required

**Request Body:**

```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "phone": "string (optional)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "profileImage": "string"
    },
    "token": "string",
    "refreshToken": "string"
  },
  "message": "Registration successful"
}
```

---

### POST `/api/v1/auth/login`

Login with email and password.

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "profileImage": "string"
    },
    "token": "string",
    "refreshToken": "string"
  },
  "message": "Login successful"
}
```

---

### POST `/api/v1/auth/logout`

Logout and clear refresh token.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

---

### POST `/api/v1/auth/refresh`

Refresh access token using refresh token.

**Authentication:** Not required

**Request Body:**

```json
{
  "refreshToken": "string (required)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "string",
    "refreshToken": "string"
  },
  "message": "Token refreshed successfully"
}
```

---

## Packages

### GET `/api/v1/packages`

Get all packages with pagination and filters.

**Authentication:** Not required

**Query Parameters:**

- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `query` (string, optional) - Search query for package name
- `destination` (string, optional) - Filter by destination ID
- `minDays` (number, optional) - Minimum number of days
- `maxDays` (number, optional) - Maximum number of days
- `sort` (string, optional) - Sort order: `price_asc`, `price_desc`, `days_asc`, `days_desc`

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "message": "Packages retrieved successfully"
}
```

---

### GET `/api/v1/packages/[id]`

Get package details by ID.

**Authentication:** Not required

**Response:**

```json
{
  "success": true,
  "data": {
    "result": [{
      "packageId": "string",
      "packageName": "string",
      "packageImg": ["string"],
      "noOfDays": 5,
      "noOfNight": 4,
      "destination": [...],
      "activity": [...],
      "hotelMeal": [...],
      "vehicleDetail": [...],
      "inclusionDetail": [...],
      "exclusionDetail": [...],
      "planName": "string",
      "activityPrice": 10000,
      ...
    }]
  },
  "message": "Package retrieved successfully"
}
```

---

### GET `/api/v1/packages/featured`

Get featured packages.

**Authentication:** Not required

**Query Parameters:**

- `limit` (number, default: 10) - Number of packages to return

**Response:**

```json
{
  "success": true,
  "data": {
    "packages": [...]
  },
  "message": "Featured packages retrieved successfully"
}
```

---

### GET `/api/v1/packages/search`

Search packages with advanced filters.

**Authentication:** Not required

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `query` (string, optional) - Search query
- `destination` (string, optional) - Filter by destination
- `minPrice` (number, optional) - Minimum price
- `maxPrice` (number, optional) - Maximum price
- `minDays` (number, optional) - Minimum days
- `maxDays` (number, optional) - Maximum days
- `sort` (string, optional) - Sort order

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  },
  "message": "Search results retrieved successfully"
}
```

---

## Destinations

### GET `/api/v1/destinations`

Get all destinations with pagination.

**Authentication:** Not required

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "name": "string",
        "image": "string",
        "type": "string",
        "rankNo": 1
      }
    ],
    "total": 20,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  },
  "message": "Destinations retrieved successfully"
}
```

---

### GET `/api/v1/destinations/[id]`

Get destination by ID.

**Authentication:** Not required

**Response:**

```json
{
  "success": true,
  "data": {
    "destination": {
      "id": "string",
      "name": "string",
      "image": "string",
      "type": "string",
      "rankNo": 1
    }
  },
  "message": "Destination retrieved successfully"
}
```

---

### GET `/api/v1/destinations/featured`

Get featured destinations.

**Authentication:** Not required

**Query Parameters:**

- `limit` (number, default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "destinations": [...]
  },
  "message": "Featured destinations retrieved successfully"
}
```

---

### GET `/api/v1/destinations/search`

Search destinations.

**Authentication:** Not required

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `query` (string, optional) - Search query

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "Search results retrieved successfully"
}
```

---

## Bookings

### POST `/api/v1/bookings`

Create a new booking.

**Authentication:** Required

**Request Body:**

```json
{
  "packageId": "string (required)",
  "travelDate": "string (required)",
  "adults": "number (required)",
  "children": "number (optional)",
  "travelers": [
    {
      "name": "string",
      "age": "number",
      "gender": "male|female|other"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "string",
      "bookingNumber": "string",
      "packageId": "string",
      "packageName": "string",
      "packageImages": ["string"],
      "travelDate": "string",
      "noOfDays": 5,
      "noOfNights": 4,
      "adults": 2,
      "children": 0,
      "totalAmount": 20000,
      "status": "pending",
      "paymentStatus": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Booking created successfully"
}
```

---

### GET `/api/v1/bookings/[id]`

Get booking details by ID.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "string",
      "bookingNumber": "string",
      "packageId": "string",
      "packageName": "string",
      "packageImages": ["string"],
      "travelDate": "string",
      "noOfDays": 5,
      "noOfNights": 4,
      "adults": 2,
      "children": 0,
      "totalAmount": 20000,
      "status": "pending",
      "paymentStatus": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "destinations": [...],
      "hotelMeal": [...],
      "vehicleDetail": [...],
      "activity": [...]
    }
  },
  "message": "Booking retrieved successfully"
}
```

---

### POST `/api/v1/bookings/[id]/cancel`

Cancel a booking.

**Authentication:** Required

**Request Body:**

```json
{
  "reason": "string (optional)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "booking": {...},
    "refundAmount": 16000,
    "cancellationReason": "string"
  },
  "message": "Booking cancelled successfully"
}
```

---

## Cart

### GET `/api/v1/cart`

Get user's cart.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "data": {
    "cart": {
      "cartId": "string",
      "items": [
        {
          "itemId": "string",
          "packageId": "string",
          "packageName": "string",
          "packageImages": ["string"],
          "quantity": 1,
          "travelDate": "string",
          "adults": 2,
          "children": 0,
          "totalPrice": 20000,
          "addedAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "totalAmount": 20000,
      "itemCount": 1
    }
  },
  "message": "Cart retrieved successfully"
}
```

---

### POST `/api/v1/cart/add`

Add item to cart.

**Authentication:** Required

**Request Body:**

```json
{
  "packageId": "string (required)",
  "quantity": "number (optional, default: 1)",
  "travelDate": "string (required)",
  "adults": "number (required)",
  "children": "number (optional)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "cart": {...}
  },
  "message": "Item added to cart successfully"
}
```

---

### PUT `/api/v1/cart/[itemId]`

Update cart item.

**Authentication:** Required

**Request Body:**

```json
{
  "quantity": "number (optional)",
  "travelDate": "string (optional)",
  "adults": "number (optional)",
  "children": "number (optional)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "cart": {...}
  },
  "message": "Cart item updated successfully"
}
```

---

### DELETE `/api/v1/cart/[itemId]`

Remove item from cart.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "data": {
    "cart": {...}
  },
  "message": "Item removed from cart successfully"
}
```

---

### POST `/api/v1/cart/clear`

Clear entire cart.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Cart cleared successfully"
}
```

---

## Payment

### POST `/api/v1/payment/initialize`

Initialize a payment for a booking.

**Authentication:** Required

**Request Body:**

```json
{
  "amount": "number (required)",
  "orderId": "string (required)",
  "currency": "string (optional, default: INR)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "paymentId": "string",
    "paymentUrl": "string",
    "orderId": "string",
    "amount": 20000,
    "currency": "INR",
    "status": "created"
  },
  "message": "Payment initialized successfully"
}
```

---

### POST `/api/v1/payment/process`

Process a payment.

**Authentication:** Required

**Request Body:**

```json
{
  "paymentId": "string (required)",
  "paymentMethod": "string (required)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "success": true,
    "transactionId": "string",
    "status": "completed"
  },
  "message": "Payment processed successfully"
}
```

---

### POST `/api/v1/payment/verify`

Verify a payment.

**Authentication:** Required

**Request Body:**

```json
{
  "paymentId": "string (required)",
  "transactionId": "string (required)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "verified": true,
    "status": "completed",
    "orderId": "string"
  },
  "message": "Payment verification completed"
}
```

---

### GET `/api/v1/payment/[paymentId]/status`

Get payment status.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "data": {
    "paymentId": "string",
    "orderId": "string",
    "amount": 20000,
    "currency": "INR",
    "status": "completed"
  },
  "message": "Payment status retrieved successfully"
}
```

---

## User

### GET `/api/v1/user/profile`

Get user profile.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "profileImage": "string",
      "gender": "string",
      "dob": "string",
      "address": "string",
      "city": "string",
      "pinCode": "string",
      "redeemCoins": 200,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Profile retrieved successfully"
}
```

---

### PUT `/api/v1/user/profile`

Update user profile.

**Authentication:** Required

**Request Body:**

```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "gender": "string (optional)",
  "dob": "string (optional)",
  "address": "string (optional)",
  "city": "string (optional)",
  "pinCode": "string (optional)",
  "profileImage": "string (optional)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {...}
  },
  "message": "Profile updated successfully"
}
```

---

### GET `/api/v1/user/bookings`

Get user's bookings.

**Authentication:** Required

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "Bookings retrieved successfully"
}
```

---

### GET `/api/v1/user/wishlist`

Get user's wishlist.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "data": {
    "wishlist": [
      {
        "packageId": "string",
        "name": "string",
        "images": ["string"],
        "noOfDays": 5,
        "noOfNights": 4,
        "startFrom": 10000,
        "offer": 10,
        "destinations": [...]
      }
    ]
  },
  "message": "Wishlist retrieved successfully"
}
```

---

### POST `/api/v1/user/wishlist/[packageId]`

Add package to wishlist.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Added to wishlist successfully"
}
```

---

### DELETE `/api/v1/user/wishlist/[packageId]`

Remove package from wishlist.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Removed from wishlist successfully"
}
```

---

### GET `/api/v1/user/wishlist/[packageId]/check`

Check if package is in wishlist.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "data": {
    "isInWishlist": true
  },
  "message": "Wishlist status retrieved"
}
```

---

## Coupons

### POST `/api/v1/coupons/validate`

Validate a coupon code.

**Authentication:** Required

**Request Body:**

```json
{
  "code": "string (required)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "coupon": {
      "id": "string",
      "name": "string",
      "code": "string",
      "description": "string",
      "valueType": "string",
      "value": 10,
      "validDate": "2024-12-31T00:00:00.000Z"
    }
  },
  "message": "Coupon is valid"
}
```

---

## Interests

### GET `/api/v1/interests`

Get all interests.

**Authentication:** Not required

**Query Parameters:**

- `limit` (number, default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "interests": [
      {
        "id": "string",
        "name": "string",
        "image": "string",
        "sort": 1,
        "perRoom": true,
        "isFirst": false
      }
    ]
  },
  "message": "Interests retrieved successfully"
}
```

---

## Plans

### GET `/api/v1/plans`

Get all plans.

**Authentication:** Not required

**Query Parameters:**

- `limit` (number, default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "string",
        "name": "string"
      }
    ]
  },
  "message": "Plans retrieved successfully"
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Access denied
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Validation error
- `INTERNAL_ERROR` - Internal server error
- `EMAIL_EXISTS` - Email already registered
- `INVALID_CREDENTIALS` - Invalid email or password
- `TOKEN_EXPIRED` - Token has expired
- `INVALID_TOKEN` - Invalid token
- `ACCOUNT_SUSPENDED` - Account has been suspended
- `PACKAGE_NOT_FOUND` - Package not found
- `BOOKING_NOT_FOUND` - Booking not found
- `ALREADY_CANCELLED` - Booking already cancelled
- `CART_NOT_FOUND` - Cart not found
- `ITEM_NOT_FOUND` - Item not found
- `ALREADY_IN_WISHLIST` - Package already in wishlist
- `NOT_IN_WISHLIST` - Package not in wishlist
- `PAYMENT_NOT_FOUND` - Payment not found
- `ORDER_NOT_FOUND` - Order not found
- `ORDER_ALREADY_PAID` - Order has already been paid

---

## Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

Paginated responses include:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "message": "Success message"
}
```

---

## Authentication

Most endpoints require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

The access token is obtained from the login or register endpoints. Use the refresh token endpoint to get a new access token when it expires.
