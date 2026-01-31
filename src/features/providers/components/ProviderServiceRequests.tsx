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

interface ProviderServiceRequestsProps {
  provider: ProviderDetail
}

export function ProviderServiceRequests({
  provider,
}: ProviderServiceRequestsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hizmet Talepleri</CardTitle>
      </CardHeader>
      <CardContent>
        {provider.serviceRequests && provider.serviceRequests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Oluşturulma Tarihi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {provider.serviceRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-xs">
                    {request.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{request.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(request.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">Henüz hizmet talebi yok</p>
        )}
      </CardContent>
    </Card>
  )
}
