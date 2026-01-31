import apiClient from "../client"
import type { ApiResponse } from "../types"

export interface DashboardStats {
  providers: {
    total: number
    pending: number
    approved: number
    suspended: number
    rejected: number
  }
  customers: {
    total: number
    newToday: number
    newThisMonth: number
  }
  serviceRequests: {
    total: number
    created: number
    accepted: number
    paymentReceived: number
    completed: number
    cancelled: number
  }
  revenue: {
    today: number
    thisMonth: number
    total: number
    commission: number
  }
  pendingActions: {
    pendingProviders: number
    pendingDocuments: number
    disputedRequests: number
  }
}

export interface ChartData {
  serviceRequestTrend: Array<{ date: string; count: number }>
  providerStatusDistribution: Array<{ status: string; count: number }>
  revenueTrend: Array<{ date: string; amount: number }>
  popularServiceCategories: Array<{ category: string; count: number }>
}

export interface Activity {
  id?: string
  type: string // "provider_registered" | "service_request_created" | "payment_completed"
  description: string
  timestamp: string // ISO date string
  createdAt?: string // Alternative timestamp field
  entityId?: string
  entityType?: string // "Provider" | "ServiceRequest" | "Payment"
  user?: {
    name: string
    email: string
  }
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      "/admin/dashboard/stats"
    )
    return response.data.data
  },

  getCharts: async (period?: "7d" | "30d" | "90d" | "1y"): Promise<ChartData> => {
    const response = await apiClient.get<ApiResponse<ChartData>>(
      "/admin/dashboard/charts",
      { params: period ? { period } : undefined }
    )
    return response.data.data
  },

  getActivities: async (limit?: number): Promise<Activity[]> => {
    const response = await apiClient.get<ApiResponse<Activity[]>>(
      "/admin/dashboard/activities",
      { params: limit ? { limit } : undefined }
    )
    return response.data.data
  },
}
