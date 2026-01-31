import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Admin, AuthResponse } from "@/types"

interface AuthState {
  token: string | null
  refreshToken: string | null
  admin: Admin | null
  isAuthenticated: boolean
  setAuth: (authData: AuthResponse) => void
  clearAuth: () => void
  setAdmin: (admin: Admin) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      admin: null,
      isAuthenticated: false,
      setAuth: (authData) =>
        set({
          token: authData.token,
          refreshToken: authData.refreshToken,
          admin: authData.admin,
          isAuthenticated: true,
        }),
      clearAuth: () =>
        set({
          token: null,
          refreshToken: null,
          admin: null,
          isAuthenticated: false,
        }),
      setAdmin: (admin) => set({ admin }),
    }),
    {
      name: "auth-storage",
    }
  )
)
