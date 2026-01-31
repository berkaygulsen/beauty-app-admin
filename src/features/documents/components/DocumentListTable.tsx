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
import type { Document } from "@/api/endpoints/documents"
import { formatDate } from "@/lib/utils/status"
import {
  getDocumentStatusBadgeVariant,
  getDocumentStatusLabel,
} from "@/lib/utils/document"
import { Eye } from "lucide-react"
import { DocumentActionsMenu } from "./DocumentActionsMenu"

interface DocumentListTableProps {
  documents: Document[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onAction: () => void
}

export function DocumentListTable({
  documents = [],
  pagination,
  onPageChange,
  onAction,
}: DocumentListTableProps) {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Doküman Türü</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Yüklenme Tarihi</TableHead>
              <TableHead>Doğrulama Tarihi</TableHead>
              <TableHead>Doğrulayan</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!documents || documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-muted-foreground">
                    Doküman bulunamadı
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-mono text-xs">
                    {document.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-primary hover:underline"
                      onClick={() =>
                        navigate(`/providers/${document.providerId}`)
                      }
                    >
                      {document.provider?.firstName && document.provider?.lastName
                        ? `${document.provider.firstName} ${document.provider.lastName}`
                        : document.providerId.slice(0, 8)}
                    </button>
                  </TableCell>
                  <TableCell className="font-medium">{document.documentType}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getDocumentStatusBadgeVariant(document.verificationStatus)}
                    >
                      {getDocumentStatusLabel(document.verificationStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(document.createdAt)}</TableCell>
                  <TableCell>
                    {document.verifiedAt ? formatDate(document.verifiedAt) : "-"}
                  </TableCell>
                  <TableCell>
                    {document.verifiedBy || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigate(`/documents/${document.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DocumentActionsMenu
                        document={document}
                        onAction={onAction}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
