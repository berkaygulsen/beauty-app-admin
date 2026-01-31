# Admin Routes Response Types Documentation

This document contains the complete response types for all admin panel API endpoints. Use this documentation to fix type and data handling issues on the admin panel frontend.

**Base URL:** `/api/v1/admin`

**Authentication:** All endpoints (except login) require `Authorization: Bearer {accessToken}` header.

---

## Authentication Routes

### POST `/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    admin: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "SUPPORT";
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number; // seconds
      refreshExpiresIn: number; // seconds
    };
  };
}
```

---

### POST `/auth/logout`

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```typescript
{
  success: true,
  message: "Logged out successfully" | "Logged out";
}
```

---

### POST `/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
  };
}
```

---

### GET `/auth/me`

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "SUPPORT";
  };
}
```

---

## Dashboard Routes

### GET `/dashboard/stats`

**Response:**
```typescript
{
  success: true,
  data: {
    providers: {
      total: number;
      pending: number;
      approved: number;
      suspended: number;
      rejected: number;
    };
    customers: {
      total: number;
      newToday: number;
      newThisMonth: number;
    };
    serviceRequests: {
      total: number;
      created: number;
      accepted: number;
      paymentReceived: number;
      completed: number;
      cancelled: number;
    };
    revenue: {
      today: number;
      thisMonth: number;
      total: number;
      commission: number;
    };
    pendingActions: {
      pendingProviders: number;
      pendingDocuments: number;
      disputedRequests: number;
    };
  };
}
```

---

### GET `/dashboard/charts?period=7d|30d|90d|1y`

**Query Parameters:**
- `period`: `"7d" | "30d" | "90d" | "1y"` (default: `"30d"`)

**Response:**
```typescript
{
  success: true,
  data: {
    serviceRequestTrend: Array<{
      date: string; // ISO date string (YYYY-MM-DD)
      count: number;
    }>;
    providerStatusDistribution: Array<{
      status: string; // "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED"
      count: number;
    }>;
    revenueTrend: Array<{
      date: string; // ISO date string (YYYY-MM-DD)
      amount: number;
    }>;
    popularServiceCategories: Array<{
      category: string; // "NAIL" | "HAIR" | "MAKEUP" | "SKIN_CARE" | "EYEBROW_LASH" | "OTHER"
      count: number;
    }>;
  };
}
```

---

### GET `/dashboard/activities?limit=20`

**Query Parameters:**
- `limit`: `number` (default: `20`)

**Response:**
```typescript
{
  success: true,
  data: Array<{
    type: string; // "provider_registered" | "service_request_created" | "payment_completed"
    description: string;
    timestamp: string; // ISO date string
    entityId?: string;
    entityType?: string; // "Provider" | "ServiceRequest" | "Payment"
  }>;
}
```

---

## Provider Management Routes

### GET `/providers`

**Query Parameters:**
- `status`: `"PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED"`
- `city`: `string`
- `district`: `string`
- `minScore`: `number`
- `maxScore`: `number`
- `search`: `string`
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)
- `limit`: `number`
- `offset`: `number`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    addressLine?: string | null;
    city?: string | null;
    district?: string | null;
    neighborhood?: string | null;
    street?: string | null;
    buildingNumber?: string | null;
    apartmentNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    profilePhotoUrl?: string | null;
    bio?: string | null;
    experienceYears?: number | null;
    status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";
    emailVerified: boolean;
    phoneVerified: boolean;
    score: number;
    baseScore: number;
    isOnline: boolean;
    lastActiveAt?: string | null; // ISO date string
    locationPrivacy: "EXACT" | "APPROXIMATE" | "HIDDEN";
    paymentPeriod: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
    minimumPaymentAmount: number; // Decimal as number
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }>;
  total: number;
}
```

---

### GET `/providers/:id`

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    addressLine?: string | null;
    city?: string | null;
    district?: string | null;
    neighborhood?: string | null;
    street?: string | null;
    buildingNumber?: string | null;
    apartmentNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    profilePhotoUrl?: string | null;
    bio?: string | null;
    experienceYears?: number | null;
    status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";
    emailVerified: boolean;
    phoneVerified: boolean;
    score: number;
    baseScore: number;
    isOnline: boolean;
    lastActiveAt?: string | null;
    locationPrivacy: "EXACT" | "APPROXIMATE" | "HIDDEN";
    paymentPeriod: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
    minimumPaymentAmount: number;
    createdAt: string;
    updatedAt: string;
  };
}
```

