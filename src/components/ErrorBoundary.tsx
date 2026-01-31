import { Component, ErrorInfo, ReactNode } from "react"
import { ErrorState } from "./ui/error-state"
import { Button } from "./ui/button"
import { Home } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/lib/constants"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorBoundaryFallback error={this.state.error} />
    }

    return this.props.children
  }
}

function ErrorBoundaryFallback({ error }: { error: Error | null }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full">
        <ErrorState
          title="Bir hata oluştu"
          message={
            error?.message ||
            "Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün."
          }
          showRetry={false}
        />
        <div className="mt-4 flex gap-2 justify-center">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Sayfayı Yenile
          </Button>
          <Button onClick={() => navigate(ROUTES.DASHBOARD)}>
            <Home className="h-4 w-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundary({ children, fallback }: Props) {
  return <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>
}
