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
import type { Payment } from "@/api/endpoints/payments"
import { formatCurrency, formatDate } from "@/lib/utils/status"
import {
  getPaymentStatusBadgeVariant,
  getPaymentStatusLabel,
} from "@/lib/utils/payment"
import { Eye } from "lucide-react"
import { PaymentActionsMenu } from "./PaymentActionsMenu"

interface PaymentListTableProps {
  payments: Payment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onAction: () => void
}

export function PaymentListTable({
  payments = [],
  pagination,
  onPageChange,
  onAction,
}: PaymentListTableProps) {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Toplam Tutar</TableHead>
              <TableHead>Komisyon</TableHead>
              <TableHead>Net Tutar</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Ödeme Tarihi</TableHead>
              <TableHead>İşlem Tarihi</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!payments || payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="text-muted-foreground">Ödeme bulunamadı</div>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs">
                    {payment.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-primary hover:underline"
                      onClick={() =>
                        navigate(`/providers/${payment.providerId}`)
                      }
                    >
                      {payment.provider?.firstName && payment.provider?.lastName
                        ? `${payment.provider.firstName} ${payment.provider.lastName}`
                        : payment.providerId.slice(0, 8)}
                    </button>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>{formatCurrency(payment.commission)}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(payment.netAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getPaymentStatusBadgeVariant(payment.paymentStatus)}
                    >
                      {getPaymentStatusLabel(payment.paymentStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                  <TableCell>
                    {payment.processedDate ? formatDate(payment.processedDate) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/payments/${payment.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <PaymentActionsMenu
                        payment={payment}
                        onAction={onAction}
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
