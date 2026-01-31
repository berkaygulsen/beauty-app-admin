import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  serviceRequestsApi,
  type ServiceRequestFilters,
} from "@/api/endpoints/serviceRequests"
import { ServiceRequestListTable } from "../components/ServiceRequestListTable"
import { ServiceRequestFilters as Filters } from "../components/ServiceRequestFilters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ServiceRequestsPage() {
  const [filters, setFilters] = useState<ServiceRequestFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["service-requests", filters],
    queryFn: () => serviceRequestsApi.getServiceRequests(filters),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hizmet Talepleri</h1>
        <p className="text-muted-foreground">
          Hizmet taleplerini görüntüleyin ve yönetin
        </p>
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
          <CardTitle>
            Hizmet Talebi Listesi
            {data && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({data.pagination.total} kayıt)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Yükleniyor...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-destructive">
                Bir hata oluştu. Lütfen tekrar deneyin.
              </div>
            </div>
          ) : data ? (
            <ServiceRequestListTable
              serviceRequests={data.data}
              pagination={data.pagination}
              onPageChange={(page) =>
                setFilters((prev) => ({ ...prev, page }))
              }
              onSortChange={(sortBy, sortOrder) =>
                setFilters((prev) => ({ ...prev, sortBy, sortOrder }))
              }
              onAction={refetch}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
