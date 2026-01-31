import apiClient from "../client"
import type { ApiResponse, PaginatedResponse } from "../types"

export interface ServiceRequest {
  id: string
  providerId: string
  customerId: string
  serviceId: string
  status: "NEW" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED" | "TIMEOUT" | "PAYMENT_RECEIVED"
  requestedDate: string // ISO date string
  requestedTime: string
  addressLine?: string | null
  latitude?: number | null
  longitude?: number | null
  approximateDistance?: number | null // Decimal as number
  specialNotes?: string | null
  price: number // Decimal as number
  commission: number // Decimal as number
  commissionRate: number // Decimal as number
  netAmount: number // Decimal as number
  rejectionReason?: "NOT_AVAILABLE" | "TOO_FAR" | "SERVICE_NOT_SUITABLE" | "PERSONAL_REASON" | "OTHER" | null
  rejectionNote?: string | null
  responseDeadline?: string | null // ISO date string
  respondedAt?: string | null // ISO date string
  completedAt?: string | null // ISO date string
  cancelledAt?: string | null // ISO date string
  cancelledBy?: string | null
  cancellationReason?: string | null
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  provider: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  service: {
    id: string
    name: string
    price: number
  }
  payment?: {
    amount?: number
    status?: string
    paidAt?: string
  } | null
  rating?: {
    // Rating object
  } | null
}

export interface ServiceRequestFilters {
  status?: "NEW" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED" | "TIMEOUT"
  providerId?: string
  customerId?: string
  startDate?: string // ISO date
  endDate?: string // ISO date
  minPrice?: number
  maxPrice?: number
  limit?: number
  offset?: number
  page?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface ServiceRequestStatusHistoryItem {
  id: string
  status: string
  changedAt: string
  changedBy?: string | null
  reason?: string | null
}

export interface ServiceRequestReview {
  id?: string
  rating?: number
  comment?: string
  createdAt?: string
}

export interface ServiceRequestDetail extends ServiceRequest {
  statusHistory?: ServiceRequestStatusHistoryItem[]
  review?: ServiceRequestReview | null
  serviceName?: string
  requestDate?: string
  requestTime?: string
  notes?: string | null
  providerName?: string
  customerName?: string
  address?: { city?: string; district?: string; addressLine?: string }
}

export interface UpdateStatusRequest {
  status: "NEW" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED" | "TIMEOUT" | "PAYMENT_RECEIVED"
  reason?: string // optional
}

export interface CancelRequest {
  reason: string
}

export interface ResolveDisputeRequest {
  resolution: string
  refundAmount?: number // optional
}

export const serviceRequestsApi = {
  getServiceRequests: async (
    filters?: ServiceRequestFilters
  ): Promise<PaginatedResponse<ServiceRequest>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<ServiceRequest>>
    >("/admin/service-requests", { params: filters })
    return response.data.data
  },

  getServiceRequest: async (id: string): Promise<ServiceRequestDetail> => {
    const response = await apiClient.get<ApiResponse<ServiceRequestDetail>>(
      `/admin/service-requests/${id}`
    )
    return response.data.data
  },

  updateStatus: async (
    id: string,
    data: UpdateStatusRequest
  ): Promise<ServiceRequest> => {
    const response = await apiClient.put<ApiResponse<ServiceRequest>>(
      `/admin/service-requests/${id}/status`,
      data
    )
    return response.data.data
  },

  cancel: async (id: string, data: CancelRequest): Promise<ServiceRequest> => {
    const response = await apiClient.post<ApiResponse<ServiceRequest>>(
      `/admin/service-requests/${id}/cancel`,
      data
    )
    return response.data.data
  },

  complete: async (id: string): Promise<ServiceRequest> => {
    const response = await apiClient.post<ApiResponse<ServiceRequest>>(
      `/admin/service-requests/${id}/complete`
    )
    return response.data.data
  },

  resolveDispute: async (
    id: string,
    data: ResolveDisputeRequest
  ): Promise<void> => {
    await apiClient.post<ApiResponse<{ message: string }>>(
      `/admin/service-requests/${id}/resolve-dispute`,
      data
    )
  },

  getStatusHistory: async (id: string) => {
    interface StatusHistoryItem {
      id: string
      serviceRequestId: string
      previousStatus: "NEW" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED" | "TIMEOUT"
      newStatus: "NEW" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED" | "TIMEOUT"
      reason?: string | null
      changedBy?: string | null
      createdAt: string // ISO date string
    }
    const response = await apiClient.get<ApiResponse<StatusHistoryItem[]>>(
      `/admin/service-requests/${id}/status-history`
    )
    return response.data.data
  },

  getPendingCompletion: async (
    filters?: {
      providerId?: string
      customerId?: string
      startDate?: string
      endDate?: string
      limit?: number
      offset?: number
    }
  ): Promise<PaginatedResponse<ServiceRequest>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<ServiceRequest>>
    >("/admin/service-requests/pending-completion", { params: filters })
    return response.data.data
  },

  getDisputed: async (
    filters?: {
      status?: string
      raisedBy?: string
      startDate?: string
      endDate?: string
      limit?: number
      offset?: number
    }
  ) => {
    interface ServiceRequestDispute {
      id: string
      serviceRequestId: string
      raisedBy: string // "CUSTOMER" | "PROVIDER"
      reason: string
      status: "PENDING" | "RESOLVED" | "REJECTED"
      resolution?: string | null
      refundAmount?: number | null
      resolvedAt?: string | null // ISO date string
      resolvedBy?: string | null
      createdAt: string // ISO date string
      updatedAt: string // ISO date string
      serviceRequest: ServiceRequest
    }
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<ServiceRequestDispute>>
    >("/admin/service-requests/disputed", { params: filters })
    return response.data.data
  },
}
