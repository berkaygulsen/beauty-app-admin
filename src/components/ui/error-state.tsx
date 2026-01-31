import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
  showRetry?: boolean
}

export function ErrorState({
  title = "Bir hata oluştu",
  message = "Bir şeyler yanlış gitti. Lütfen tekrar deneyin.",
  onRetry,
  className,
  showRetry = true,
}: ErrorStateProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
          {message}
        </p>
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tekrar Dene
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function PageError({ title, message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <ErrorState title={title} message={message} onRetry={onRetry} />
    </div>
  )
}
