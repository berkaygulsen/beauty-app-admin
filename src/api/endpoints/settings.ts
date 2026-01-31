import apiClient from "../client"
import type { ApiResponse } from "../types"

export interface Setting {
  key: string
  value: string | number | boolean | object
  description?: string | null
  category?: string | null
  updatedAt: string // ISO date string
  updatedBy?: string | null
}

export interface CancellationPolicy {
  id: string
  hoursBeforeService: number
  refundPercentage: number // Decimal as number
  isActive: boolean
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

export interface UpdateSettingRequest {
  value: string | number | boolean | object
}

export interface UpdateSettingsRequest {
  settings: Array<{
    key: string
    value: string | number | boolean | object
  }>
}

export interface UpdateCancellationPolicyRequest {
  policies: Array<{
    hoursBeforeService: number
    refundPercentage: number
    isActive: boolean
  }>
}

export const settingsApi = {
  getSettings: async (): Promise<Setting[]> => {
    const response = await apiClient.get<ApiResponse<Setting[]>>(
      "/admin/settings"
    )
    return response.data.data
  },

  getSetting: async (key: string): Promise<Setting> => {
    const response = await apiClient.get<ApiResponse<Setting>>(
      `/admin/settings/${key}`
    )
    return response.data.data
  },

  updateSetting: async (
    key: string,
    data: UpdateSettingRequest
  ): Promise<Setting> => {
    const response = await apiClient.put<ApiResponse<Setting>>(
      `/admin/settings/${key}`,
      data
    )
    return response.data.data
  },

  updateSettings: async (
    data: UpdateSettingsRequest
  ): Promise<Setting[]> => {
    const response = await apiClient.put<ApiResponse<Setting[]>>(
      "/admin/settings",
      data
    )
    return response.data.data
  },

  getCancellationPolicy: async (): Promise<CancellationPolicy[]> => {
    const response = await apiClient.get<ApiResponse<CancellationPolicy[]>>(
      "/admin/settings/cancellation-policy"
    )
    return response.data.data
  },

  updateCancellationPolicy: async (
    data: UpdateCancellationPolicyRequest
  ): Promise<CancellationPolicy[]> => {
    const response = await apiClient.put<ApiResponse<CancellationPolicy[]>>(
      "/admin/settings/cancellation-policy",
      data
    )
    return response.data.data
  },

  getCancellations: async (filters?: {
    providerId?: string
    customerId?: string
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
  }) => {
    interface Cancellation {
      id: string
      serviceRequestId: string
      cancelledBy: "CUSTOMER" | "PROVIDER"
      reason: string
      penaltyAmount?: number | null
      refundAmount?: number | null
      appliedPolicy?: {
        hoursBeforeService: number
        refundPercentage: number
      } | null
      createdAt: string // ISO date string
      serviceRequest: {
        id: string
        provider: {
          id: string
          firstName: string
          lastName: string
        }
        customer: {
          id: string
          firstName: string
          lastName: string
        }
        service: {
          id: string
          name: string
        }
        price: number
        requestedDate: string
      }
    }
    const response = await apiClient.get<
      ApiResponse<{ data: Cancellation[]; total: number }>
    >("/admin/cancellations", { params: filters })
    return response.data.data
  },
}
