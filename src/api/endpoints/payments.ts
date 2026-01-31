import apiClient from "../client"
import type { ApiResponse, PaginatedResponse } from "../types"

export interface Payment {
  id: string
  providerId: string
  amount: number // Decimal as number
  commission: number // Decimal as number
  netAmount: number // Decimal as number
  paymentMethod?: string | null
  paymentStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
  paymentDate?: string | null // ISO date string
  processedDate?: string | null // ISO date string
  invoiceUrl?: string | null
  serviceRequestIds: string[]
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  provider?: {
    id: string
    firstName?: string
    lastName?: string
    email?: string
  } | null
}

export interface PaymentFilters {
  providerId?: string
  status?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
  startDate?: string // ISO date
  endDate?: string // ISO date
  minAmount?: number
  maxAmount?: number
  limit?: number
  offset?: number
}

export interface PaymentDetail extends Payment {
  status?: Payment["paymentStatus"] // alias for UI
  totalAmount?: number
  processedAt?: string | null
  providerName?: string
  invoice?: {
    url?: string | null
    id?: string
    invoiceNumber?: string
    createdAt?: string
  } | null
  serviceRequests?: Array<{
    id: string
    amount?: number
    commission?: number
    status?: string
    paidAt?: string
    serviceName?: string
  }>
}

export interface CustomerPayment {
  id: string
  customerId: string
  serviceRequestId: string
  amount: number // Decimal as number
  paymentStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
  paymentDate?: string | null // ISO date string
  processedDate?: string | null // ISO date string
  transactionId?: string | null
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  customer: {
    // Customer object
  }
  serviceRequest: {
    // ServiceRequest object
  }
}

export interface ProviderBalance {
  providerId: string
  totalBalance: number // Decimal as number
  pendingBalance: number // Decimal as number
  availableBalance: number // Decimal as number
  lastPaymentDate?: string | null // ISO date string
}

export const paymentsApi = {
  getPayments: async (
    filters?: PaymentFilters
  ): Promise<PaginatedResponse<Payment>> => {
    const response = await apiClient.get<
      ApiResponse<Payment[]> & { total: number }
    >("/admin/payments", { params: filters })
    return {
      data: response.data.data,
      total: response.data.total,
    }
  },

  getPayment: async (id: string): Promise<PaymentDetail> => {
    const response = await apiClient.get<ApiResponse<PaymentDetail>>(
      `/admin/payments/${id}`
    )
    return response.data.data
  },

  processPayment: async (id: string): Promise<Payment> => {
    const response = await apiClient.post<ApiResponse<Payment>>(
      `/admin/payments/${id}/process`
    )
    return response.data.data
  },

  cancelPayment: async (id: string, reason: string): Promise<Payment> => {
    const response = await apiClient.post<ApiResponse<Payment>>(
      `/admin/payments/${id}/cancel`,
      { reason }
    )
    return response.data.data
  },

  getInvoice: async (id: string) => {
    interface InvoiceResponse {
      payment: Payment
      invoiceUrl?: string | null
    }
    const response = await apiClient.get<ApiResponse<InvoiceResponse>>(
      `/admin/payments/${id}/invoice`
    )
    return response.data.data
  },

  getCustomerPayments: async (
    filters?: {
      customerId?: string
      status?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
      startDate?: string
      endDate?: string
      limit?: number
      offset?: number
    }
  ): Promise<PaginatedResponse<CustomerPayment>> => {
    const response = await apiClient.get<
      ApiResponse<CustomerPayment[]> & { total: number }
    >("/admin/customer-payments", { params: filters })
    return {
      data: response.data.data,
      total: response.data.total,
    }
  },

  refundCustomerPayment: async (
    id: string,
    data: { amount: number; reason: string }
  ): Promise<void> => {
    await apiClient.post<ApiResponse<{ message: string }>>(
      `/admin/customer-payments/${id}/refund`,
      data
    )
  },

  getProviderBalance: async (providerId: string): Promise<ProviderBalance> => {
    const response = await apiClient.get<ApiResponse<ProviderBalance>>(
      `/admin/providers/${providerId}/balance`
    )
    return response.data.data
  },
}
