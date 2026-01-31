import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { serviceRequestsApi } from "@/api/endpoints/serviceRequests"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceRequestListTable } from "../components/ServiceRequestListTable"
import { ServiceRequestFilters } from "../components/ServiceRequestFilters"
import { formatCurrency, formatDate } from "@/lib/utils/status"

export default function PendingCompletionPage() {
  const [filters, setFilters] = useState({
    providerId: undefined as string | undefined,
    customerId: undefined as string | undefined,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  })
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: ["pending-completion", filters, page],
    queryFn: () =>
      serviceRequestsApi.getPendingCompletion({
        ...filters,
        limit,
        offset: (page - 1) * limit,
      }),
  })

  const serviceRequests = data?.data || []
  const total = data?.total || 0

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
          <ServiceRequestFilters
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
          <ServiceRequestListTable
            serviceRequests={serviceRequests}
            pagination={{
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit),
            }}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
