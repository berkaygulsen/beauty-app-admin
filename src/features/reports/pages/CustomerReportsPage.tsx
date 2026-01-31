import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { reportsApi } from "@/api/endpoints/reports"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils/status"
import { Download } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function CustomerReportsPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    customerId: "",
  })

  const { data, isLoading } = useQuery({
    queryKey: ["customer-report", filters],
    queryFn: () => reportsApi.getCustomerReport(filters),
  })

  const handleExport = () => {
    alert("Export özelliği yakında eklenecek")
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Raporları</h1>
          <p className="text-muted-foreground mt-2">
            Customer aktivite ve harcama analizi
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Dışa Aktar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Başlangıç Tarihi</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Bitiş Tarihi</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Customer ID</Label>
              <Input
                placeholder="Customer ID"
                value={filters.customerId}
                onChange={(e) =>
                  setFilters({ ...filters, customerId: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-center">Yükleniyor...</CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              En Aktif Customer'lar (Toplam: {data?.total || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Toplam Hizmet</TableHead>
                  <TableHead>Toplam Harcama</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.topActiveCustomers.map((customer) => (
                  <TableRow key={customer.customerId}>
                    <TableCell>
                      <button
                        className="text-primary hover:underline"
                        onClick={() =>
                          navigate(`/customers/${customer.customerId}`)
                        }
                      >
                        {customer.customerName}
                      </button>
                    </TableCell>
                    <TableCell>{customer.totalServices}</TableCell>
                    <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
