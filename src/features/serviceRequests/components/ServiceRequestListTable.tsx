import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ServiceRequest } from "@/api/endpoints/serviceRequests"
import { formatCurrency, formatDate } from "@/lib/utils/status"
import {
  getServiceRequestStatusBadgeVariant,
  getServiceRequestStatusLabel,
} from "@/lib/utils/serviceRequest"
import { Eye } from "lucide-react"

interface ServiceRequestListTableProps {
  serviceRequests: ServiceRequest[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void
  onAction: () => void
}

export function ServiceRequestListTable({
  serviceRequests,
  pagination,
  onPageChange,
  onSortChange: _onSortChange,
  onAction: _onAction,
}: ServiceRequestListTableProps) {
  const navigate = useNavigate()
  const list = serviceRequests ?? []

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Hizmet</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Talep Tarihi</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Komisyon</TableHead>
              <TableHead>Net Tutar</TableHead>
              <TableHead>Oluşturulma</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8">
                  <div className="text-muted-foreground">
                    Hizmet talebi bulunamadı
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              list.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-xs">
                    {request.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-primary hover:underline"
                      onClick={() =>
                        navigate(`/providers/${request.providerId}`)
                      }
                    >
                      {request.provider ? `${request.provider.firstName} ${request.provider.lastName}` : request.providerId}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-primary hover:underline"
                      onClick={() =>
                        navigate(`/customers/${request.customerId}`)
                      }
                    >
                      {request.customer ? `${request.customer.firstName} ${request.customer.lastName}` : request.customerId}
                    </button>
                  </TableCell>
                  <TableCell>{request.service?.name ?? "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getServiceRequestStatusBadgeVariant(
                        request.status
                      )}
                    >
                      {getServiceRequestStatusLabel(request.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(request.requestedDate)} {request.requestedTime}
                  </TableCell>
                  <TableCell>{formatCurrency(request.price)}</TableCell>
                  <TableCell>{formatCurrency(request.commission)}</TableCell>
                  <TableCell>{formatCurrency(request.netAmount)}</TableCell>
                  <TableCell>{formatDate(request.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate(`/service-requests/${request.id}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Sayfa {pagination.page} / {pagination.totalPages} (Toplam:{" "}
            {pagination.total})
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
