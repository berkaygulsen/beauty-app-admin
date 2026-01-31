import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CustomerDetail } from "@/api/endpoints/customers"
import { formatDateTime } from "@/lib/utils/status"

interface CustomerReviewsProps {
  customer: CustomerDetail
}

export function CustomerReviews({ customer }: CustomerReviewsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Değerlendirmeler</CardTitle>
      </CardHeader>
      <CardContent>
        {customer.reviews && customer.reviews.length > 0 ? (
          <div className="space-y-4">
            {customer.reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{review.rating}</span>
                    <span className="text-muted-foreground">/ 5.0</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDateTime(review.createdAt)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground">
                    {review.comment}
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
