import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { reportsApi } from "@/api/endpoints/reports"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function OperationalReportsPage() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  })

  const { data, isLoading } = useQuery({
    queryKey: ["operational-report", filters],
    queryFn: () => reportsApi.getOperationalReport(filters),
  })

  const handleExport = () => {
    alert("Export özelliği yakında eklenecek")
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Operasyonel Raporlar</h1>
          <p className="text-muted-foreground mt-2">
            Yanıt süreleri ve operasyonel metrikler
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
          <div className="grid gap-4 md:grid-cols-2">
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
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-center">Yükleniyor...</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Ortalama Yanıt Süresi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.avgResponseTime.toFixed(2) || 0} dakika
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Ortalama Tamamlama Süresi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.avgCompletionTime.toFixed(2) || 0} dakika
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">İtiraz Oranı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.disputeRate.toFixed(2) || 0}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Doküman Doğrulama Süresi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.documentVerificationTime.toFixed(2) || 0} saat
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
