import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi } from "@/api/endpoints/auth"
import { useAuthStore } from "@/store/authStore"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/lib/constants"
import toast from "react-hot-toast"

export function useAuth() {
  const { setAuth, clearAuth, isAuthenticated, refreshToken } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data)
      toast.success("Giriş başarılı")
      navigate(ROUTES.DASHBOARD)
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Giriş yapılırken bir hata oluştu"
      )
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => {
      const token = refreshToken || ""
      return authApi.logout(token)
    },
    onSuccess: () => {
      clearAuth()
      queryClient.clear()
      navigate(ROUTES.LOGIN)
      toast.success("Çıkış yapıldı")
    },
    onError: () => {
      // Even if logout fails on server, clear local auth
      clearAuth()
      queryClient.clear()
      navigate(ROUTES.LOGIN)
    },
  })

  const { data: admin, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    retry: false,
  })

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    admin,
    isLoadingAdmin: isLoading,
    isAuthenticated,
  }
}
