import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { isFirebaseConfigured } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Dictionary', to: '/dictionary' },
  { label: 'Culture', to: '/culture' },
  { label: 'Submit', to: '/submit' },
  { label: 'Uploads', to: '/uploads' },
]

export const MainLayout = () => {
  const { appUser } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const initials =
    appUser?.displayName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'PK'

  const renderNavLink = (item: { label: string; to: string }) => (
    <NavLink
      key={item.to}
      to={item.to}
      onClick={() => setIsMenuOpen(false)}
      className={({ isActive }) =>
        `text-sm font-medium ${isActive ? 'text-kassena-orange' : 'text-kassena-green'}`
      }
    >
      {item.label}
    </NavLink>
  )

  return (
    <div className="min-h-screen bg-kassena-bg text-slate-800">
      <header className="border-b border-kassena-cream bg-white">
        {!isFirebaseConfigured ? (
          <div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-800">
            Firebase is not configured. Add values in .env.local to enable
            sign-in and data features.
          </div>
        ) : null}
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-kassena-green">
            Project Kassena
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {navItems.map(renderNavLink)}
            {appUser && appUser.role !== 'contributor' ? (
              <NavLink
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? 'text-kassena-orange' : 'text-kassena-green'}`
                }
              >
                Admin
              </NavLink>
            ) : null}
            <a
              href="https://kassena.azlearner.me"
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm font-medium text-kassena-green transition hover:text-kassena-orange"
            >
              Learn more
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {appUser ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm font-semibold text-kassena-green"
                aria-label="Open profile"
              >
                {appUser.photoURL ? (
                  <img
                    src={appUser.photoURL}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-kassena-green text-xs font-bold text-white">
                    {initials}
                  </span>
                )}
                <span className="hidden max-w-36 truncate sm:inline">
                  {appUser.displayName}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-kassena-orange px-3 py-1.5 text-sm text-white"
              >
                Sign in
              </Link>
            )}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-kassena-cream md:hidden"
              aria-label="Toggle navigation menu"
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              <span className="flex flex-col gap-1">
                <span className="block h-0.5 w-5 bg-kassena-green" />
                <span className="block h-0.5 w-5 bg-kassena-green" />
                <span className="block h-0.5 w-5 bg-kassena-green" />
              </span>
            </button>
          </div>
        </div>
        {isMenuOpen ? (
          <nav className="mx-auto grid max-w-6xl gap-3 border-t border-kassena-cream px-4 py-4 md:hidden">
            {navItems.map(renderNavLink)}
            {appUser && appUser.role !== 'contributor' ? (
              <NavLink
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? 'text-kassena-orange' : 'text-kassena-green'}`
                }
              >
                Admin
              </NavLink>
            ) : null}
            <a
              href="https://kassena.azlearner.me"
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm font-medium text-kassena-green transition hover:text-kassena-orange"
            >
              Learn more
            </a>
          </nav>
        ) : null}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
