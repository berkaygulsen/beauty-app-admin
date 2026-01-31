import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { paymentsApi } from "@/api/endpoints/payments"
import { PaymentDetailContent } from "../components/PaymentDetailContent"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: payment, isLoading, error } = useQuery({
    queryKey: ["payment", id],
    queryFn: () => paymentsApi.getPayment(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !payment) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/payments")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Ödeme bulunamadı veya bir hata oluştu.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/payments")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Ödeme #{payment.id.slice(0, 8)}
            </h1>
            <p className="text-muted-foreground">{payment.providerName ?? (payment.provider ? `${payment.provider.firstName ?? ""} ${payment.provider.lastName ?? ""}`.trim() : payment.providerId)}</p>
          </div>
        </div>
      </div>

      <PaymentDetailContent payment={payment} />
    </div>
  )
}
