import { PAYMENT_STATUS } from "@/lib/constants"
import type { BadgeProps } from "@/components/ui/badge"

export function getPaymentStatusBadgeVariant(
  status: string
): BadgeProps["variant"] {
  switch (status) {
    case PAYMENT_STATUS.COMPLETED:
      return "success"
    case PAYMENT_STATUS.PROCESSING:
      return "warning"
    case PAYMENT_STATUS.PENDING:
      return "outline"
    case PAYMENT_STATUS.FAILED:
      return "destructive"
    default:
      return "outline"
  }
}

export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    [PAYMENT_STATUS.PENDING]: "Bekliyor",
    [PAYMENT_STATUS.PROCESSING]: "İşleniyor",
    [PAYMENT_STATUS.COMPLETED]: "Tamamlandı",
    [PAYMENT_STATUS.FAILED]: "Başarısız",
  }
  return labels[status] || status
}
