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

export default function ProviderReportsPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    providerId: "",
  })

  const { data, isLoading } = useQuery({
    queryKey: ["provider-report", filters],
    queryFn: () => reportsApi.getProviderReport(filters),
    enabled: true,
  })

  const handleExport = () => {
    // TODO: Implement export functionality
    alert("Export özelliği yakında eklenecek")
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Provider Raporları</h1>
          <p className="text-muted-foreground mt-2">
            Provider performans analizi ve istatistikleri
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
              <Label>Provider ID</Label>
              <Input
                placeholder="Provider ID"
                value={filters.providerId}
                onChange={(e) =>
                  setFilters({ ...filters, providerId: e.target.value })
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
        <>
          <Card>
            <CardHeader>
              <CardTitle>En Çok Hizmet Veren Provider'lar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Toplam Hizmet</TableHead>
                    <TableHead>Toplam Gelir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.topProviders.map((provider) => (
                    <TableRow key={provider.providerId}>
                      <TableCell>
                        <button
                          className="text-primary hover:underline"
                          onClick={() =>
                            navigate(`/providers/${provider.providerId}`)
                          }
                        >
                          {provider.providerName}
                        </button>
                      </TableCell>
                      <TableCell>{provider.totalServices}</TableCell>
                      <TableCell>{formatCurrency(provider.totalRevenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>En Yüksek Puanlı Provider'lar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Ortalama Puan</TableHead>
                    <TableHead>Toplam Değerlendirme</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.topRatedProviders.map((provider) => (
                    <TableRow key={provider.providerId}>
                      <TableCell>
                        <button
                          className="text-primary hover:underline"
                          onClick={() =>
                            navigate(`/providers/${provider.providerId}`)
                          }
                        >
                          {provider.providerName}
                        </button>
                      </TableCell>
                      <TableCell>{provider.averageRating.toFixed(2)}</TableCell>
                      <TableCell>{provider.totalRatings}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>En Çok Kazanan Provider'lar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Toplam Kazanç</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.topEarningProviders.map((provider) => (
                    <TableRow key={provider.providerId}>
                      <TableCell>
                        <button
                          className="text-primary hover:underline"
                          onClick={() =>
                            navigate(`/providers/${provider.providerId}`)
                          }
                        >
                          {provider.providerName}
                        </button>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(provider.totalEarnings)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
