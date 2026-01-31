import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { customersApi, type Customer } from "@/api/endpoints/customers"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AxiosError } from "axios"
import { MoreVertical, Ban } from "lucide-react"
import toast from "react-hot-toast"

interface CustomerActionsMenuProps {
  customer: Customer
  onAction: () => void
}

export function CustomerActionsMenu({
  customer,
  onAction,
}: CustomerActionsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [reason, setReason] = useState("")
  const queryClient = useQueryClient()

  const suspendMutation = useMutation({
    mutationFn: () =>
      customersApi.suspendCustomer(customer.id, { reason }),
    onSuccess: () => {
      toast.success("Müşteri askıya alındı")
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      onAction()
      setSuspendDialogOpen(false)
      setReason("")
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message || "Askıya alma işlemi başarısız oldu"
      )
    },
  })

  const unsuspendMutation = useMutation({
    mutationFn: () => customersApi.unsuspendCustomer(customer.id),
    onSuccess: () => {
      toast.success("Müşteri askıdan kaldırıldı")
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      onAction()
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message ||
          "Askıdan kaldırma işlemi başarısız oldu"
      )
    },
  })

  const handleSuspend = () => {
    if (!reason.trim()) {
      toast.error("Lütfen askıya alma sebebi giriniz")
      return
    }
    suspendMutation.mutate()
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
              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                onClick={() => {
                  setSuspendDialogOpen(true)
                  setMenuOpen(false)
                }}
              >
                <Ban className="h-4 w-4" />
                Askıya Al
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                onClick={() => {
                  unsuspendMutation.mutate()
                  setMenuOpen(false)
                }}
                disabled={unsuspendMutation.isPending}
              >
                Askıdan Kaldır
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Müşteri Askıya Al</DialogTitle>
            <DialogDescription>
              {customer.firstName} {customer.lastName} adlı müşteriyi askıya
              almak için sebep giriniz.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="suspend-reason">Askıya Alma Sebebi *</Label>
            <Input
              id="suspend-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Askıya alma sebebini giriniz"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSuspendDialogOpen(false)
                setReason("")
              }}
              disabled={suspendMutation.isPending}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleSuspend}
              disabled={suspendMutation.isPending || !reason.trim()}
            >
              {suspendMutation.isPending ? "Askıya Alınıyor..." : "Askıya Al"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