---

### PUT `/providers/:id`

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "city": "string",
  "district": "string",
  "status": "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED",
  // ... other provider fields
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    // Same as GET /providers/:id response
  };
}
```

---

### POST `/providers/:id/approve`

**Response:**
```typescript
{
  success: true,
  data: {
    // Provider object (same as GET /providers/:id)
  };
}
```

---

### POST `/providers/:id/reject`

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    // Provider object (same as GET /providers/:id)
  };
}
```

---

### POST `/providers/:id/suspend`

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    // Provider object (same as GET /providers/:id)
  };
}
```

---

### POST `/providers/:id/unsuspend`

**Response:**
```typescript
{
  success: true,
  data: {
    // Provider object (same as GET /providers/:id)
  };
}
```

---

### PUT `/providers/:id/score`

**Request Body:**
```json
{
  "score": number,
  "reason": "string"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    // Provider object (same as GET /providers/:id)
  };
}
```

---

## Customer Management Routes

### GET `/customers`

**Query Parameters:**
- `search`: `string`
- `emailVerified`: `"true" | "false"`
- `phoneVerified`: `"true" | "false"`
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)
- `limit`: `number`
- `offset`: `number`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string | null;
    averageRating?: number | null; // Decimal as number
    totalServices: number;
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }>;
  total: number;
}
```

---

### GET `/customers/:id`

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string | null;
    averageRating?: number | null;
    totalServices: number;
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}
```

---

### PUT `/customers/:id`

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    // Customer object (same as GET /customers/:id)
  };
}
```

---

### POST `/customers/:id/suspend`

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response:**
```typescript
{
  success: true,
  message: "Customer suspended";
}
```

---

### POST `/customers/:id/unsuspend`

**Response:**
```typescript
{
  success: true,
  message: "Customer unsuspended";
}
```

---

## Service Request Management Routes

### GET `/service-requests`

**Query Parameters:**
- `status`: `"NEW" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED" | "TIMEOUT"`
- `providerId`: `string`
- `customerId`: `string`
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)
- `minPrice`: `number`
- `maxPrice`: `number`
- `limit`: `number`
- `offset`: `number`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    id: string;
    providerId: string;
    customerId: string;
    serviceId: string;
    status: "NEW" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED" | "TIMEOUT";
    requestedDate: string; // ISO date string
    requestedTime: string;
    addressLine?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    approximateDistance?: number | null; // Decimal as number
    specialNotes?: string | null;
    price: number; // Decimal as number
    commission: number; // Decimal as number
    commissionRate: number; // Decimal as number
    netAmount: number; // Decimal as number
    rejectionReason?: "NOT_AVAILABLE" | "TOO_FAR" | "SERVICE_NOT_SUITABLE" | "PERSONAL_REASON" | "OTHER" | null;
    rejectionNote?: string | null;
    responseDeadline?: string | null; // ISO date string
    respondedAt?: string | null; // ISO date string
    completedAt?: string | null; // ISO date string
    cancelledAt?: string | null; // ISO date string
    cancelledBy?: string | null;
    cancellationReason?: string | null;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    provider: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    customer: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    service: {
      id: string;
      name: string;
      price: number;
    };
    payment?: {
      // CustomerPayment object
    } | null;
    rating?: {
      // Rating object
    } | null;
  }>;
  total: number;
}
```

---

### GET `/service-requests/:id`

**Response:**
```typescript
{
  success: true,
  data: {
    // ServiceRequest object (same structure as in GET /service-requests array items)
  };
}
```

---

### PUT `/service-requests/:id/status`

**Request Body:**
```json
{
  "status": "NEW" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED" | "TIMEOUT",
  "reason": "string" // optional
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    // ServiceRequest object
  };
}
```

---

### POST `/service-requests/:id/cancel`

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    // ServiceRequest object
  };
}
```

