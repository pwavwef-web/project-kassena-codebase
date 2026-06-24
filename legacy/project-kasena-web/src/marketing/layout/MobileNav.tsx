import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { primaryNav } from '../../content/navigation'
import { site } from '../../content/site'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export const MobileNav = ({ open, onClose }: MobileNavProps) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  // Escape + basic focus trap.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <div
      className={`pk fixed inset-0 z-[80] lg:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Scrim */}
      <div
        className={`absolute inset-0 bg-indigo-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`absolute right-0 top-0 flex h-full w-[min(88vw,24rem)] flex-col bg-cream-50 shadow-lifted transition-transform duration-300 ease-emphasized ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-center justify-between border-b border-indigo-100 px-5 py-4">
          <Logo />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="pk-focus inline-flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-100 bg-white text-indigo-800"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-auto px-3 py-4"
          aria-label="Mobile primary"
        >
          {primaryNav.map((item) => {
            if (!item.children) {
              return (
                <NavLink
                  key={item.label}
                  to={item.to!}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3.5 text-base font-semibold transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-terracotta-600'
                        : 'text-indigo-900 hover:bg-cream-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            }
            return (
              <div key={item.label} className="px-1 py-2">
                <p className="px-3 pb-1 text-xs font-bold uppercase tracking-[0.18em] text-charcoal-muted">
                  {item.label}
                </p>
                {item.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-[0.95rem] font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-terracotta-600'
                          : 'text-indigo-800 hover:bg-cream-100'
                      }`
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )
          })}
        </nav>

        <div className="grid gap-2.5 border-t border-indigo-100 px-5 py-4">
          <Button to="/support" variant="outline" size="md" fullWidth>
            Support the work
          </Button>
          <Button to={site.appLaunchPath} variant="primary" size="md" fullWidth>
            Launch app
          </Button>
          <Link
            to="/contact"
            onClick={onClose}
            className="pk-focus pt-1 text-center text-sm font-medium text-charcoal-muted hover:text-indigo-700"
          >
            Contact the team
          </Link>
        </div>
      </div>
    </div>
  )
}
