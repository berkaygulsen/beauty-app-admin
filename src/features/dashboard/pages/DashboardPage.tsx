import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "../hooks/useDashboard"
import { formatCurrency } from "@/lib/utils/status"
import { Users, UserCheck, FileText, TrendingUp, AlertCircle } from "lucide-react"
import { DashboardCharts } from "../components/DashboardCharts"
import { DashboardActivities } from "../components/DashboardActivities"

export default function DashboardPage() {
  const { stats, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Genel istatistikler ve özet bilgiler
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Provider
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalProviders || 0}
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span>Aktif: {stats?.activeProviders || 0}</span>
              <span>•</span>
              <span>Bekleyen: {stats?.pendingProviders || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Müşteri
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalCustomers || 0}
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span>Bugün: {stats?.newCustomersToday || 0}</span>
              <span>•</span>
              <span>Bu Ay: {stats?.newCustomersThisMonth || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hizmet Talepleri
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalServiceRequests || 0}
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span>Yeni: {stats?.newRequests || 0}</span>
              <span>•</span>
              <span>Tamamlanan: {stats?.completedRequests || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalRevenue || 0)}
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span>Bugün: {formatCurrency(stats?.todayRevenue || 0)}</span>
              <span>•</span>
              <span>Bu Ay: {formatCurrency(stats?.monthRevenue || 0)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      {stats?.pendingActions &&
        (stats.pendingActions.pendingProviders > 0 ||
          stats.pendingActions.pendingDocuments > 0 ||
          stats.pendingActions.disputedRequests > 0) && (
          <Card className="border-yellow-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <CardTitle>Bekleyen İşlemler</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-3">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Onay Bekleyen Provider:
                  </span>
                  <span className="ml-2 font-semibold">
                    {stats.pendingActions.pendingProviders}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Onay Bekleyen Doküman:
                  </span>
                  <span className="ml-2 font-semibold">
                    {stats.pendingActions.pendingDocuments}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    İtiraz Edilen Talep:
                  </span>
                  <span className="ml-2 font-semibold">
                    {stats.pendingActions.disputedRequests}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Charts */}
      <DashboardCharts />

      {/* Recent Activities */}
      <DashboardActivities />
    </div>
  )
}
