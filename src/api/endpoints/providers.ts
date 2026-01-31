import apiClient from "../client"
import type { ApiResponse, PaginatedResponse } from "../types"

export interface Provider {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  addressLine?: string | null
  city?: string | null
  district?: string | null
  neighborhood?: string | null
  street?: string | null
  buildingNumber?: string | null
  apartmentNumber?: string | null
  latitude?: number | null
  longitude?: number | null
  profilePhotoUrl?: string | null
  bio?: string | null
  experienceYears?: number | null
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED"
  emailVerified: boolean
  phoneVerified: boolean
  score: number
  baseScore: number
  isOnline: boolean
  lastActiveAt?: string | null // ISO date string
  locationPrivacy: "EXACT" | "APPROXIMATE" | "HIDDEN"
  paymentPeriod: "WEEKLY" | "BIWEEKLY" | "MONTHLY"
  minimumPaymentAmount: number | string // Can be string from API
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  _count?: {
    serviceRequests?: number
    services?: number
    ratings?: number
  }
}

export interface ProviderFilters {
  status?: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED"
  city?: string
  district?: string
  minScore?: number
  maxScore?: number
  search?: string
  startDate?: string // ISO date
  endDate?: string // ISO date
  limit?: number
  offset?: number
}

export interface ProviderDetail extends Provider {
  address?: string
  totalServices?: number
  averageRating?: number | null
  approvedAt?: string | null
  services: Array<{
    id: string
    name: string
    category: string
    price: number
  }>
  serviceRequests: Array<{
    id: string
    status: string
    createdAt: string
  }>
  payments: Array<{
    id: string
    amount: number
    status: string
    createdAt: string
  }>
  documents: Array<{
    id: string
    type: string
    status: string
    uploadedAt: string
  }>
  ratingHistory: Array<{
    id: string
    score: number
    comment: string
    createdAt: string
  }>
  activityLog: Array<{
    id: string
    action: string
    description: string
    createdAt: string
  }>
}

export interface ApproveProviderRequest {
  reason?: string
}

export interface RejectProviderRequest {
  reason: string
}

export interface SuspendProviderRequest {
  reason: string
}

export interface UpdateProviderRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  city?: string
  district?: string
}

export interface UpdateProviderScoreRequest {
  score: number
  reason?: string
}

export const providersApi = {
  getProviders: async (
    filters?: ProviderFilters
  ): Promise<PaginatedResponse<Provider>> => {
    const response = await apiClient.get<
      ApiResponse<Provider[]> & { total: number }
    >("/admin/providers", { params: filters })
    return {
      data: response.data.data,
      total: response.data.total,
    }
  },

  getProvider: async (id: string): Promise<ProviderDetail> => {
    const response = await apiClient.get<ApiResponse<ProviderDetail>>(
      `/admin/providers/${id}`
    )
    return response.data.data
  },

  updateProvider: async (
    id: string,
    data: UpdateProviderRequest
  ): Promise<Provider> => {
    const response = await apiClient.put<ApiResponse<Provider>>(
      `/admin/providers/${id}`,
      data
    )
    return response.data.data
  },

  approveProvider: async (
    id: string,
    data?: ApproveProviderRequest
  ): Promise<Provider> => {
    const response = await apiClient.post<ApiResponse<Provider>>(
      `/admin/providers/${id}/approve`,
      data
    )
    return response.data.data
  },

  rejectProvider: async (
    id: string,
    data: RejectProviderRequest
  ): Promise<Provider> => {
    const response = await apiClient.post<ApiResponse<Provider>>(
      `/admin/providers/${id}/reject`,
      data
    )
    return response.data.data
  },

  suspendProvider: async (
    id: string,
    data: SuspendProviderRequest
  ): Promise<Provider> => {
    const response = await apiClient.post<ApiResponse<Provider>>(
      `/admin/providers/${id}/suspend`,
      data
    )
    return response.data.data
  },

  unsuspendProvider: async (id: string): Promise<Provider> => {
    const response = await apiClient.post<ApiResponse<Provider>>(
      `/admin/providers/${id}/unsuspend`
    )
    return response.data.data
  },

  updateProviderScore: async (
    id: string,
    data: UpdateProviderScoreRequest
  ): Promise<Provider> => {
    const response = await apiClient.put<ApiResponse<Provider>>(
      `/admin/providers/${id}/score`,
      data
    )
    return response.data.data
  },
}
