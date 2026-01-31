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
import { formatCurrency } from "@/lib/utils/status"

interface ProviderServicesProps {
  provider: ProviderDetail
}

export function ProviderServices({ provider }: ProviderServicesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hizmetler</CardTitle>
      </CardHeader>
      <CardContent>
        {provider.services && provider.services.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hizmet Adı</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Fiyat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {provider.services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{formatCurrency(service.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">Henüz hizmet eklenmemiş</p>
        )}
      </CardContent>
    </Card>
  )
}
