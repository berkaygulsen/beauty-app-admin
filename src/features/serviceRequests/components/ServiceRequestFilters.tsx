import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { ServiceRequestFilters } from "@/api/endpoints/serviceRequests"
import { SERVICE_REQUEST_STATUS } from "@/lib/constants"
import { X } from "lucide-react"

interface ServiceRequestFiltersProps {
  filters: ServiceRequestFilters
  onFiltersChange: (filters: ServiceRequestFilters) => void
  showStatusFilter?: boolean
}

export function ServiceRequestFilters({
  filters,
  onFiltersChange,
  showStatusFilter = true,
}: ServiceRequestFiltersProps) {
  const handleFilterChange = (
    key: keyof ServiceRequestFilters,
    value: ServiceRequestFilters[keyof ServiceRequestFilters]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {showStatusFilter && (
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
              <option value={SERVICE_REQUEST_STATUS.CREATED}>Oluşturuldu</option>
              <option value={SERVICE_REQUEST_STATUS.ACCEPTED}>Kabul Edildi</option>
              <option value={SERVICE_REQUEST_STATUS.PAYMENT_RECEIVED}>
                Ödeme Alındı
              </option>
              <option value={SERVICE_REQUEST_STATUS.COMPLETED}>Tamamlandı</option>
              <option value={SERVICE_REQUEST_STATUS.CANCELLED}>İptal Edildi</option>
              <option value={SERVICE_REQUEST_STATUS.TIMEOUT}>Zaman Aşımı</option>
            </Select>
          </div>
        )}

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

        <div className="space-y-2">
          <Label htmlFor="customerId">Customer ID</Label>
          <Input
            id="customerId"
            placeholder="Customer ID"
            value={filters.customerId || ""}
            onChange={(e) =>
              handleFilterChange("customerId", e.target.value || undefined)
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
