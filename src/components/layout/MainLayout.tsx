import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { isFirebaseConfigured } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'
import { AppIcon } from '../common/AppIcon'

const navIcon = (name: string, className = 'h-5 w-5') => (
  <AppIcon name={name} className={className} />
)

const navItems = [
  {
    label: 'Home',
    to: '/',
    icon: navIcon('home'),
  },
  {
    label: 'Dictionary',
    to: '/dictionary',
    icon: navIcon('book'),
  },
  {
    label: 'Rewards',
    to: '/rewards',
    icon: navIcon('reward'),
  },
  {
    label: 'Contribute',
    to: '/contributions',
    icon: navIcon('upload'),
  },
  {
    label: 'Profile',
    to: '/profile',
    icon: navIcon('user'),
  },
]

const mobileNavItems = [
  {
    label: 'Home',
    to: '/',
    icon: navIcon('home', 'h-8 w-8'),
  },
  {
    label: 'Contribute',
    to: '/contributions',
    icon: navIcon('upload', 'h-8 w-8'),
  },
  {
    label: 'Learn',
    to: '/dictionary',
    icon: navIcon('book', 'h-8 w-8'),
  },
  {
    label: 'Community',
    to: '/culture',
    icon: navIcon('community', 'h-8 w-8'),
  },
  {
    label: 'Rewards',
    to: '/rewards',
    icon: navIcon('gift', 'h-8 w-8'),
  },
]

export const MainLayout = () => {
  const { appUser } = useAuth()
  const location = useLocation()
  const isHomeRoute = location.pathname === '/'
  const isRewardsRoute = location.pathname === '/rewards'
  const isLeaderboardRoute = location.pathname === '/leaderboard'
  const isProfileRoute = location.pathname === '/profile'
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isImmersiveMobileRoute = isRewardsRoute || isLeaderboardRoute
  const mainClassName = isAdminRoute
    ? 'max-w-none px-0 py-0 animate-fade-in'
    : isRewardsRoute
      ? 'mx-auto max-w-none px-0 py-0 animate-fade-in md:max-w-6xl md:px-4 md:py-6'
      : isLeaderboardRoute
        ? 'mx-auto max-w-none px-4 py-5 animate-fade-in md:max-w-6xl md:px-4 md:py-6'
        : isHomeRoute || isProfileRoute
          ? 'mx-auto max-w-6xl px-3 py-3 animate-fade-in sm:px-4 sm:py-5 md:px-4 md:py-6'
          : 'mx-auto max-w-6xl px-4 py-6 animate-fade-in'
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
      <header className={`${isAdminRoute ? 'hidden' : isImmersiveMobileRoute || isHomeRoute || isProfileRoute ? 'hidden md:block' : ''} sticky top-0 z-50 border-b border-kassena-cream bg-white/80 backdrop-blur-md shadow-sm`}>
        {!isFirebaseConfigured ? (
          <div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-800">
            Firebase is not configured. Add values in .env.local to enable
            sign-in and data features.
          </div>
        ) : null}
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-kassena-green flex items-center gap-2">
            <span className="bg-gradient-to-r from-kassena-green to-kassena-orange bg-clip-text text-transparent">
              TribeStudio
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
      <main className={mainClassName}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className={`${isAdminRoute ? 'hidden' : 'fixed'} bottom-3 left-4 right-4 z-50 flex items-center justify-around rounded-[24px] border border-kassena-cream bg-white/95 px-2 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur-lg shadow-[0_14px_38px_rgba(62,39,16,0.16)] md:hidden`}>
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className={({ isActive }) =>
              `flex h-14 w-12 items-center justify-center rounded-[18px] px-2 py-2 transition-all sm:w-14 ${
                isActive
                  ? 'bg-[#fff8ee] text-kassena-green shadow-[0_8px_20px_rgba(20,83,45,0.12)]'
                  : 'text-slate-500 hover:text-kassena-green hover:bg-slate-50'
              }`
            }
          >
            {item.icon}
            <span className="sr-only">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
