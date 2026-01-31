import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllowedTransitions, getServiceRequestStatusLabel } from "@/lib/utils/serviceRequest"
import { SERVICE_REQUEST_STATUS } from "@/lib/constants"
import { ArrowRight, CheckCircle, Circle, Clock } from "lucide-react"
import { formatDateTime } from "@/lib/utils/status"

interface ServiceRequestStateMachineProps {
  currentStatus: string
  statusHistory: Array<{
    id: string
    status: string
    changedAt: string
    changedBy?: string
    reason?: string
  }>
}

const STATUS_ORDER = [
  SERVICE_REQUEST_STATUS.CREATED,
  SERVICE_REQUEST_STATUS.ACCEPTED,
  SERVICE_REQUEST_STATUS.PAYMENT_RECEIVED,
  SERVICE_REQUEST_STATUS.COMPLETED,
]

export function ServiceRequestStateMachine({
  currentStatus,
  statusHistory,
}: ServiceRequestStateMachineProps) {
  const allowedTransitions = getAllowedTransitions(currentStatus)
  const completedStatuses = statusHistory.map((h) => h.status)
  const statusHistoryMap = new Map(
    statusHistory.map((h) => [h.status, h])
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Durum Akışı</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_ORDER.map((status, index) => {
            const isCompleted = completedStatuses.includes(status)
            const isCurrent = status === currentStatus
            const isAllowed = allowedTransitions.includes(status)
            const history = statusHistoryMap.get(status)

            return (
              <div key={status} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1 relative group">
                  {isCompleted || isCurrent ? (
                    <CheckCircle
                      className={`h-6 w-6 ${
                        isCurrent ? "text-primary" : "text-green-500"
                      }`}
                    />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                  <Badge
                    variant={
                      isCurrent
                        ? "default"
                        : isCompleted
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs cursor-pointer"
                    title={
                      history
                        ? `${getServiceRequestStatusLabel(status)} - ${formatDateTime(history.changedAt)}`
                        : getServiceRequestStatusLabel(status)
                    }
                  >
                    {getServiceRequestStatusLabel(status)}
                  </Badge>
                  {history && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block z-10 bg-popover border rounded-md p-2 shadow-md text-xs min-w-[200px]">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">
                          {formatDateTime(history.changedAt)}
                        </span>
                      </div>
                      {history.changedBy && (
                        <div className="text-muted-foreground">
                          Değiştiren: {history.changedBy}
                        </div>
                      )}
                      {history.reason && (
                        <div className="text-muted-foreground mt-1">
                          Sebep: {history.reason}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {index < STATUS_ORDER.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            )
          })}
        </div>
        {allowedTransitions.length > 0 && (
          <div className="mt-4 text-xs text-muted-foreground">
            İzin verilen geçişler:{" "}
            {allowedTransitions
              .map((s) => getServiceRequestStatusLabel(s))
              .join(", ")}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
