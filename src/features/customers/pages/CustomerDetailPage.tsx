import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { customersApi } from "@/api/endpoints/customers"
import { CustomerDetailTabs } from "../components/CustomerDetailTabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: customer, isLoading, error } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customersApi.getCustomer(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/customers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Müşteri bulunamadı veya bir hata oluştu.
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
          <Button variant="ghost" onClick={() => navigate("/customers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-muted-foreground">{customer.email}</p>
          </div>
        </div>
      </div>

      <CustomerDetailTabs customer={customer} />
    </div>
  )
}
