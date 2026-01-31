import apiClient from "../client"
import type { ApiResponse } from "../types"

export interface ProviderReport {
  total: number
  topProviders: Array<{
    providerId: string
    providerName: string
    totalServices: number
    totalRevenue: number
  }>
  topRatedProviders: Array<{
    providerId: string
    providerName: string
    averageRating: number
    totalRatings: number
  }>
  topEarningProviders: Array<{
    providerId: string
    providerName: string
    totalEarnings: number
  }>
}

export interface CustomerReport {
  total: number
  topActiveCustomers: Array<{
    customerId: string
    customerName: string
    totalServices: number
    totalSpent: number
  }>
}

export interface RevenueReport {
  totalRevenue: number
  totalCommission: number
  netRevenue: number
  dailyRevenue: Array<{
    date: string // ISO date string (YYYY-MM-DD)
    revenue: number
    commission: number
  }>
}

export interface ServiceRequestReport {
  total: number
  statusDistribution: Array<{
    status: string
    count: number
  }>
  cancellationRate: number // percentage
  completionRate: number // percentage
}

export interface OperationalReport {
  avgResponseTime: number // in minutes
  avgCompletionTime: number // in minutes
  disputeRate: number // percentage
  documentVerificationTime: number // in hours
}

export interface ReportFilters {
  startDate?: string // ISO date
  endDate?: string // ISO date
  providerId?: string
  customerId?: string
  status?: string
}

export const reportsApi = {
  getProviderReport: async (
    filters?: ReportFilters
  ): Promise<ProviderReport> => {
    const response = await apiClient.get<ApiResponse<ProviderReport>>(
      "/admin/reports/providers",
      { params: filters }
    )
    return response.data.data
  },

  getCustomerReport: async (
    filters?: ReportFilters
  ): Promise<CustomerReport> => {
    const response = await apiClient.get<ApiResponse<CustomerReport>>(
      "/admin/reports/customers",
      { params: filters }
    )
    return response.data.data
  },

  getRevenueReport: async (
    filters?: ReportFilters
  ): Promise<RevenueReport> => {
    const response = await apiClient.get<ApiResponse<RevenueReport>>(
      "/admin/reports/revenue",
      { params: filters }
    )
    return response.data.data
  },

  getServiceRequestReport: async (
    filters?: ReportFilters
  ): Promise<ServiceRequestReport> => {
    const response = await apiClient.get<ApiResponse<ServiceRequestReport>>(
      "/admin/reports/service-requests",
      { params: filters }
    )
    return response.data.data
  },

  getOperationalReport: async (
    filters?: ReportFilters
  ): Promise<OperationalReport> => {
    const response = await apiClient.get<ApiResponse<OperationalReport>>(
      "/admin/reports/operational",
      { params: filters }
    )
    return response.data.data
  },
}
