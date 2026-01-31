import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { customersApi, type Customer, type CustomerFilters } from "@/api/endpoints/customers"
import type { PaginatedResponse } from "@/types"
import { CustomerListTable } from "../components/CustomerListTable"
import { CustomerFilters as Filters } from "../components/CustomerFilters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableLoading, ErrorState, EmptyTableState } from "@/components/ui"

export default function CustomersPage() {
  const [filters, setFilters] = useState<CustomerFilters>({
    limit: 10,
    offset: 0,
  })

  const { data, isLoading, error, refetch } = useQuery<
    PaginatedResponse<Customer>,
    Error,
    PaginatedResponse<Customer>,
    (string | CustomerFilters)[]
  >({
    queryKey: ["customers", filters],
    queryFn: () => customersApi.getCustomers(filters),
  })

  const handlePageChange = (page: number) => {
    const limit = filters.limit || 10
    setFilters((prev) => ({ ...prev, offset: (page - 1) * limit }))
  }

  const currentPage = filters.offset ? Math.floor((filters.offset || 0) / (filters.limit || 10)) + 1 : 1
  const totalPages = data?.total ? Math.ceil(data.total / (filters.limit || 10)) : 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Müşteriler</h1>
        <p className="text-muted-foreground">
          Müşterileri görüntüleyin ve yönetin
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
            Müşteri Listesi
            {data && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({data.total} kayıt)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableLoading />
          ) : error ? (
            <ErrorState
              title="Müşteriler yüklenirken hata oluştu"
              message={
                error instanceof Error
                  ? error.message
                  : String(error)
              }
              onRetry={() => refetch()}
            />
          ) : data && data.data && data.data.length > 0 ? (
            <CustomerListTable
              customers={data.data}
              pagination={{
                page: currentPage,
                limit: filters.limit || 10,
                total: data.total || 0,
                totalPages,
              }}
              onPageChange={handlePageChange}
              onSortChange={(_sortBy, _sortOrder) => {
                // Note: API doesn't support sortBy/sortOrder, but keeping for UI compatibility
                setFilters((prev) => ({ ...prev }))
              }}
              onCustomerAction={refetch}
            />
          ) : (
            <EmptyTableState message="Henüz müşteri kaydı bulunmuyor." />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
