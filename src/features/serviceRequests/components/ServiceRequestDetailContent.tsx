import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { serviceRequestsApi } from "@/api/endpoints/serviceRequests"
import type { ServiceRequestDetail } from "@/api/endpoints/serviceRequests"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils/status"
import {
  getServiceRequestStatusBadgeVariant,
  getServiceRequestStatusLabel,
  getAllowedTransitions,
} from "@/lib/utils/serviceRequest"
import { ServiceRequestStateMachine } from "./ServiceRequestStateMachine"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { AxiosError } from "axios"
import { SERVICE_REQUEST_STATUS } from "@/lib/constants"
import toast from "react-hot-toast"

interface ServiceRequestDetailContentProps {
  serviceRequest: ServiceRequestDetail
}

export function ServiceRequestDetailContent({
  serviceRequest,
}: ServiceRequestDetailContentProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [reason, setReason] = useState("")

  const allowedTransitions = getAllowedTransitions(serviceRequest.status)

  const updateStatusMutation = useMutation({
    mutationFn: () =>
      serviceRequestsApi.updateStatus(serviceRequest.id, {
        status: newStatus,
        reason: reason || undefined,
      }),
    onSuccess: () => {
      toast.success("Durum güncellendi")
      queryClient.invalidateQueries({ queryKey: ["service-request"] })
      queryClient.invalidateQueries({ queryKey: ["service-requests"] })
      setStatusDialogOpen(false)
      setNewStatus("")
      setReason("")
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message || "Durum güncelleme başarısız oldu"
      )
    },
  })

  const cancelMutation = useMutation({
    mutationFn: () =>
      serviceRequestsApi.cancel(serviceRequest.id, { reason }),
    onSuccess: () => {
      toast.success("Talep iptal edildi")
      queryClient.invalidateQueries({ queryKey: ["service-request"] })
      queryClient.invalidateQueries({ queryKey: ["service-requests"] })
      setCancelDialogOpen(false)
      setReason("")
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message || "İptal işlemi başarısız oldu"
      )
    },
  })

  const completeMutation = useMutation({
    mutationFn: () => serviceRequestsApi.complete(serviceRequest.id),
    onSuccess: () => {
      toast.success("Talep tamamlandı")
      queryClient.invalidateQueries({ queryKey: ["service-request"] })
      queryClient.invalidateQueries({ queryKey: ["service-requests"] })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message || "Tamamlama işlemi başarısız oldu"
      )
    },
  })

  const handleStatusUpdate = () => {
    if (!newStatus) {
      toast.error("Lütfen yeni durum seçiniz")
      return
    }
    updateStatusMutation.mutate()
  }

  const handleCancel = () => {
    if (!reason.trim()) {
      toast.error("Lütfen iptal sebebi giriniz")
      return
    }
    cancelMutation.mutate()
  }

  return (
    <div className="space-y-6">
      {/* Status Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Durum Yönetimi</CardTitle>
            <div className="flex gap-2">
              {allowedTransitions.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewStatus(allowedTransitions[0])
                    setStatusDialogOpen(true)
                  }}
                >
                  Durum Değiştir
                </Button>
              )}
              {serviceRequest.status !== SERVICE_REQUEST_STATUS.CANCELLED &&
                serviceRequest.status !== SERVICE_REQUEST_STATUS.COMPLETED && (
                  <Button
                    variant="destructive"
                    onClick={() => setCancelDialogOpen(true)}
                  >
                    İptal Et
                  </Button>
                )}
              {serviceRequest.status ===
                SERVICE_REQUEST_STATUS.PAYMENT_RECEIVED && (
                <Button
                  onClick={() => completeMutation.mutate()}
                  disabled={completeMutation.isPending}
                >
                  {completeMutation.isPending
                    ? "Tamamlanıyor..."
                    : "Manuel Tamamla"}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge
              variant={getServiceRequestStatusBadgeVariant(serviceRequest.status)}
              className="text-lg px-4 py-2"
            >
              {getServiceRequestStatusLabel(serviceRequest.status)}
            </Badge>
            <ServiceRequestStateMachine
              currentStatus={serviceRequest.status}
              statusHistory={serviceRequest.statusHistory}
            />
          </div>
        </CardContent>
      </Card>

      {/* Request Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Talep Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Hizmet:</span>
              <p className="font-medium">{serviceRequest.serviceName}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                Talep Tarihi:
              </span>
              <p className="font-medium">
                {formatDate(serviceRequest.requestDate)}{" "}
                {serviceRequest.requestTime}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Fiyat:</span>
              <p className="font-medium">
                {formatCurrency(serviceRequest.price)}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Komisyon:</span>
              <p className="font-medium">
                {formatCurrency(serviceRequest.commission)}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Net Tutar:</span>
              <p className="font-medium">
                {formatCurrency(serviceRequest.netAmount)}
              </p>
            </div>
            {serviceRequest.notes && (
              <div>
                <span className="text-sm text-muted-foreground">Notlar:</span>
                <p className="font-medium">{serviceRequest.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>İlgili Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Provider:</span>
              <p className="font-medium">
                <button
                  className="text-primary hover:underline"
                  onClick={() =>
                    navigate(`/providers/${serviceRequest.providerId}`)
                  }
                >
                  {serviceRequest.providerName}
                </button>
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Customer:</span>
              <p className="font-medium">
                <button
                  className="text-primary hover:underline"
                  onClick={() =>
                    navigate(`/customers/${serviceRequest.customerId}`)
                  }
                >
                  {serviceRequest.customerName}
                </button>
              </p>
            </div>
            {serviceRequest.address && (
              <div>
                <span className="text-sm text-muted-foreground">Adres:</span>
                <p className="font-medium">
                  {serviceRequest.address.city} / {serviceRequest.address.district}
                </p>
                <p className="text-sm text-muted-foreground">
                  {serviceRequest.address.addressLine}
                </p>
              </div>
            )}
            <div>
              <span className="text-sm text-muted-foreground">
                Oluşturulma:
              </span>
              <p className="font-medium">
                {formatDateTime(serviceRequest.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Info */}
      {serviceRequest.payment && (
        <Card>
          <CardHeader>
            <CardTitle>Ödeme Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Tutar:</span>
              <p className="font-medium">
                {formatCurrency(serviceRequest.payment.amount)}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Durum:</span>
              <Badge variant="outline">{serviceRequest.payment.status}</Badge>
            </div>
            {serviceRequest.payment.paidAt && (
              <div>
                <span className="text-sm text-muted-foreground">
                  Ödeme Tarihi:
                </span>
                <p className="font-medium">
                  {formatDateTime(serviceRequest.payment.paidAt)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Review */}
      {serviceRequest.review && (
        <Card>
          <CardHeader>
            <CardTitle>Değerlendirme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Puan:</span>
              <p className="font-medium">{serviceRequest.review.rating} / 5.0</p>
            </div>
            {serviceRequest.review.comment && (
              <div>
                <span className="text-sm text-muted-foreground">Yorum:</span>
                <p className="font-medium">{serviceRequest.review.comment}</p>
              </div>
            )}
            <div>
              <span className="text-sm text-muted-foreground">Tarih:</span>
              <p className="font-medium">
                {formatDateTime(serviceRequest.review.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status History */}
      {serviceRequest.statusHistory && serviceRequest.statusHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Durum Geçmişi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceRequest.statusHistory.map((history, _index) => (
                <div
                  key={history.id}
                  className="flex items-start gap-4 border-b pb-4 last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{history.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDateTime(history.changedAt)}
                      </span>
                    </div>
                    {history.reason && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Sebep: {history.reason}
                      </p>
                    )}
                    {history.changedBy && (
                      <p className="text-sm text-muted-foreground">
                        Değiştiren: {history.changedBy}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Durum Değiştir</DialogTitle>
            <DialogDescription>
              Hizmet talebinin durumunu değiştirin
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-status">Yeni Durum *</Label>
              <Select
                id="new-status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">Seçiniz</option>
                {allowedTransitions.map((status) => (
                  <option key={status} value={status}>
                    {getServiceRequestStatusLabel(status)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Sebep (Opsiyonel)</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Durum değişikliği sebebi"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setStatusDialogOpen(false)
                setNewStatus("")
                setReason("")
              }}
              disabled={updateStatusMutation.isPending}
            >
              İptal
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={updateStatusMutation.isPending || !newStatus}
            >
              {updateStatusMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Talep İptal Et</DialogTitle>
            <DialogDescription>
              Bu talebi iptal etmek için sebep giriniz
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cancel-reason">İptal Sebebi *</Label>
            <Input
              id="cancel-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="İptal sebebini giriniz"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false)
                setReason("")
              }}
              disabled={cancelMutation.isPending}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelMutation.isPending || !reason.trim()}
            >
              {cancelMutation.isPending ? "İptal Ediliyor..." : "İptal Et"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
