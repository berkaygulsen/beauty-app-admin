import { createBrowserRouter, Navigate } from "react-router-dom"
import { ROUTES } from "@/lib/constants"
import LoginPage from "@/features/auth/pages/LoginPage"
import DashboardPage from "@/features/dashboard/pages/DashboardPage"
import ProvidersPage from "@/features/providers/pages/ProvidersPage"
import ProviderDetailPage from "@/features/providers/pages/ProviderDetailPage"
import CustomersPage from "@/features/customers/pages/CustomersPage"
import CustomerDetailPage from "@/features/customers/pages/CustomerDetailPage"
import ServiceRequestsPage from "@/features/serviceRequests/pages/ServiceRequestsPage"
import ServiceRequestDetailPage from "@/features/serviceRequests/pages/ServiceRequestDetailPage"
import PaymentsPage from "@/features/payments/pages/PaymentsPage"
import PaymentDetailPage from "@/features/payments/pages/PaymentDetailPage"
import DocumentsPage from "@/features/documents/pages/DocumentsPage"
import DocumentDetailPage from "@/features/documents/pages/DocumentDetailPage"
import CancellationPolicyPage from "@/features/settings/pages/CancellationPolicyPage"
import CancellationHistoryPage from "@/features/settings/pages/CancellationHistoryPage"
import SettingsPage from "@/features/settings/pages/SettingsPage"
import PendingCompletionPage from "@/features/serviceRequests/pages/PendingCompletionPage"
import DisputedRequestsPage from "@/features/serviceRequests/pages/DisputedRequestsPage"
import ReportsPage from "@/features/reports/pages/ReportsPage"
import ProviderReportsPage from "@/features/reports/pages/ProviderReportsPage"
import CustomerReportsPage from "@/features/reports/pages/CustomerReportsPage"
import RevenueReportsPage from "@/features/reports/pages/RevenueReportsPage"
import ServiceRequestReportsPage from "@/features/reports/pages/ServiceRequestReportsPage"
import OperationalReportsPage from "@/features/reports/pages/OperationalReportsPage"
import AuditLogsPage from "@/features/auditLogs/pages/AuditLogsPage"
import { MainLayout } from "@/components/layout/MainLayout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { PublicRoute } from "@/components/PublicRoute"

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PROVIDERS,
        element: (
          <ProtectedRoute>
            <ProvidersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTES.PROVIDERS}/:id`,
        element: (
          <ProtectedRoute>
            <ProviderDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.CUSTOMERS,
        element: (
          <ProtectedRoute>
            <CustomersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTES.CUSTOMERS}/:id`,
        element: (
          <ProtectedRoute>
            <CustomerDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SERVICE_REQUESTS,
        element: (
          <ProtectedRoute>
            <ServiceRequestsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTES.SERVICE_REQUESTS}/:id`,
        element: (
          <ProtectedRoute>
            <ServiceRequestDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PAYMENTS,
        element: (
          <ProtectedRoute>
            <PaymentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTES.PAYMENTS}/:id`,
        element: (
          <ProtectedRoute>
            <PaymentDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DOCUMENTS,
        element: (
          <ProtectedRoute>
            <DocumentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTES.DOCUMENTS}/:id`,
        element: (
          <ProtectedRoute>
            <DocumentDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.CANCELLATION_POLICY,
        element: (
          <ProtectedRoute>
            <CancellationPolicyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.CANCELLATION_HISTORY,
        element: (
          <ProtectedRoute>
            <CancellationHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PENDING_COMPLETION,
        element: (
          <ProtectedRoute>
            <PendingCompletionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DISPUTED_REQUESTS,
        element: (
          <ProtectedRoute>
            <DisputedRequestsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.REPORTS,
        element: (
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.REPORTS_PROVIDERS,
        element: (
          <ProtectedRoute>
            <ProviderReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.REPORTS_CUSTOMERS,
        element: (
          <ProtectedRoute>
            <CustomerReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.REPORTS_REVENUE,
        element: (
          <ProtectedRoute>
            <RevenueReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.REPORTS_SERVICE_REQUESTS,
        element: (
          <ProtectedRoute>
            <ServiceRequestReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.REPORTS_OPERATIONAL,
        element: (
          <ProtectedRoute>
            <OperationalReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SETTINGS,
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.AUDIT_LOGS,
        element: (
          <ProtectedRoute>
            <AuditLogsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
])
