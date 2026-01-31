import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { documentsApi, type Document } from "@/api/endpoints/documents"
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
import { MoreVertical, CheckCircle, XCircle } from "lucide-react"
import toast from "react-hot-toast"
import type { AxiosError } from "axios"
import { DOCUMENT_STATUS } from "@/lib/constants"

interface DocumentActionsMenuProps {
  document: Document
  onAction: () => void
}

export function DocumentActionsMenu({
  document,
  onAction,
}: DocumentActionsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [reason, setReason] = useState("")
  const queryClient = useQueryClient()

  const approveMutation = useMutation({
    mutationFn: () => documentsApi.approveDocument(document.id),
    onSuccess: () => {
      toast.success("Doküman onaylandı")
      queryClient.invalidateQueries({ queryKey: ["documents"] })
      onAction()
      setApproveDialogOpen(false)
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message || "Onaylama işlemi başarısız oldu"
      )
    },
  })

  const rejectMutation = useMutation({
    mutationFn: () =>
      documentsApi.rejectDocument(document.id, { reason }),
    onSuccess: () => {
      toast.success("Doküman reddedildi")
      queryClient.invalidateQueries({ queryKey: ["documents"] })
      onAction()
      setRejectDialogOpen(false)
      setReason("")
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message || "Reddetme işlemi başarısız oldu"
      )
    },
  })

  const handleReject = () => {
    if (!reason.trim()) {
      toast.error("Lütfen red sebebi giriniz")
      return
    }
    rejectMutation.mutate()
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
              {document.status === DOCUMENT_STATUS.PENDING && (
                <>
                  <button
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => {
                      setApproveDialogOpen(true)
                      setMenuOpen(false)
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Onayla
                  </button>
                  <button
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => {
                      setRejectDialogOpen(true)
                      setMenuOpen(false)
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                    Reddet
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Doküman Onayla</DialogTitle>
            <DialogDescription>
              Bu dokümanı onaylamak istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
              disabled={approveMutation.isPending}
            >
              İptal
            </Button>
            <Button
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? "Onaylanıyor..." : "Onayla"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Doküman Reddet</DialogTitle>
            <DialogDescription>
              Bu dokümanı reddetmek için sebep giriniz
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
                setRejectDialogOpen(false)
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
    </>
  )
}