---

### POST `/service-requests/:id/complete`

**Response:**
```typescript
{
  success: true,
  data: {
    // ServiceRequest object
  };
}
```

---

### GET `/service-requests/pending-completion`

**Query Parameters:**
- `providerId`: `string`
- `customerId`: `string`
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)
- `limit`: `number`
- `offset`: `number`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    // ServiceRequest objects
  }>;
  total: number;
}
```

---

### GET `/service-requests/disputed`

**Query Parameters:**
- `status`: `string`
- `raisedBy`: `string`
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)
- `limit`: `number`
- `offset`: `number`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    // ServiceRequestDispute objects
    id: string;
    serviceRequestId: string;
    raisedBy: string; // "CUSTOMER" | "PROVIDER"
    reason: string;
    status: "PENDING" | "RESOLVED" | "REJECTED";
    resolution?: string | null;
    refundAmount?: number | null;
    resolvedAt?: string | null; // ISO date string
    resolvedBy?: string | null;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    serviceRequest: {
      // ServiceRequest object
    };
  }>;
  total: number;
}
```

---

### POST `/service-requests/:id/resolve-dispute`

**Request Body:**
```json
{
  "resolution": "string",
  "refundAmount": number // optional
}
```

**Response:**
```typescript
{
  success: true,
  message: "Dispute resolved";
}
```

---

### GET `/service-requests/:id/status-history`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    id: string;
    serviceRequestId: string;
    previousStatus: "NEW" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED" | "TIMEOUT";
    newStatus: "NEW" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED" | "TIMEOUT";
    reason?: string | null;
    changedBy?: string | null;
    createdAt: string; // ISO date string
  }>;
}
```

---

## Payment Management Routes

### GET `/payments`

**Query Parameters:**
- `providerId`: `string`
- `status`: `"PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"`
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)
- `minAmount`: `number`
- `maxAmount`: `number`
- `limit`: `number`
- `offset`: `number`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    id: string;
    providerId: string;
    amount: number; // Decimal as number
    commission: number; // Decimal as number
    netAmount: number; // Decimal as number
    paymentMethod?: string | null;
    paymentStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    paymentDate?: string | null; // ISO date string
    processedDate?: string | null; // ISO date string
    invoiceUrl?: string | null;
    serviceRequestIds: string[];
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    provider: {
      // Provider object
    };
  }>;
  total: number;
}
```

---

### GET `/payments/:id`

**Response:**
```typescript
{
  success: true,
  data: {
    // Payment object (same as GET /payments array items)
  };
}
```

---

### POST `/payments/:id/process`

**Response:**
```typescript
{
  success: true,
  data: {
    // Payment object
  };
}
```

---

### POST `/payments/:id/cancel`

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    // Payment object
  };
}
```

---

### GET `/payments/:id/invoice`

**Response:**
```typescript
{
  success: true,
  data: {
    payment: {
      // Payment object
    };
    invoiceUrl?: string | null;
  };
}
```

---

### GET `/customer-payments`

**Query Parameters:**
- `customerId`: `string`
- `status`: `"PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"`
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)
- `limit`: `number`
- `offset`: `number`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    id: string;
    customerId: string;
    serviceRequestId: string;
    amount: number; // Decimal as number
    paymentStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    paymentDate?: string | null; // ISO date string
    processedDate?: string | null; // ISO date string
    transactionId?: string | null;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    customer: {
      // Customer object
    };
    serviceRequest: {
      // ServiceRequest object
    };
  }>;
  total: number;
}
```

---

### POST `/customer-payments/:id/refund`

**Request Body:**
```json
{
  "amount": number,
  "reason": "string"
}
```

**Response:**
```typescript
{
  success: true,
  message: "Payment refunded";
}
```

---

### GET `/providers/:id/balance`

**Response:**
```typescript
{
  success: true,
  data: {
    providerId: string;
    totalBalance: number; // Decimal as number
    pendingBalance: number; // Decimal as number
    availableBalance: number; // Decimal as number;
    lastPaymentDate?: string | null; // ISO date string
  };
}
```

---

## Document Management Routes

