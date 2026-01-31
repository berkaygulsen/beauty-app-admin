import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  documentsApi,
  type DocumentFilters,
} from "@/api/endpoints/documents"
import { DocumentListTable } from "../components/DocumentListTable"
import { DocumentFilters as Filters } from "../components/DocumentFilters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableLoading, ErrorState, EmptyTableState } from "@/components/ui"

export default function DocumentsPage() {
  const [filters, setFilters] = useState<DocumentFilters>({
    limit: 10,
    offset: 0,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["documents", filters],
    queryFn: () => documentsApi.getDocuments(filters),
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
        <h1 className="text-3xl font-bold tracking-tight">Dokümanlar</h1>
        <p className="text-muted-foreground">
          Dokümanları görüntüleyin ve yönetin
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
            Doküman Listesi
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
              title="Dokümanlar yüklenirken hata oluştu"
              message={
                error instanceof Error
                  ? error.message
                  : "Bir hata oluştu. Lütfen tekrar deneyin."
              }
              onRetry={() => refetch()}
            />
          ) : data && data.data && data.data.length > 0 ? (
            <DocumentListTable
              documents={data.data}
              pagination={{
                page: currentPage,
                limit: filters.limit || 10,
                total: data.total || 0,
                totalPages,
              }}
              onPageChange={handlePageChange}
              onAction={refetch}
            />
          ) : (
            <EmptyTableState message="Henüz doküman kaydı bulunmuyor." />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
