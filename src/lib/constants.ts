// Route paths
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROVIDERS: "/providers",
  CUSTOMERS: "/customers",
  SERVICE_REQUESTS: "/service-requests",
  PAYMENTS: "/payments",
  DOCUMENTS: "/documents",
  SETTINGS: "/settings",
  REPORTS: "/reports",
  CANCELLATION_POLICY: "/settings/cancellation-policy",
  CANCELLATION_HISTORY: "/settings/cancellation-history",
  PENDING_COMPLETION: "/service-requests/pending-completion",
  DISPUTED_REQUESTS: "/service-requests/disputed",
  REPORTS_PROVIDERS: "/reports/providers",
  REPORTS_CUSTOMERS: "/reports/customers",
  REPORTS_REVENUE: "/reports/revenue",
  REPORTS_SERVICE_REQUESTS: "/reports/service-requests",
  REPORTS_OPERATIONAL: "/reports/operational",
  AUDIT_LOGS: "/audit-logs",
} as const

// Provider statuses
export const PROVIDER_STATUS = {
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
} as const

// Service request statuses
export const SERVICE_REQUEST_STATUS = {
  CREATED: "CREATED",
  ACCEPTED: "ACCEPTED",
  PAYMENT_RECEIVED: "PAYMENT_RECEIVED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  TIMEOUT: "TIMEOUT",
} as const

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const

// Document statuses
export const DOCUMENT_STATUS = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
} as const

// Admin roles
export const ADMIN_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  SUPPORT: "SUPPORT",
} as const
