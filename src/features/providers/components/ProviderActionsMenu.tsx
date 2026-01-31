import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { providersApi, type Provider } from "@/api/endpoints/providers"
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
import { MoreVertical, Check, X, Ban } from "lucide-react"
import toast from "react-hot-toast"

interface ProviderActionsMenuProps {
  provider: Provider
  onAction: () => void
}

export function ProviderActionsMenu({
  provider,
  onAction,
}: ProviderActionsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [actionDialog, setActionDialog] = useState<
    "approve" | "reject" | "suspend" | null
  >(null)
  const [reason, setReason] = useState("")
  const queryClient = useQueryClient()

  const approveMutation = useMutation({
    mutationFn: () => providersApi.approveProvider(provider.id),
    onSuccess: () => {
      toast.success("Provider onaylandı")
      queryClient.invalidateQueries({ queryKey: ["providers"] })
      onAction()
      setActionDialog(null)
      setReason("")
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Onaylama işlemi başarısız oldu"
      )
    },
  })

  const rejectMutation = useMutation({
    mutationFn: () =>
      providersApi.rejectProvider(provider.id, { reason }),
    onSuccess: () => {
      toast.success("Provider reddedildi")
      queryClient.invalidateQueries({ queryKey: ["providers"] })
      onAction()
      setActionDialog(null)
      setReason("")
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Reddetme işlemi başarısız oldu"
      )
    },
  })

  const suspendMutation = useMutation({
    mutationFn: () =>
      providersApi.suspendProvider(provider.id, { reason }),
    onSuccess: () => {
      toast.success("Provider askıya alındı")
      queryClient.invalidateQueries({ queryKey: ["providers"] })
      onAction()
      setActionDialog(null)
      setReason("")
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Askıya alma işlemi başarısız oldu"
      )
    },
  })

  const handleApprove = () => {
    if (provider.status === "PENDING" || provider.status === "UNDER_REVIEW") {
      approveMutation.mutate()
    }
  }

  const handleReject = () => {
    if (!reason.trim()) {
      toast.error("Lütfen red sebebi giriniz")
      return
    }
    rejectMutation.mutate()
  }

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
              {(provider.status === "PENDING" ||
                provider.status === "UNDER_REVIEW") && (
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  onClick={() => {
                    setActionDialog("approve")
                    setMenuOpen(false)
                  }}
                >
                  <Check className="h-4 w-4" />
                  Onayla
                </button>
              )}
              {provider.status !== "REJECTED" && (
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  onClick={() => {
                    setActionDialog("reject")
                    setMenuOpen(false)
                  }}
                >
                  <X className="h-4 w-4" />
                  Reddet
                </button>
              )}
              {provider.status !== "SUSPENDED" && (
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  onClick={() => {
                    setActionDialog("suspend")
                    setMenuOpen(false)
                  }}
                >
                  <Ban className="h-4 w-4" />
                  Askıya Al
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Approve Dialog */}
      <Dialog
        open={actionDialog === "approve"}
        onOpenChange={(open) => !open && setActionDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provider Onayla</DialogTitle>
            <DialogDescription>
              {provider.firstName} {provider.lastName} adlı provider'ı onaylamak
              istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog(null)}
              disabled={approveMutation.isPending}
            >
              İptal
            </Button>
            <Button
              onClick={handleApprove}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? "Onaylanıyor..." : "Onayla"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={actionDialog === "reject"}
        onOpenChange={(open) => !open && setActionDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provider Reddet</DialogTitle>
            <DialogDescription>
              {provider.firstName} {provider.lastName} adlı provider'ı reddetmek
              için sebep giriniz.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Red Sebebi *</Label>
            <Input
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Red sebebini giriniz"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialog(null)
                setReason("")
              }}
              disabled={rejectMutation.isPending}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectMutation.isPending || !reason.trim()}
            >
              {rejectMutation.isPending ? "Reddediliyor..." : "Reddet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog
        open={actionDialog === "suspend"}
        onOpenChange={(open) => !open && setActionDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provider Askıya Al</DialogTitle>
            <DialogDescription>
              {provider.firstName} {provider.lastName} adlı provider'ı askıya
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
                setActionDialog(null)
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
