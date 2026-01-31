import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProviderDetail } from "@/api/endpoints/providers"
import { formatDateTime } from "@/lib/utils/status"
import { Activity } from "lucide-react"

interface ProviderActivityLogProps {
  provider: ProviderDetail
}

export function ProviderActivityLog({ provider }: ProviderActivityLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivite Logu</CardTitle>
      </CardHeader>
      <CardContent>
        {provider.activityLog && provider.activityLog.length > 0 ? (
          <div className="space-y-4">
            {provider.activityLog.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 border-b pb-4 last:border-0"
              >
                <div className="rounded-full bg-primary/10 p-2">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Henüz aktivite kaydı yok</p>
        )}
      </CardContent>
    </Card>
  )
}
