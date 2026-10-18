import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { primaryNav } from '../../content/siteData'

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="font-display text-lg font-semibold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo"
          onClick={() => setIsOpen(false)}
        >
          Indigen<span className="text-terracotta"> World</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex">
          {primaryNav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-ink ${
                  isActive ? 'text-indigo' : 'text-ink/70'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/updates"
            className="text-sm font-semibold text-ink/70 hover:text-ink"
          >
            Updates
          </Link>
          <Link
            to="/contact"
            className="rounded-full bg-indigo px-4 py-2 text-sm font-semibold text-white"
          >
            Contact
          </Link>
        </div>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((current) => !current)}
          className="rounded-lg border border-ink/15 px-3 py-2 text-sm font-semibold text-ink lg:hidden"
        >
          Menu
        </button>
      </div>
      {isOpen ? (
        <nav id="mobile-navigation" aria-label="Mobile" className="border-t border-ink/10 bg-cream px-6 py-4 lg:hidden">
          <div className="grid gap-2">
            {[...primaryNav, { label: 'Updates', href: '/updates' }, { label: 'Contact', href: '/contact' }].map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive ? 'bg-white text-indigo' : 'text-ink/75'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
