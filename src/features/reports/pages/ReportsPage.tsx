import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ROUTES } from "@/lib/constants"
import {
  Users,
  UserCheck,
  DollarSign,
  FileText,
  Activity,
  BarChart3,
} from "lucide-react"

const reportCategories = [
  {
    title: "Provider Raporları",
    description: "Provider performans analizi ve istatistikleri",
    icon: UserCheck,
    href: `${ROUTES.REPORTS}/providers`,
    color: "text-blue-600",
  },
  {
    title: "Customer Raporları",
    description: "Customer aktivite ve harcama analizi",
    icon: Users,
    href: `${ROUTES.REPORTS}/customers`,
    color: "text-green-600",
  },
  {
    title: "Gelir Raporları",
    description: "Gelir trendi ve komisyon analizi",
    icon: DollarSign,
    href: `${ROUTES.REPORTS}/revenue`,
    color: "text-yellow-600",
  },
  {
    title: "Hizmet Talebi Raporları",
    description: "Talep trendi ve durum dağılımı",
    icon: FileText,
    href: `${ROUTES.REPORTS}/service-requests`,
    color: "text-purple-600",
  },
  {
    title: "Operasyonel Raporlar",
    description: "Yanıt süreleri ve operasyonel metrikler",
    icon: Activity,
    href: `${ROUTES.REPORTS}/operational`,
    color: "text-red-600",
  },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Raporlar</h1>
        <p className="text-muted-foreground mt-2">
          Detaylı analiz ve raporlara erişin
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportCategories.map((category) => {
          const Icon = category.icon
          return (
            <Link key={category.href} to={category.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-muted ${category.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
