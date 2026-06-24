import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { primaryNav } from '../../content/navigation'
import { site } from '../../content/site'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'
import { MobileNav } from './MobileNav'

export const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeTimer = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openMenu = (index: number) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpenIndex(index)
  }
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpenIndex(null), 120)
  }

  return (
    <header
      className={`pk sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-indigo-100 bg-cream-50/85 backdrop-blur-xl shadow-soft'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <Link to="/" className="pk-focus rounded-lg" aria-label={`${site.name} home`}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary"
          onMouseLeave={scheduleClose}
        >
          {primaryNav.map((item, index) => {
            if (!item.children) {
              return (
                <NavLink
                  key={item.label}
                  to={item.to!}
                  onClick={() => setOpenIndex(null)}
                  className={({ isActive }) =>
                    `pk-focus rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-terracotta-600'
                        : 'text-indigo-800 hover:text-terracotta-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            }
            const isOpen = openIndex === index
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => openMenu(index)}
              >
                <button
                  type="button"
                  className="pk-focus flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold text-indigo-800 transition-colors hover:text-terracotta-600"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setOpenIndex(null)
                  }}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  >
                    ▾
                  </span>
                </button>
                {isOpen ? (
                  <div
                    className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-3"
                    role="menu"
                  >
                    <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white p-2 shadow-lifted">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          role="menuitem"
                          onClick={() => setOpenIndex(null)}
                          className="pk-focus flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-cream-100"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"
                          >
                            <ChildGlyph icon={child.icon} />
                          </span>
                          <span className="flex flex-col">
                            <span className="text-sm font-semibold text-indigo-900">
                              {child.label}
                            </span>
                            {child.description ? (
                              <span className="text-xs text-charcoal-muted">
                                {child.description}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button to="/support" variant="ghost" size="sm">
            Support
          </Button>
          <Button to={site.appLaunchPath} variant="primary" size="sm">
            Launch app
          </Button>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          className="pk-focus inline-flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-100 bg-white/70 text-indigo-800 lg:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}

const ChildGlyph = ({ icon }: { icon?: string }) => {
  // Lightweight inline glyphs keyed by the nav icon name (no image requests).
  const paths: Record<string, string> = {
    data: 'M4 7h16M4 12h16M4 17h10',
    refresh: 'M4 12a8 8 0 0 1 14-5M20 12a8 8 0 0 1-14 5M18 3v4h-4M6 21v-4h4',
    spark: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
    community: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 6-5s6 2 6 5M16 14c2 0 5 1 5 4',
    leaf: 'M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19c4-4 8-7 12-9',
    shield: 'M12 3l7 3v6c0 5-3 7-7 9-4-2-7-4-7-9V6z',
    users: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 6-5s6 2 6 5M16 6a3 3 0 1 1 1 6',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6',
    send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={paths[icon ?? 'data'] ?? paths.data}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
