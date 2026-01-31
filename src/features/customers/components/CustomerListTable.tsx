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
import type { Customer } from "@/api/endpoints/customers"
import { formatDate } from "@/lib/utils/status"
import { Eye, CheckCircle, XCircle } from "lucide-react"
import { CustomerActionsMenu } from "./CustomerActionsMenu"

interface CustomerListTableProps {
  customers: Customer[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void
  onCustomerAction: () => void
}

export function CustomerListTable({
  customers = [],
  pagination,
  onPageChange,
  onSortChange: _onSortChange,
  onCustomerAction,
}: CustomerListTableProps) {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Doğrulama</TableHead>
              <TableHead>Toplam Hizmet</TableHead>
              <TableHead>Ortalama Puan</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!customers || customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="text-muted-foreground">
                    Müşteri bulunamadı
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-mono text-xs">
                    {customer.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    {customer.emailVerified && customer.phoneVerified ? (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Doğrulandı
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Doğrulanmadı
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{customer.totalServices}</TableCell>
                  <TableCell>
                    {customer.averageRating != null && Number(customer.averageRating) > 0
                      ? Number(customer.averageRating).toFixed(1)
                      : "-"}
                  </TableCell>
                  <TableCell>{formatDate(customer.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/customers/${customer.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <CustomerActionsMenu
                        customer={customer}
                        onAction={onCustomerAction}
                      />
                    </div>
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
