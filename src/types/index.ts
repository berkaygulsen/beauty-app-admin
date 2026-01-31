import { z } from "zod"

// Admin types
export interface Admin {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "SUPPORT"
  createdAt?: string
  updatedAt?: string
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  admin: Admin
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
}

// Error types
export interface ApiError {
  message: string
  code?: string
  errors?: Record<string, string[]>
}
