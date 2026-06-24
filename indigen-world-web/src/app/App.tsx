import { Outlet } from 'react-router-dom'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { SiteHeader } from '../components/layout/SiteHeader'
import { SiteFooter } from '../components/layout/SiteFooter'

/**
 * Root layout for the Indigen World public website.
 * Wraps every route in a header / footer shell and an error boundary.
 * Pages are rendered through <Outlet />.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-cream text-ink">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </ErrorBoundary>
  )
}
