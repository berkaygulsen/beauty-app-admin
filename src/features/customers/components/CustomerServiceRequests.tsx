import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { CustomerDetail } from "@/api/endpoints/customers"
import { formatDateTime } from "@/lib/utils/status"
import {
  getServiceRequestStatusBadgeVariant,
  getServiceRequestStatusLabel,
} from "@/lib/utils/serviceRequest"

interface CustomerServiceRequestsProps {
  customer: CustomerDetail
}

export function CustomerServiceRequests({
  customer,
}: CustomerServiceRequestsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hizmet Talepleri</CardTitle>
      </CardHeader>
      <CardContent>
        {customer.serviceRequests && customer.serviceRequests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Oluşturulma Tarihi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customer.serviceRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-xs">
                    {request.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getServiceRequestStatusBadgeVariant(
                        request.status
                      )}
                    >
                      {getServiceRequestStatusLabel(request.status)}
                    </Badge>
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
