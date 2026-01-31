import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProviderDetail } from "@/api/endpoints/providers"
import { formatDate, formatDateTime } from "@/lib/utils/status"

interface ProviderGeneralInfoProps {
  provider: ProviderDetail
}

export function ProviderGeneralInfo({ provider }: ProviderGeneralInfoProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Kişisel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Ad:</span>
            <p className="font-medium">{provider.firstName}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Soyad:</span>
            <p className="font-medium">{provider.lastName}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Email:</span>
            <p className="font-medium">{provider.email}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Telefon:</span>
            <p className="font-medium">{provider.phone}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adres Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {provider.address ? (
            <>
              <div>
                <span className="text-sm text-muted-foreground">Şehir:</span>
                <p className="font-medium">{provider.address.city}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">İlçe:</span>
                <p className="font-medium">{provider.address.district}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Adres:</span>
                <p className="font-medium">{provider.address.addressLine}</p>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">Adres bilgisi bulunmuyor</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Durum Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Durum:</span>
            <p className="font-medium">{provider.status}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Skor:</span>
            <p className="font-medium">{provider.score.toFixed(1)}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">
              Toplam Hizmet:
            </span>
            <p className="font-medium">{provider.totalServices}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">
              Ortalama Puan:
            </span>
            <p className="font-medium">
              {provider.averageRating > 0
                ? provider.averageRating.toFixed(1)
                : "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tarih Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Kayıt Tarihi:</span>
            <p className="font-medium">{formatDateTime(provider.createdAt)}</p>
          </div>
          {provider.approvedAt && (
            <div>
              <span className="text-sm text-muted-foreground">Onay Tarihi:</span>
              <p className="font-medium">
                {formatDateTime(provider.approvedAt)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
