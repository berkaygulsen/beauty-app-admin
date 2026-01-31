import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CustomerDetail } from "@/api/endpoints/customers"
import { formatDateTime } from "@/lib/utils/status"
import { CheckCircle, XCircle } from "lucide-react"

interface CustomerGeneralInfoProps {
  customer: CustomerDetail
}

export function CustomerGeneralInfo({ customer }: CustomerGeneralInfoProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Kişisel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Ad:</span>
            <p className="font-medium">{customer.firstName}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Soyad:</span>
            <p className="font-medium">{customer.lastName}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Email:</span>
            <p className="font-medium">{customer.email}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Telefon:</span>
            <p className="font-medium">{customer.phone}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">
              Doğrulama Durumu:
            </span>
            <div className="mt-1">
              {customer.isVerified ? (
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
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>İstatistikler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">
              Toplam Hizmet:
            </span>
            <p className="font-medium">{customer.totalServices}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">
              Ortalama Puan:
            </span>
            <p className="font-medium">
              {customer.averageRating > 0
                ? customer.averageRating.toFixed(1)
                : "-"}
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Kayıt Tarihi:</span>
            <p className="font-medium">{formatDateTime(customer.createdAt)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
