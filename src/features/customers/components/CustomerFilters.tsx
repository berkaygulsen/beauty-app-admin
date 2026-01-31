import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { CustomerFilters } from "@/api/endpoints/customers"
import { Search, X } from "lucide-react"

interface CustomerFiltersProps {
  filters: CustomerFilters
  onFiltersChange: (filters: CustomerFilters) => void
}

export function CustomerFilters({
  filters,
  onFiltersChange,
}: CustomerFiltersProps) {
  const handleFilterChange = (
    key: keyof CustomerFilters,
    value: CustomerFilters[keyof CustomerFilters]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      offset: 0, // Reset to first page when filter changes
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
          <Label htmlFor="emailVerified">Email Doğrulama</Label>
          <Select
            id="emailVerified"
            value={filters.emailVerified || ""}
            onChange={(e) =>
              handleFilterChange(
                "emailVerified",
                e.target.value === "" ? undefined : (e.target.value as "true" | "false")
              )
            }
          >
            <option value="">Tümü</option>
            <option value="true">Doğrulanmış</option>
            <option value="false">Doğrulanmamış</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneVerified">Telefon Doğrulama</Label>
          <Select
            id="phoneVerified"
            value={filters.phoneVerified || ""}
            onChange={(e) =>
              handleFilterChange(
                "phoneVerified",
                e.target.value === "" ? undefined : (e.target.value as "true" | "false")
              )
            }
          >
            <option value="">Tümü</option>
            <option value="true">Doğrulanmış</option>
            <option value="false">Doğrulanmamış</option>
          </Select>
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
