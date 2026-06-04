import { Link, NavLink, Outlet } from 'react-router-dom'
import { isFirebaseConfigured } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  {
    label: 'Home',
    to: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Dictionary',
    to: '/dictionary',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: 'Culture',
    to: '/culture',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    label: 'Submit',
    to: '/submit',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Uploads',
    to: '/uploads',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
]

export const MainLayout = () => {
  const { appUser } = useAuth()
  const initials =
    appUser?.displayName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'PK'

  return (
    <div className="min-h-screen bg-kassena-bg text-slate-800 pb-20 md:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-kassena-cream bg-white/80 backdrop-blur-md shadow-sm">
        {!isFirebaseConfigured ? (
          <div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-800">
            Firebase is not configured. Add values in .env.local to enable
            sign-in and data features.
          </div>
        ) : null}
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-kassena-green flex items-center gap-2">
            <span className="bg-gradient-to-r from-kassena-green to-kassena-orange bg-clip-text text-transparent">
              Project Kassena
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-kassena-orange ${isActive ? 'text-kassena-orange border-b-2 border-kassena-orange pb-1' : 'text-kassena-green'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {appUser && appUser.role !== 'contributor' ? (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-kassena-orange ${isActive ? 'text-kassena-orange border-b-2 border-kassena-orange pb-1' : 'text-kassena-green'}`
                }
              >
                Admin
              </NavLink>
            ) : null}
          </nav>
          
          <div className="flex items-center gap-3">
            {appUser ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm font-semibold text-kassena-green hover:opacity-80 transition-opacity"
                aria-label="Open profile"
              >
                {appUser.photoURL ? (
                  <img
                    src={appUser.photoURL}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover shadow-sm ring-2 ring-kassena-cream"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-kassena-green to-kassena-dark text-xs font-bold text-white shadow-sm ring-2 ring-kassena-cream">
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
                className="rounded-full bg-gradient-to-r from-kassena-orange to-[#e67e22] px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-6 animate-fade-in">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-kassena-cream bg-white/90 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] pt-2 px-2 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 min-w-[4rem] rounded-xl transition-all ${
                isActive 
                  ? 'text-kassena-orange bg-orange-50/80 scale-105' 
                  : 'text-slate-500 hover:text-kassena-green hover:bg-slate-50'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
