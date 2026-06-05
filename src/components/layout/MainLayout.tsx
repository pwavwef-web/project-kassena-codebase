import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
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
    label: 'Rewards',
    to: '/rewards',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Contribute',
    to: '/contributions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    to: '/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

const mobileNavItems = [
  navItems[0]!,
  navItems[3]!,
  {
    label: 'Learn',
    to: '/dictionary',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: 'Community',
    to: '/culture',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m10-5.13a4 4 0 11-8 0 4 4 0 018 0zm-8 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    label: 'Rewards',
    to: '/rewards',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12v8H4v-8m18-5H2v5h20V7zM12 7v13m0-13H8.5A2.5 2.5 0 1111 4.5L12 7zm0 0h3.5A2.5 2.5 0 1013 4.5L12 7z" />
      </svg>
    ),
  },
]

export const MainLayout = () => {
  const { appUser } = useAuth()
  const location = useLocation()
  const isRewardsRoute = location.pathname === '/rewards'
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
      <header className={`${isRewardsRoute ? 'hidden md:block' : ''} sticky top-0 z-50 border-b border-kassena-cream bg-white/80 backdrop-blur-md shadow-sm`}>
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
      <main className={isRewardsRoute ? 'mx-auto max-w-none px-0 py-0 animate-fade-in md:max-w-6xl md:px-4 md:py-6' : 'mx-auto max-w-6xl px-4 py-6 animate-fade-in'}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-3 left-4 right-4 z-50 flex items-center justify-around rounded-[24px] border border-kassena-cream bg-white/95 px-2 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur-lg shadow-[0_14px_38px_rgba(62,39,16,0.16)] md:hidden">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex min-w-[3.7rem] flex-col items-center gap-1 rounded-[18px] px-2 py-2 transition-all ${
                isActive 
                  ? 'bg-[#fff8ee] text-kassena-green shadow-[0_8px_20px_rgba(20,83,45,0.12)]' 
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
