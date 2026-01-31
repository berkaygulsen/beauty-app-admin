import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { auditLogsApi } from "@/api/endpoints/auditLogs"
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
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils/status"
import { Eye } from "lucide-react"

export default function AuditLogsPage() {
  const [filters, setFilters] = useState({
    adminId: "",
    action: "",
    entityType: "",
    entityId: "",
    startDate: "",
    endDate: "",
  })
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", filters, page],
    queryFn: () =>
      auditLogsApi.getAuditLogs({
        ...filters,
        limit,
        offset: (page - 1) * limit,
      }),
  })

  const auditLogs = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Log</h1>
        <p className="text-muted-foreground mt-2">
          Tüm admin işlemlerini görüntüleyin
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Admin ID</Label>
              <Input
                placeholder="Admin ID"
                value={filters.adminId}
                onChange={(e) =>
                  setFilters({ ...filters, adminId: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>İşlem</Label>
              <Input
                placeholder="İşlem"
                value={filters.action}
                onChange={(e) =>
                  setFilters({ ...filters, action: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Entity Type</Label>
              <Input
                placeholder="Entity Type"
                value={filters.entityType}
                onChange={(e) =>
                  setFilters({ ...filters, entityType: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Entity ID</Label>
              <Input
                placeholder="Entity ID"
                value={filters.entityId}
                onChange={(e) =>
                  setFilters({ ...filters, entityId: e.target.value })
                }
              />
            </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Audit Log Kayıtları ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Audit log kaydı bulunamadı
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>İşlem</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>IP Adresi</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {log.admin.firstName} {log.admin.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {log.admin.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell>{log.entityType}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.entityId.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{log.ipAddress || "-"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Toplam {total} kayıt
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Önceki
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        Sayfa {page} / {totalPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      Sonraki
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
