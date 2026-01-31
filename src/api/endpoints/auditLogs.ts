import apiClient from "../client"
import type { ApiResponse, PaginatedResponse } from "../types"

export interface AuditLog {
  id: string
  adminId: string
  action: string
  entityType: string
  entityId: string
  changes?: object | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: string // ISO date string
  admin: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
  }
}

export interface AuditLogFilters {
  adminId?: string
  action?: string
  entityType?: string
  entityId?: string
  startDate?: string // ISO date
  endDate?: string // ISO date
  limit?: number
  offset?: number
}

export const auditLogsApi = {
  getAuditLogs: async (
    filters?: AuditLogFilters
  ): Promise<PaginatedResponse<AuditLog>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<AuditLog>>
    >("/admin/audit-logs", { params: filters })
    return response.data.data
  },

  getAuditLog: async (id: string): Promise<AuditLog> => {
    const response = await apiClient.get<ApiResponse<AuditLog>>(
      `/admin/audit-logs/${id}`
    )
    return response.data.data
  },
}
