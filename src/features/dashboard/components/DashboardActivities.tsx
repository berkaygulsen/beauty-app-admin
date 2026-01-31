import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "../hooks/useDashboard"
import { formatDateTime } from "@/lib/utils/status"
import { Activity } from "lucide-react"

export function DashboardActivities() {
  const { activities, isLoadingActivities } = useDashboard()

  if (isLoadingActivities) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Yükleniyor...</div>
        </CardContent>
      </Card>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Henüz aktivite yok</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Aktiviteler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id || `activity-${index}`}
              className="flex items-start gap-4 border-b pb-4 last:border-0"
            >
              <div className="rounded-full bg-primary/10 p-2">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {formatDateTime(activity.createdAt || activity.timestamp)}
                  </span>
                  {activity.user && (
                    <>
                      <span>•</span>
                      <span>
                        {activity.user.name} ({activity.user.email})
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
