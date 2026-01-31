import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "@/api/endpoints/dashboard"

export function useDashboard() {
  const statsQuery = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardApi.getStats(),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  })

  const chartsQuery = useQuery({
    queryKey: ["dashboard", "charts"],
    queryFn: () => dashboardApi.getCharts(),
    refetchInterval: (query) => {
      // Don't refetch if there's an error
      return query.state.error ? false : 10 * 60 * 1000 // 10 minutes
    },
    retry: false, // Don't retry on error
  })

  const activitiesQuery = useQuery({
    queryKey: ["dashboard", "activities"],
    queryFn: () => dashboardApi.getActivities(),
    refetchInterval: (query) => {
      // Don't refetch if there's an error
      return query.state.error ? false : 2 * 60 * 1000 // 2 minutes
    },
    retry: false, // Don't retry on error
  })

  return {
    stats: statsQuery.data,
    charts: chartsQuery.data,
    activities: activitiesQuery.data,
    isLoading: statsQuery.isLoading || chartsQuery.isLoading,
    isLoadingActivities: activitiesQuery.isLoading,
    error: statsQuery.error || chartsQuery.error,
  }
}
