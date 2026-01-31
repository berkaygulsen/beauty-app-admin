import apiClient from "../client"
import type { ApiResponse, AuthResponse, LoginCredentials, Admin } from "@/types"

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<
      ApiResponse<{
        admin: Admin
        tokens: {
          accessToken: string
          refreshToken: string
          expiresIn: number
          refreshExpiresIn: number
        }
      }>
    >("/admin/auth/login", credentials)

    // Transform the response to match AuthResponse structure
    const { admin, tokens } = response.data.data
    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      admin,
    }
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post("/admin/auth/logout", { refreshToken })
  },

  getMe: async () => {
    const response = await apiClient.get<ApiResponse<AuthResponse["admin"]>>(
      "/admin/auth/me"
    )
    return response.data.data
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<
      ApiResponse<{
        admin: Admin
        tokens: {
          accessToken: string
          refreshToken: string
          expiresIn: number
          refreshExpiresIn: number
        }
      }>
    >("/admin/auth/refresh-token", { refreshToken })

    // Transform the response to match AuthResponse structure
    const { admin, tokens } = response.data.data
    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      admin,
    }
  },
}
