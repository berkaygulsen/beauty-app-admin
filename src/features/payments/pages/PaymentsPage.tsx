import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { paymentsApi, type PaymentFilters } from "@/api/endpoints/payments"
import { PaymentListTable } from "../components/PaymentListTable"
import { PaymentFilters as Filters } from "../components/PaymentFilters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentsPage() {
  const [filters, setFilters] = useState<PaymentFilters>({
    limit: 10,
    offset: 0,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["payments", filters],
    queryFn: () => paymentsApi.getPayments(filters),
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
        <h1 className="text-3xl font-bold tracking-tight">Provider Ödemeleri</h1>
        <p className="text-muted-foreground">
          Provider ödemelerini görüntüleyin ve yönetin
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
            Ödeme Listesi
            {data && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({data.total} kayıt)
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
            <PaymentListTable
              payments={data.data || []}
              pagination={{
                page: currentPage,
                limit: filters.limit || 10,
                total: data.total || 0,
                totalPages,
              }}
              onPageChange={handlePageChange}
              onAction={refetch}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
