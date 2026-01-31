import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { CustomerDetail } from "@/api/endpoints/customers"
import { formatCurrency, formatDateTime } from "@/lib/utils/status"
import { Badge } from "@/components/ui/badge"

interface CustomerPaymentsProps {
  customer: CustomerDetail
}

export function CustomerPayments({ customer }: CustomerPaymentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ödemeler</CardTitle>
      </CardHeader>
      <CardContent>
        {customer.payments && customer.payments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tutar</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customer.payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs">
                    {payment.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(payment.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">Henüz ödeme kaydı yok</p>
        )}
      </CardContent>
    </Card>
  )
}
