import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  serviceRequestsApi,
  type ServiceRequestFilters,
} from "@/api/endpoints/serviceRequests"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceRequestListTable } from "../components/ServiceRequestListTable"
import { ServiceRequestFilters as Filters } from "../components/ServiceRequestFilters"

export default function PendingCompletionPage() {
  const [filters, setFilters] = useState<ServiceRequestFilters>({
    providerId: undefined,
    customerId: undefined,
    startDate: undefined,
    endDate: undefined,
    limit: 20,
    offset: 0,
  })
  const limit = filters.limit ?? 20
  const page = filters.offset !== undefined ? Math.floor(filters.offset / limit) + 1 : 1

  const { data, isLoading } = useQuery({
    queryKey: ["pending-completion", filters],
    queryFn: () => serviceRequestsApi.getPendingCompletion(filters),
  })

  const serviceRequests = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Onay Bekleyen Talepler</h1>
        <p className="text-muted-foreground mt-2">
          Provider tarafından tamamlandı işaretlenen ve customer onayı bekleyen talepler
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            showStatusFilter={false}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Onay Bekleyen Talepler ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8 text-muted-foreground">
              Yükleniyor...
            </div>
          ) : (
            <ServiceRequestListTable
              serviceRequests={serviceRequests}
              pagination={{
                page,
                limit,
                total,
                totalPages,
              }}
              onPageChange={(p) =>
                setFilters((prev) => ({ ...prev, offset: (p - 1) * limit }))
              }
              onSortChange={() => {}}
              onAction={() => {}}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
