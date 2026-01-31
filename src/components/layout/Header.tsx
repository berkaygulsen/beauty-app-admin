import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/store/uiStore"
import { useAuthStore } from "@/store/authStore"

export function Header() {
  const { toggleSidebar, sidebarOpen } = useUIStore()
  const admin = useAuthStore((state) => state.admin)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Sidebar'ı kapat" : "Sidebar'ı aç"}
        aria-expanded={sidebarOpen}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">
          {sidebarOpen ? "Sidebar'ı kapat" : "Sidebar'ı aç"}
        </span>
      </Button>
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {admin ? `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim() || admin.email : ""}
          </span>
          <span className="text-xs text-muted-foreground">
            ({admin?.role})
          </span>
        </div>
      </div>
    </header>
  )
}
