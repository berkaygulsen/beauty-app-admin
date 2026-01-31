import { PROVIDER_STATUS } from "@/lib/constants"
import type { BadgeProps } from "@/components/ui/badge"

export function getProviderStatusBadgeVariant(
  status: string
): BadgeProps["variant"] {
  switch (status) {
    case PROVIDER_STATUS.APPROVED:
      return "success"
    case PROVIDER_STATUS.PENDING:
    case PROVIDER_STATUS.UNDER_REVIEW:
      return "warning"
    case PROVIDER_STATUS.REJECTED:
    case PROVIDER_STATUS.SUSPENDED:
      return "destructive"
    default:
      return "default"
  }
}

export function getProviderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    [PROVIDER_STATUS.PENDING]: "Onay Bekliyor",
    [PROVIDER_STATUS.UNDER_REVIEW]: "İncelemede",
    [PROVIDER_STATUS.APPROVED]: "Onaylandı",
    [PROVIDER_STATUS.REJECTED]: "Reddedildi",
    [PROVIDER_STATUS.SUSPENDED]: "Askıya Alındı",
  }
  return labels[status] || status
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(amount)
}

export function formatDate(date: string | null | undefined): string {
  if (!date) {
    return "Tarih bilgisi yok"
  }
  
  const dateObj = new Date(date)
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "Geçersiz tarih"
  }
  
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj)
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) {
    return "Tarih bilgisi yok"
  }
  
  const dateObj = new Date(date)
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "Geçersiz tarih"
  }
  
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj)
}
