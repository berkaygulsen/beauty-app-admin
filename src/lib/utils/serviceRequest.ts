import { SERVICE_REQUEST_STATUS } from "@/lib/constants"
import type { BadgeProps } from "@/components/ui/badge"

export function getServiceRequestStatusBadgeVariant(
  status: string
): BadgeProps["variant"] {
  switch (status) {
    case SERVICE_REQUEST_STATUS.COMPLETED:
      return "success"
    case SERVICE_REQUEST_STATUS.ACCEPTED:
    case SERVICE_REQUEST_STATUS.PAYMENT_RECEIVED:
      return "default"
    case SERVICE_REQUEST_STATUS.CREATED:
      return "warning"
    case SERVICE_REQUEST_STATUS.CANCELLED:
    case SERVICE_REQUEST_STATUS.TIMEOUT:
      return "destructive"
    default:
      return "outline"
  }
}

export function getServiceRequestStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    [SERVICE_REQUEST_STATUS.CREATED]: "Oluşturuldu",
    [SERVICE_REQUEST_STATUS.ACCEPTED]: "Kabul Edildi",
    [SERVICE_REQUEST_STATUS.PAYMENT_RECEIVED]: "Ödeme Alındı",
    [SERVICE_REQUEST_STATUS.COMPLETED]: "Tamamlandı",
    [SERVICE_REQUEST_STATUS.CANCELLED]: "İptal Edildi",
    [SERVICE_REQUEST_STATUS.TIMEOUT]: "Zaman Aşımı",
  }
  return labels[status] || status
}

export interface StateTransition {
  from: string
  to: string
  allowed: boolean
}

export const STATE_TRANSITIONS: StateTransition[] = [
  { from: "CREATED", to: "ACCEPTED", allowed: true },
  { from: "CREATED", to: "CANCELLED", allowed: true },
  { from: "ACCEPTED", to: "PAYMENT_RECEIVED", allowed: true },
  { from: "ACCEPTED", to: "CANCELLED", allowed: true },
  { from: "PAYMENT_RECEIVED", to: "COMPLETED", allowed: true },
  { from: "PAYMENT_RECEIVED", to: "CANCELLED", allowed: true },
  { from: "COMPLETED", to: "CANCELLED", allowed: false },
  { from: "CANCELLED", to: "ACCEPTED", allowed: false },
]

export function getAllowedTransitions(currentStatus: string): string[] {
  return STATE_TRANSITIONS.filter(
    (transition) =>
      transition.from === currentStatus && transition.allowed
  ).map((t) => t.to)
}