### GET `/documents`

**Query Parameters:**
- `providerId`: `string`
- `documentType`: `string`
- `verificationStatus`: `"PENDING" | "VERIFIED" | "REJECTED"`
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)
- `limit`: `number`
- `offset`: `number`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    id: string;
    providerId: string;
    documentType: "ID_CARD_FRONT" | "ID_CARD_BACK" | "PASSPORT" | "DRIVING_LICENSE_FRONT" | "DRIVING_LICENSE_BACK" | "CERTIFICATE" | "OTHER";
    documentUrl: string;
    verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
    verifiedAt?: string | null; // ISO date string
    verifiedBy?: string | null;
    rejectionReason?: string | null;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    provider: {
      // Provider object
    };
  }>;
  total: number;
}
```

---

### GET `/documents/:id`

**Response:**
```typescript
{
  success: true,
  data: {
    // Document object (same as GET /documents array items)
  };
}
```

---

### POST `/documents/:id/approve`

**Response:**
```typescript
{
  success: true,
  data: {
    // Document object
  };
}
```

---

### POST `/documents/:id/reject`

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    // Document object
  };
}
```

---

### GET `/documents/:id/download`

**Response:**
```typescript
{
  success: true,
  data: {
    documentUrl: string;
  };
}
```

---

## Settings Routes

### GET `/settings`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    key: string;
    value: string | number | boolean | object;
    description?: string | null;
    category?: string | null;
    updatedAt: string; // ISO date string
    updatedBy?: string | null;
  }>;
}
```

---

### GET `/settings/:key`

**Response:**
```typescript
{
  success: true,
  data: {
    key: string;
    value: string | number | boolean | object;
    description?: string | null;
    category?: string | null;
    updatedAt: string;
    updatedBy?: string | null;
  };
}
```

**Error Response (404):**
```typescript
{
  success: false,
  message: "Setting not found";
}
```

---

### PUT `/settings/:key`

**Request Body:**
```json
{
  "value": "string | number | boolean | object"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    // Setting object (same as GET /settings/:key)
  };
}
```

---

### PUT `/settings`

**Request Body:**
```json
{
  "settings": Array<{
    "key": "string",
    "value": "string | number | boolean | object"
  }>
}
```

**Response:**
```typescript
{
  success: true,
  data: Array<{
    // Setting objects
  }>;
}
```

---

### GET `/settings/cancellation-policy`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    id: string;
    hoursBeforeService: number;
    refundPercentage: number; // Decimal as number
    isActive: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }>;
}
```

---

### PUT `/settings/cancellation-policy`

**Request Body:**
```json
{
  "policies": Array<{
    "hoursBeforeService": number,
    "refundPercentage": number,
    "isActive": boolean
  }>
}
```

**Response:**
```typescript
{
  success: true,
  data: Array<{
    // CancellationPolicy objects
  }>;
}
```

---

### GET `/cancellations`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    // Cancellation history items
  }>;
  total: number;
}
```

---

## Report Routes

### GET `/reports/providers`

**Query Parameters:**
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)
- `providerId`: `string`

**Response:**
```typescript
{
  success: true,
  data: {
    total: number;
    topProviders: Array<{
      providerId: string;
      providerName: string;
      totalServices: number;
      totalRevenue: number;
    }>;
    topRatedProviders: Array<{
      providerId: string;
      providerName: string;
      averageRating: number;
      totalRatings: number;
    }>;
    topEarningProviders: Array<{
      providerId: string;
      providerName: string;
      totalEarnings: number;
    }>;
  };
}
```

---

### GET `/reports/customers`

**Query Parameters:**
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)
- `customerId`: `string`

**Response:**
```typescript
{
  success: true,
  data: {
    total: number;
    topActiveCustomers: Array<{
      customerId: string;
      customerName: string;
      totalServices: number;
      totalSpent: number;
    }>;
  };
}
```

---

### GET `/reports/revenue`

**Query Parameters:**
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)

**Response:**
```typescript
{
  success: true,
  data: {
    totalRevenue: number;
    totalCommission: number;
    netRevenue: number;
    dailyRevenue: Array<{
      date: string; // ISO date string (YYYY-MM-DD)
      revenue: number;
      commission: number;
    }>;
  };
}
```

---

### GET `/reports/service-requests`

**Query Parameters:**
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)
- `status`: `string`

**Response:**
```typescript
{
  success: true,
  data: {
    total: number;
    statusDistribution: Array<{
      status: string;
      count: number;
    }>;
    cancellationRate: number; // percentage
    completionRate: number; // percentage
  };
}
```

---

### GET `/reports/operational`

**Query Parameters:**
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)

**Response:**
```typescript
{
  success: true,
  data: {
    avgResponseTime: number; // in minutes
    avgCompletionTime: number; // in minutes
    disputeRate: number; // percentage
    documentVerificationTime: number; // in hours
  };
}
```

---

## Audit Log Routes

### GET `/audit-logs`

**Query Parameters:**
- `adminId`: `string`
- `action`: `string`
- `entityType`: `string`
- `entityId`: `string`
- `startDate`: `string` (ISO date)
- `endDate`: `string` (ISO date)
- `limit`: `number`
- `offset`: `number`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    id: string;
    adminId: string;
    action: string;
    entityType: string;
    entityId: string;
    changes?: object | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt: string; // ISO date string
    admin: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  }>;
  total: number;
}
```

