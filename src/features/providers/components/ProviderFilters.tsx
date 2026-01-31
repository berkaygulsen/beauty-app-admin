import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { ProviderFilters } from "@/api/endpoints/providers"
import { PROVIDER_STATUS } from "@/lib/constants"
import { Search, X } from "lucide-react"

interface ProviderFiltersProps {
  filters: ProviderFilters
  onFiltersChange: (filters: ProviderFilters) => void
}

export function ProviderFilters({
  filters,
  onFiltersChange,
}: ProviderFiltersProps) {
  const handleFilterChange = (
    key: keyof ProviderFilters,
    value: ProviderFilters[keyof ProviderFilters]
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="search">Arama</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Email, telefon..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

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
            <option value={PROVIDER_STATUS.PENDING}>Onay Bekliyor</option>
            <option value={PROVIDER_STATUS.UNDER_REVIEW}>İncelemede</option>
            <option value={PROVIDER_STATUS.APPROVED}>Onaylandı</option>
            <option value={PROVIDER_STATUS.REJECTED}>Reddedildi</option>
            <option value={PROVIDER_STATUS.SUSPENDED}>Askıya Alındı</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Şehir</Label>
          <Input
            id="city"
            placeholder="Şehir"
            value={filters.city || ""}
            onChange={(e) => handleFilterChange("city", e.target.value || undefined)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">İlçe</Label>
          <Input
            id="district"
            placeholder="İlçe"
            value={filters.district || ""}
            onChange={(e) =>
              handleFilterChange("district", e.target.value || undefined)
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
