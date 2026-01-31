import apiClient from "../client"
import type { ApiResponse, PaginatedResponse } from "../types"

export interface Customer {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  profilePhotoUrl?: string | null
  averageRating?: number | string | null // Can be number or string from API
  totalServices: number
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

export interface CustomerFilters {
  search?: string
  emailVerified?: "true" | "false"
  phoneVerified?: "true" | "false"
  startDate?: string // ISO date
  endDate?: string // ISO date
  limit?: number
  offset?: number
}

export interface CustomerDetail extends Customer {
  addresses: Array<{
    id: string
    city: string
    district: string
    addressLine: string
    isDefault: boolean
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
  reviews: Array<{
    id: string
    rating: number
    comment: string
    createdAt: string
  }>
}

export interface SuspendCustomerRequest {
  reason: string
}

export interface UpdateCustomerRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export const customersApi = {
  getCustomers: async (
    filters?: CustomerFilters
  ): Promise<PaginatedResponse<Customer>> => {
    const response = await apiClient.get<
      ApiResponse<Customer[]> & { total: number }
    >("/admin/customers", { params: filters })
    return {
      data: response.data.data,
      total: response.data.total,
    }
  },

  getCustomer: async (id: string): Promise<CustomerDetail> => {
    const response = await apiClient.get<ApiResponse<CustomerDetail>>(
      `/admin/customers/${id}`
    )
    return response.data.data
  },

  updateCustomer: async (
    id: string,
    data: UpdateCustomerRequest
  ): Promise<Customer> => {
    const response = await apiClient.put<ApiResponse<Customer>>(
      `/admin/customers/${id}`,
      data
    )
    return response.data.data
  },

  suspendCustomer: async (
    id: string,
    data: SuspendCustomerRequest
  ): Promise<void> => {
    await apiClient.post<ApiResponse<{ message: string }>>(
      `/admin/customers/${id}/suspend`,
      data
    )
  },

  unsuspendCustomer: async (id: string): Promise<void> => {
    await apiClient.post<ApiResponse<{ message: string }>>(
      `/admin/customers/${id}/unsuspend`
    )
  },
}
