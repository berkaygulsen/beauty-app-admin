import { Inbox, Search } from "lucide-react"
import { Card, CardContent } from "./card"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title = "Veri bulunamadı",
  description = "Henüz kayıt bulunmuyor.",
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        {icon || <Inbox className="h-12 w-12 text-muted-foreground mb-4" />}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick} variant="outline" size="sm">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function EmptySearchState({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon={<Search className="h-12 w-12 text-muted-foreground mb-4" />}
      title="Sonuç bulunamadı"
      description="Arama kriterlerinize uygun sonuç bulunamadı. Filtreleri değiştirmeyi deneyin."
      action={onClear ? { label: "Filtreleri Temizle", onClick: onClear } : undefined}
    />
  )
}

export function EmptyTableState({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <EmptyState
        title="Kayıt bulunamadı"
        description={message || "Henüz kayıt bulunmuyor."}
      />
    </div>
  )
}
