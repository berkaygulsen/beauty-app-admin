import apiClient from "../client"
import type { ApiResponse, PaginatedResponse } from "../types"

export type DocumentType =
  | "ID_CARD_FRONT"
  | "ID_CARD_BACK"
  | "PASSPORT"
  | "DRIVING_LICENSE_FRONT"
  | "DRIVING_LICENSE_BACK"
  | "CERTIFICATE"
  | "OTHER"

export interface Document {
  id: string
  providerId: string
  documentType: DocumentType
  documentUrl: string
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED"
  verifiedAt?: string | null // ISO date string
  verifiedBy?: string | null
  rejectionReason?: string | null
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  provider?: {
    id: string
    firstName?: string
    lastName?: string
    email?: string
  } | null
}

export interface DocumentFilters {
  providerId?: string
  documentType?: DocumentType
  verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED"
  startDate?: string // ISO date
  endDate?: string // ISO date
  limit?: number
  offset?: number
}

export interface DocumentDetail extends Document {
  // Same structure as Document
}

export interface RejectDocumentRequest {
  reason: string
}

export const documentsApi = {
  getDocuments: async (
    filters?: DocumentFilters
  ): Promise<PaginatedResponse<Document>> => {
    const response = await apiClient.get<
      ApiResponse<Document[]> & { total: number }
    >("/admin/documents", { params: filters })
    return {
      data: response.data.data,
      total: response.data.total,
    }
  },

  getDocument: async (id: string): Promise<DocumentDetail> => {
    const response = await apiClient.get<ApiResponse<DocumentDetail>>(
      `/admin/documents/${id}`
    )
    return response.data.data
  },

  approveDocument: async (id: string): Promise<Document> => {
    const response = await apiClient.post<ApiResponse<Document>>(
      `/admin/documents/${id}/approve`
    )
    return response.data.data
  },

  rejectDocument: async (
    id: string,
    data: RejectDocumentRequest
  ): Promise<Document> => {
    const response = await apiClient.post<ApiResponse<Document>>(
      `/admin/documents/${id}/reject`,
      data
    )
    return response.data.data
  },

  downloadDocument: async (id: string) => {
    interface DownloadResponse {
      documentUrl: string
    }
    const response = await apiClient.get<ApiResponse<DownloadResponse>>(
      `/admin/documents/${id}/download`
    )
    return response.data.data
  },
}
