import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  CreditCard,
  FileCheck,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useUIStore } from "@/store/uiStore"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: "Provider'lar", href: ROUTES.PROVIDERS, icon: UserCheck },
  { name: "Müşteriler", href: ROUTES.CUSTOMERS, icon: Users },
  { name: "Hizmet Talepleri", href: ROUTES.SERVICE_REQUESTS, icon: FileText },
  { name: "Ödemeler", href: ROUTES.PAYMENTS, icon: CreditCard },
  { name: "Dokümanlar", href: ROUTES.DOCUMENTS, icon: FileCheck },
  { name: "Raporlar", href: ROUTES.REPORTS, icon: BarChart3 },
  { name: "Ayarlar", href: ROUTES.SETTINGS, icon: Settings },
]

export function Sidebar() {
  const location = useLocation()
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const { clearAuth } = useAuthStore()

  const handleLogout = async () => {
    clearAuth()
    window.location.href = ROUTES.LOGIN
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-transform",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "w-64 border-r bg-background lg:translate-x-0"
      )}
      aria-label="Ana navigasyon menüsü"
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold">Beauty App Admin</h1>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Çıkış Yap
          </Button>
        </div>
      </div>
    </aside>
  )
}