---

### GET `/audit-logs/:id`

**Response:**
```typescript
{
  success: true,
  data: Array<{
    // AuditLog objects (same as GET /audit-logs array items)
  }>;
}
```

---

## Common Response Patterns

### Success Response
All successful responses follow this pattern:
```typescript
{
  success: true,
  data: T, // Response data (type varies by endpoint)
  total?: number, // Present in paginated responses
  message?: string // Present in some action responses
}
```

### Error Response
All error responses follow this pattern:
```typescript
{
  success: false,
  message: string,
  error?: string, // Optional error code
  details?: any // Optional error details
}
```

### Pagination
Paginated endpoints include:
- `limit`: Maximum number of items per page
- `offset`: Number of items to skip
- `total`: Total number of items matching the query

---

## Type Definitions Reference

### Enums

**ProviderStatus:**
- `PENDING`
- `UNDER_REVIEW`
- `APPROVED`
- `REJECTED`
- `SUSPENDED`

**ServiceRequestStatus:**
- `NEW`
- `ACCEPTED`
- `REJECTED`
- `COMPLETED`
- `CANCELLED`
- `TIMEOUT`

**PaymentStatus:**
- `PENDING`
- `PROCESSING`
- `COMPLETED`
- `FAILED`

**DocumentVerificationStatus:**
- `PENDING`
- `VERIFIED`
- `REJECTED`

**DocumentType:**
- `ID_CARD_FRONT`
- `ID_CARD_BACK`
- `PASSPORT`
- `DRIVING_LICENSE_FRONT`
- `DRIVING_LICENSE_BACK`
- `CERTIFICATE`
- `OTHER`

**AdminRole:**
- `SUPER_ADMIN`
- `ADMIN`
- `MODERATOR`
- `SUPPORT`

**LocationPrivacy:**
- `EXACT`
- `APPROXIMATE`
- `HIDDEN`

**PaymentPeriod:**
- `WEEKLY`
- `BIWEEKLY`
- `MONTHLY`

**ServiceCategory:**
- `NAIL`
- `HAIR`
- `MAKEUP`
- `SKIN_CARE`
- `EYEBROW_LASH`
- `OTHER`

---

## Notes

1. **Date Formats**: All dates are returned as ISO 8601 strings (e.g., `"2024-01-15T10:30:00.000Z"`).

2. **Decimal Types**: Prisma Decimal types are serialized as numbers in JSON responses.

3. **Null vs Undefined**: Fields that can be null are typed as `T | null`. Fields that are always present are typed as `T`.

4. **Pagination**: When using pagination, always check the `total` field to determine the total number of items available.

5. **Authentication**: All endpoints except `/auth/login` require a valid JWT token in the `Authorization` header: `Bearer {accessToken}`.

6. **Error Handling**: Always check the `success` field before accessing `data`. On errors, `success` will be `false` and `message` will contain the error description.
