import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { serviceRequestsApi } from "@/api/endpoints/serviceRequests"
import { ServiceRequestDetailContent } from "../components/ServiceRequestDetailContent"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ServiceRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: serviceRequest, isLoading, error } = useQuery({
    queryKey: ["service-request", id],
    queryFn: async () => {
      const request = await serviceRequestsApi.getServiceRequest(id!)
      const statusHistory = await serviceRequestsApi.getStatusHistory(id!)
      return {
        ...request,
        statusHistory: statusHistory.map((h) => ({
          id: h.id,
          status: h.newStatus,
          changedAt: h.createdAt,
          changedBy: h.changedBy,
          reason: h.reason,
        })),
      }
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !serviceRequest) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/service-requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Hizmet talebi bulunamadı veya bir hata oluştu.
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
          <Button
            variant="ghost"
            onClick={() => navigate("/service-requests")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Hizmet Talebi #{serviceRequest.id.slice(0, 8)}
            </h1>
            <p className="text-muted-foreground">{serviceRequest.service?.name ?? "-"}</p>
          </div>
        </div>
      </div>

      <ServiceRequestDetailContent serviceRequest={serviceRequest} />
    </div>
  )
}
