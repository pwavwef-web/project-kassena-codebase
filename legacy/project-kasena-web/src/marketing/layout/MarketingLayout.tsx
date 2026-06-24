import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { SiteHeader } from './SiteHeader'

/** Scrolls to top on route change (preserves in-page anchor jumps). */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])
  return null
}

const RouteFallback = () => (
  <div
    className="flex min-h-[60vh] items-center justify-center"
    role="status"
    aria-label="Loading"
  >
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-700" />
  </div>
)

export const MarketingLayout = () => (
  <div className="pk flex min-h-screen flex-col bg-cream-50 font-sans text-charcoal">
    <a href="#main-content" className="pk-skip-link">
      Skip to content
    </a>
    <ScrollToTop />
    <SiteHeader />
    <main id="main-content" className="flex-1">
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </div>
)
