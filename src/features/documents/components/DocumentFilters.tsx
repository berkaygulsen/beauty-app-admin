import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { DocumentFilters } from "@/api/endpoints/documents"
import { DOCUMENT_STATUS } from "@/lib/constants"
import { X } from "lucide-react"

interface DocumentFiltersProps {
  filters: DocumentFilters
  onFiltersChange: (filters: DocumentFilters) => void
}

export function DocumentFilters({
  filters,
  onFiltersChange,
}: DocumentFiltersProps) {
  const handleFilterChange = (key: keyof DocumentFilters, value: any) => {
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
          <Label htmlFor="verificationStatus">Durum</Label>
          <Select
            id="verificationStatus"
            value={filters.verificationStatus || ""}
            onChange={(e) =>
              handleFilterChange("verificationStatus", e.target.value || undefined)
            }
          >
            <option value="">Tümü</option>
            <option value={DOCUMENT_STATUS.PENDING}>Onay Bekliyor</option>
            <option value={DOCUMENT_STATUS.VERIFIED}>Doğrulandı</option>
            <option value={DOCUMENT_STATUS.REJECTED}>Reddedildi</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentType">Doküman Türü</Label>
          <Input
            id="documentType"
            placeholder="Doküman türü"
            value={filters.documentType || ""}
            onChange={(e) => handleFilterChange("documentType", e.target.value || undefined)}
          />
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
