import { ErrorBoundary } from '../components/ErrorBoundary'
import { DashboardLayout } from '../components/layout/DashboardLayout'

/**
 * TribeStudio root. The dashboard chrome (sidebar + topbar) wraps every
 * route via <Outlet /> inside DashboardLayout.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <DashboardLayout />
    </ErrorBoundary>
  )
}
