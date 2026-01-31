import { RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import { router } from "./routes"
import { ErrorBoundary } from "./components/ErrorBoundary"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 0,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
              border: "1px solid hsl(var(--border))",
            },
            success: {
              iconTheme: {
                primary: "hsl(var(--primary))",
                secondary: "hsl(var(--primary-foreground))",
              },
            },
            error: {
              iconTheme: {
                primary: "hsl(var(--destructive))",
                secondary: "hsl(var(--destructive-foreground))",
              },
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
