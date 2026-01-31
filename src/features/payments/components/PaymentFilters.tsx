import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { PaymentFilters } from "@/api/endpoints/payments"
import { PAYMENT_STATUS } from "@/lib/constants"
import { X } from "lucide-react"

interface PaymentFiltersProps {
  filters: PaymentFilters
  onFiltersChange: (filters: PaymentFilters) => void
}

export function PaymentFilters({
  filters,
  onFiltersChange,
}: PaymentFiltersProps) {
  const handleFilterChange = (
    key: keyof PaymentFilters,
    value: PaymentFilters[keyof PaymentFilters]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      offset: 0, // Reset to first page on filter change
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      limit: 10,
      offset: 0,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="status">Durum</Label>
          <Select
            id="status"
            value={filters.status || ""}
            onChange={(e) =>
              handleFilterChange("status", e.target.value || undefined)
            }
          >
            <option value="">Tümü</option>
            <option value={PAYMENT_STATUS.PENDING}>Bekliyor</option>
            <option value={PAYMENT_STATUS.PROCESSING}>İşleniyor</option>
            <option value={PAYMENT_STATUS.COMPLETED}>Tamamlandı</option>
            <option value={PAYMENT_STATUS.FAILED}>Başarısız</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="providerId">Provider ID</Label>
          <Input
            id="providerId"
            placeholder="Provider ID"
            value={filters.providerId || ""}
            onChange={(e) =>
              handleFilterChange("providerId", e.target.value || undefined)
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Filtreleri Temizle
        </Button>
      </div>
    </div>
  )
}
