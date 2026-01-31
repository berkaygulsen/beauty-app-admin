import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ProviderDetail } from "@/api/endpoints/providers"
import { formatDateTime } from "@/lib/utils/status"
import { Badge } from "@/components/ui/badge"

interface ProviderDocumentsProps {
  provider: ProviderDetail
}

export function ProviderDocuments({ provider }: ProviderDocumentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dokümanlar</CardTitle>
      </CardHeader>
      <CardContent>
        {provider.documents && provider.documents.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doküman Türü</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Yüklenme Tarihi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {provider.documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">
                    {document.type}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{document.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {formatDateTime(document.uploadedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">Henüz doküman yüklenmemiş</p>
        )}
      </CardContent>
    </Card>
  )
}
