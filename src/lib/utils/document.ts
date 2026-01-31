import { DOCUMENT_STATUS } from "@/lib/constants"
import type { BadgeProps } from "@/components/ui/badge"

export function getDocumentStatusBadgeVariant(
  status: string
): BadgeProps["variant"] {
  switch (status) {
    case DOCUMENT_STATUS.VERIFIED:
      return "success"
    case DOCUMENT_STATUS.PENDING:
      return "warning"
    case DOCUMENT_STATUS.REJECTED:
      return "destructive"
    default:
      return "outline"
  }
}

export function getDocumentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    [DOCUMENT_STATUS.PENDING]: "Onay Bekliyor",
    [DOCUMENT_STATUS.VERIFIED]: "Doğrulandı",
    [DOCUMENT_STATUS.REJECTED]: "Reddedildi",
  }
  return labels[status] || status
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
}
