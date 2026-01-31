import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { serviceRequestsApi } from "@/api/endpoints/serviceRequests"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency, formatDateTime } from "@/lib/utils/status"
import { Eye, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"

interface ServiceRequestDispute {
  id: string
  serviceRequestId: string
  raisedBy: string
  reason: string
  status: "PENDING" | "RESOLVED" | "REJECTED"
  resolution?: string | null
  refundAmount?: number | null
  resolvedAt?: string | null
  resolvedBy?: string | null
  createdAt: string
  updatedAt: string
  serviceRequest: unknown
}

export default function DisputedRequestsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [filters, _setFilters] = useState({
    status: undefined as string | undefined,
    raisedBy: undefined as string | undefined,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  })
  const [page, setPage] = useState(1)
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)
  const [selectedDispute, setSelectedDispute] = useState<ServiceRequestDispute | null>(null)
  const [resolution, setResolution] = useState("")
  const [refundAmount, setRefundAmount] = useState("")
  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: ["disputed-requests", filters, page],
    queryFn: () =>
      serviceRequestsApi.getDisputed({
        ...filters,
        limit,
        offset: (page - 1) * limit,
      }),
  })

  const resolveMutation = useMutation({
    mutationFn: (data: { id: string; resolution: string; refundAmount?: number }) =>
      serviceRequestsApi.resolveDispute(data.id, {
        resolution: data.resolution,
        refundAmount: data.refundAmount,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputed-requests"] })
      toast.success("İtiraz çözümlendi")
      setResolveDialogOpen(false)
      setSelectedDispute(null)
      setResolution("")
      setRefundAmount("")
    },
    onError: () => {
      toast.error("İtiraz çözümlenirken hata oluştu")
    },
  })

  const disputes = (data?.data as ServiceRequestDispute[]) || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  const handleResolveClick = (dispute: ServiceRequestDispute) => {
    setSelectedDispute(dispute)
    setResolveDialogOpen(true)
  }

  const handleResolve = () => {
    if (!selectedDispute) return
    resolveMutation.mutate({
      id: selectedDispute.serviceRequestId,
      resolution,
      refundAmount: refundAmount ? parseFloat(refundAmount) : undefined,
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">İtiraz Edilen Talepler</h1>
        <p className="text-muted-foreground mt-2">
          İtiraz edilen hizmet taleplerini görüntüleyin ve çözümleyin
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>İtirazlar ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : disputes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              İtiraz kaydı bulunamadı
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Talep ID</TableHead>
                    <TableHead>İtiraz Eden</TableHead>
                    <TableHead>Sebep</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İade Tutarı</TableHead>
                    <TableHead>Oluşturulma</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-mono text-sm">
                        {dispute.serviceRequestId.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            dispute.raisedBy === "CUSTOMER"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {dispute.raisedBy === "CUSTOMER"
                            ? "Müşteri"
                            : "Provider"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {dispute.reason}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            dispute.status === "PENDING"
                              ? "default"
                              : dispute.status === "RESOLVED"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {dispute.status === "PENDING"
                            ? "Bekliyor"
                            : dispute.status === "RESOLVED"
                            ? "Çözümlendi"
                            : "Reddedildi"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {dispute.refundAmount
                          ? formatCurrency(dispute.refundAmount)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(dispute.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate(
                                `/service-requests/${dispute.serviceRequestId}`
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {dispute.status === "PENDING" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleResolveClick(dispute)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Toplam {total} kayıt
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Önceki
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        Sayfa {page} / {totalPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      Sonraki
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İtiraz Çözümle</DialogTitle>
            <DialogDescription>
              İtirazı çözümleyin ve gerekirse iade tutarı belirleyin
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Çözüm Açıklaması</Label>
              <Input
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="İtiraz çözümü açıklaması..."
              />
            </div>
            <div>
              <Label>İade Tutarı (Opsiyonel)</Label>
              <Input
                type="number"
                min="0"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResolveDialogOpen(false)}
            >
              İptal
            </Button>
            <Button
              onClick={handleResolve}
              disabled={!resolution || resolveMutation.isPending}
            >
              {resolveMutation.isPending ? "Çözümleniyor..." : "Çözümle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
