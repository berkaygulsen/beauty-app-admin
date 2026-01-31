import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { settingsApi } from "@/api/endpoints/settings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDateTime } from "@/lib/utils/status"
import { Search } from "lucide-react"

export default function CancellationHistoryPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: ["cancellations", page, search],
    queryFn: () =>
      settingsApi.getCancellations({
        limit,
        offset: (page - 1) * limit,
      }),
  })

  const cancellations = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">İptal Geçmişi</h1>
        <p className="text-muted-foreground mt-2">
          Tüm hizmet iptallerini ve uygulanan cezaları görüntüleyin
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>İptal Edilen Talepler</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ara..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : cancellations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              İptal kaydı bulunamadı
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Talep ID</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Hizmet</TableHead>
                    <TableHead>İptal Eden</TableHead>
                    <TableHead>Sebep</TableHead>
                    <TableHead>Ceza Tutarı</TableHead>
                    <TableHead>İade Tutarı</TableHead>
                    <TableHead>İptal Tarihi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cancellations.map((cancellation) => (
                    <TableRow key={cancellation.id}>
                      <TableCell className="font-mono text-sm">
                        {cancellation.serviceRequestId.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {cancellation.serviceRequest.provider.firstName}{" "}
                        {cancellation.serviceRequest.provider.lastName}
                      </TableCell>
                      <TableCell>
                        {cancellation.serviceRequest.customer.firstName}{" "}
                        {cancellation.serviceRequest.customer.lastName}
                      </TableCell>
                      <TableCell>
                        {cancellation.serviceRequest.service.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cancellation.cancelledBy === "CUSTOMER"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {cancellation.cancelledBy === "CUSTOMER"
                            ? "Müşteri"
                            : "Provider"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {cancellation.reason}
                      </TableCell>
                      <TableCell>
                        {cancellation.penaltyAmount
                          ? formatCurrency(cancellation.penaltyAmount)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {cancellation.refundAmount
                          ? formatCurrency(cancellation.refundAmount)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(cancellation.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Toplam {total} kayıt
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Önceki
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        Sayfa {page} / {totalPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      Sonraki
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
