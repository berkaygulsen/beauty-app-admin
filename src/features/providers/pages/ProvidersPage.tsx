import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { providersApi, type ProviderFilters } from "@/api/endpoints/providers"
import { ProviderListTable } from "../components/ProviderListTable"
import { ProviderFilters as Filters } from "../components/ProviderFilters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableLoading, ErrorState, EmptyTableState } from "@/components/ui"
import { useNavigate } from "react-router-dom"

export default function ProvidersPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<ProviderFilters>({
    limit: 10,
    offset: 0,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["providers", filters],
    queryFn: () => providersApi.getProviders(filters),
  })

  const handlePageChange = (page: number) => {
    const limit = filters.limit || 10
    setFilters((prev) => ({ ...prev, offset: (page - 1) * limit }))
  }

  const currentPage = filters.offset ? Math.floor((filters.offset || 0) / (filters.limit || 10)) + 1 : 1
  const totalPages = data?.total ? Math.ceil(data.total / (filters.limit || 10)) : 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Provider'lar</h1>
          <p className="text-muted-foreground">
            Provider'ları görüntüleyin ve yönetin
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <Filters filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Provider Listesi
              {data && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({data.total} kayıt)
                </span>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableLoading />
          ) : error ? (
            <ErrorState
              title="Provider'lar yüklenirken hata oluştu"
              message={
                error instanceof Error
                  ? error.message
                  : "Bir hata oluştu. Lütfen tekrar deneyin."
              }
              onRetry={() => refetch()}
            />
          ) : data && data.data && data.data.length > 0 ? (
            <ProviderListTable
              providers={data.data}
              pagination={{
                page: currentPage,
                limit: filters.limit || 10,
                total: data.total || 0,
                totalPages,
              }}
              onPageChange={handlePageChange}
              onSortChange={(sortBy, sortOrder) => {
                // Note: API doesn't support sortBy/sortOrder, but keeping for UI compatibility
                setFilters((prev) => ({ ...prev }))
              }}
              onProviderAction={refetch}
            />
          ) : (
            <EmptyTableState message="Henüz provider kaydı bulunmuyor." />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
