import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios"
import { useAuthStore } from "@/store/authStore"
import toast from "react-hot-toast"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.aurorabeauty.app/api/v1"

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor - Add token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token
    if (token && config.headers && typeof token === "string" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - Token expired or missing
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const { refreshToken, clearAuth, token } = useAuthStore.getState()

      // If no token at all, redirect immediately
      if (!token || token === "undefined") {
        clearAuth()
        // Show error message if available
        const errorMessage = error.response?.data?.error?.message || 
                           error.response?.data?.message || 
                           "Oturum süreniz doldu. Lütfen tekrar giriş yapın."
        toast.error(errorMessage)
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        return Promise.reject(error)
      }

      if (refreshToken && refreshToken !== "undefined") {
        try {
          // Attempt to refresh token
          const response = await axios.post(
            `${API_BASE_URL}/admin/auth/refresh-token`,
            { refreshToken }
          )

          // Handle nested token structure from backend
          const responseData = response.data.data
          let newToken: string
          let newRefreshToken: string
          let admin = useAuthStore.getState().admin!

          if (responseData.tokens) {
            // Nested structure: { admin, tokens: { accessToken, refreshToken } }
            newToken = responseData.tokens.accessToken
            newRefreshToken = responseData.tokens.refreshToken
            if (responseData.admin) {
              admin = responseData.admin
            }
          } else {
            // Flat structure: { token, refreshToken, admin }
            newToken = responseData.token
            newRefreshToken = responseData.refreshToken
            if (responseData.admin) {
              admin = responseData.admin
            }
          }

          useAuthStore.getState().setAuth({
            token: newToken,
            refreshToken: newRefreshToken,
            admin,
          })

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          // Refresh failed, clear auth and redirect to login
          clearAuth()
          const errorMessage = error.response?.data?.error?.message || 
                             error.response?.data?.message || 
                             "Oturum yenileme başarısız. Lütfen tekrar giriş yapın."
          toast.error(errorMessage)
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token, clear auth and redirect to login
        clearAuth()
        const errorMessage = error.response?.data?.error?.message || 
                           error.response?.data?.message || 
                           "Oturum süreniz doldu. Lütfen tekrar giriş yapın."
        toast.error(errorMessage)
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
