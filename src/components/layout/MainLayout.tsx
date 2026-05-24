import { Link, NavLink, Outlet } from 'react-router-dom'
import { isFirebaseConfigured } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Dictionary', to: '/dictionary' },
  { label: 'Submit', to: '/submit' },
  { label: 'Uploads', to: '/uploads' },
]

export const MainLayout = () => {
  const { appUser, logout } = useAuth()

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
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? 'text-kassena-orange' : 'text-kassena-green'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {appUser && appUser.role !== 'contributor' ? (
              <NavLink
                to="/admin"
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
              <>
                <Link
                  to="/profile"
                  className="text-sm font-semibold text-kassena-green"
                >
                  {appUser.displayName}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg bg-kassena-green px-3 py-1.5 text-sm text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-kassena-orange px-3 py-1.5 text-sm text-white"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
