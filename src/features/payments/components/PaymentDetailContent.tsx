import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { PaymentDetail } from "@/api/endpoints/payments"
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils/status"
import {
  getPaymentStatusBadgeVariant,
  getPaymentStatusLabel,
} from "@/lib/utils/payment"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download } from "lucide-react"
import toast from "react-hot-toast"

interface PaymentDetailContentProps {
  payment: PaymentDetail
}

export function PaymentDetailContent({
  payment,
}: PaymentDetailContentProps) {
  const navigate = useNavigate()

  const handleDownloadInvoice = async () => {
    try {
      const { paymentsApi } = await import("@/api/endpoints/payments")
      const blob = await paymentsApi.getInvoice(payment.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${payment.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Fatura indirildi")
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(
        err.response?.data?.message || "Fatura indirme başarısız oldu"
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ödeme Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Durum:</span>
              <div className="mt-1">
                <Badge
                  variant={getPaymentStatusBadgeVariant(payment.status)}
                  className="text-lg px-4 py-2"
                >
                  {getPaymentStatusLabel(payment.status)}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Provider:</span>
              <p className="font-medium">
                <button
                  className="text-primary hover:underline"
                  onClick={() => navigate(`/providers/${payment.providerId}`)}
                >
                  {payment.providerName}
                </button>
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                Ödeme Tarihi:
              </span>
              <p className="font-medium">{formatDate(payment.paymentDate)}</p>
            </div>
            {payment.processedAt && (
              <div>
                <span className="text-sm text-muted-foreground">
                  İşlem Tarihi:
                </span>
                <p className="font-medium">
                  {formatDateTime(payment.processedAt)}
                </p>
              </div>
            )}
            {payment.paymentMethod && (
              <div>
                <span className="text-sm text-muted-foreground">
                  Ödeme Yöntemi:
                </span>
                <p className="font-medium">{payment.paymentMethod}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tutar Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">
                Toplam Tutar:
              </span>
              <p className="text-2xl font-bold">
                {formatCurrency(payment.totalAmount)}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Komisyon:</span>
              <p className="font-medium">{formatCurrency(payment.commission)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Net Tutar:</span>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(payment.netAmount)}
              </p>
            </div>
            {payment.invoice && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={handleDownloadInvoice}
                  className="w-full gap-2"
                >
                  <Download className="h-4 w-4" />
                  Fatura İndir
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Service Requests */}
      {payment.serviceRequests && payment.serviceRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>İlgili Hizmet Talepleri</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hizmet Talebi ID</TableHead>
                  <TableHead>Hizmet</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Komisyon</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payment.serviceRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-mono text-xs">
                      <button
                        className="text-primary hover:underline"
                        onClick={() =>
                          navigate(`/service-requests/${request.id}`)
                        }
                      >
                        {request.id.slice(0, 8)}...
                      </button>
                    </TableCell>
                    <TableCell>{request.serviceName}</TableCell>
                    <TableCell>{formatCurrency(request.amount)}</TableCell>
                    <TableCell>{formatCurrency(request.commission)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Invoice Info */}
      {payment.invoice && (
        <Card>
          <CardHeader>
            <CardTitle>Fatura Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">
                Fatura Numarası:
              </span>
              <p className="font-medium">{payment.invoice.invoiceNumber}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                Oluşturulma Tarihi:
              </span>
              <p className="font-medium">
                {formatDateTime(payment.invoice.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
