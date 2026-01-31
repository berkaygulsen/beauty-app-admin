import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import { ROUTES } from "@/lib/constants"
import type { ReactNode } from "react"

export function PublicRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <>{children}</>
}
