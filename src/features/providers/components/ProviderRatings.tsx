import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProviderDetail } from "@/api/endpoints/providers"
import { formatDateTime } from "@/lib/utils/status"

interface ProviderRatingsProps {
  provider: ProviderDetail
}

export function ProviderRatings({ provider }: ProviderRatingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Puanlama Geçmişi</CardTitle>
      </CardHeader>
      <CardContent>
        {provider.ratingHistory && provider.ratingHistory.length > 0 ? (
          <div className="space-y-4">
            {provider.ratingHistory.map((rating) => (
              <div
                key={rating.id}
                className="border-b pb-4 last:border-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{rating.score}</span>
                    <span className="text-muted-foreground">/ 5.0</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDateTime(rating.createdAt)}
                  </span>
                </div>
                {rating.comment && (
                  <p className="text-sm text-muted-foreground">
                    {rating.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Henüz değerlendirme yok</p>
        )}
      </CardContent>
    </Card>
  )
}
