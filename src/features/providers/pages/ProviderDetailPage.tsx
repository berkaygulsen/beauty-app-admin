import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { providersApi } from "@/api/endpoints/providers"
import { ProviderDetailTabs } from "../components/ProviderDetailTabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  getProviderStatusBadgeVariant,
  getProviderStatusLabel,
} from "@/lib/utils/status"

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: provider, isLoading, error } = useQuery({
    queryKey: ["provider", id],
    queryFn: () => providersApi.getProvider(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/providers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Provider bulunamadı veya bir hata oluştu.
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
          <Button variant="ghost" onClick={() => navigate("/providers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {provider.firstName} {provider.lastName}
            </h1>
            <p className="text-muted-foreground">{provider.email}</p>
          </div>
        </div>
        <Badge variant={getProviderStatusBadgeVariant(provider.status)}>
          {getProviderStatusLabel(provider.status)}
        </Badge>
      </div>

      <ProviderDetailTabs provider={provider} />
    </div>
  )
}
