import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Provider } from "@/api/endpoints/providers"
import {
  getProviderStatusBadgeVariant,
  getProviderStatusLabel,
  formatDate,
} from "@/lib/utils/status"
import { Eye, Check, X, Ban, MoreVertical } from "lucide-react"
import { ProviderActionsMenu } from "./ProviderActionsMenu"
import { useState } from "react"

interface ProviderListTableProps {
  providers: Provider[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void
  onProviderAction: () => void
}

export function ProviderListTable({
  providers = [],
  pagination,
  onPageChange,
  onSortChange,
  onProviderAction,
}: ProviderListTableProps) {
  const navigate = useNavigate()
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Şehir/İlçe</TableHead>
              <TableHead>Skor</TableHead>
              <TableHead>Toplam Hizmet</TableHead>
              <TableHead>Ortalama Puan</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!providers || providers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8">
                  <div className="text-muted-foreground">
                    Provider bulunamadı
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-mono text-xs">
                    {provider.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">
                    {provider.firstName} {provider.lastName}
                  </TableCell>
                  <TableCell>{provider.email}</TableCell>
                  <TableCell>{provider.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getProviderStatusBadgeVariant(provider.status)}
                    >
                      {getProviderStatusLabel(provider.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {provider.city && provider.district
                      ? `${provider.city}/${provider.district}`
                      : "-"}
                  </TableCell>
                  <TableCell>{provider.score.toFixed(1)}</TableCell>
                  <TableCell>
                    {provider._count?.services || 0}
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{formatDate(provider.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigate(`/providers/${provider.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <ProviderActionsMenu
                        provider={provider}
                        onAction={onProviderAction}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Sayfa {pagination.page} / {pagination.totalPages} (Toplam:{" "}
            {pagination.total})
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
