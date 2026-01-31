import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { paymentsApi, type Payment } from "@/api/endpoints/payments"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreVertical, CheckCircle, XCircle, Download } from "lucide-react"
import toast from "react-hot-toast"
import { PAYMENT_STATUS } from "@/lib/constants"

interface PaymentActionsMenuProps {
  payment: Payment
  onAction: () => void
}

export function PaymentActionsMenu({
  payment,
  onAction,
}: PaymentActionsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [processDialogOpen, setProcessDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const processMutation = useMutation({
    mutationFn: () => paymentsApi.processPayment(payment.id),
    onSuccess: () => {
      toast.success("Ödeme işlendi")
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      onAction()
      setProcessDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Ödeme işleme başarısız oldu"
      )
    },
  })

  const cancelMutation = useMutation({
    mutationFn: () => paymentsApi.cancelPayment(payment.id),
    onSuccess: () => {
      toast.success("Ödeme iptal edildi")
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      onAction()
      setCancelDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "İptal işlemi başarısız oldu"
      )
    },
  })

  const handleDownloadInvoice = async () => {
    try {
      const blob = await paymentsApi.getInvoice(payment.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${payment.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Fatura indirildi")
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Fatura indirme başarısız oldu"
      )
    }
  }

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
        {menuOpen && (
          <div className="absolute right-0 top-10 z-50 w-48 rounded-md border bg-background shadow-lg">
            <div className="p-1">
              {payment.status === PAYMENT_STATUS.PENDING && (
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  onClick={() => {
                    setProcessDialogOpen(true)
                    setMenuOpen(false)
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                  İşle
                </button>
              )}
              {payment.status !== PAYMENT_STATUS.COMPLETED &&
                payment.status !== PAYMENT_STATUS.FAILED && (
                  <button
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => {
                      setCancelDialogOpen(true)
                      setMenuOpen(false)
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                    İptal Et
                  </button>
                )}
              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                onClick={() => {
                  handleDownloadInvoice()
                  setMenuOpen(false)
                }}
              >
                <Download className="h-4 w-4" />
                Fatura İndir
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Process Dialog */}
      <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ödeme İşle</DialogTitle>
            <DialogDescription>
              Bu ödemeyi işlemek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProcessDialogOpen(false)}
              disabled={processMutation.isPending}
            >
              İptal
            </Button>
            <Button
              onClick={() => processMutation.mutate()}
              disabled={processMutation.isPending}
            >
              {processMutation.isPending ? "İşleniyor..." : "İşle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ödeme İptal Et</DialogTitle>
            <DialogDescription>
              Bu ödemeyi iptal etmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelMutation.isPending}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? "İptal Ediliyor..." : "İptal Et"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
