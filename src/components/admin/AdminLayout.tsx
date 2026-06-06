import { type ReactNode, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { isFirebaseConfigured } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'

type AdminIconName =
  | 'bell'
  | 'book'
  | 'clipboard'
  | 'globe'
  | 'home'
  | 'settings'
  | 'upload'
  | 'users'

interface AdminNavItem {
  to: string
  label: string
  icon: AdminIconName
  exact?: boolean
}

const adminItems: AdminNavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: 'home', exact: true },
  { to: '/admin/submissions', label: 'Contributions', icon: 'clipboard' },
  { to: '/admin/uploads', label: 'Uploads', icon: 'upload' },
  { to: '/admin/announcements', label: 'Announcements', icon: 'bell' },
  { to: '/admin/dictionary', label: 'Dictionary', icon: 'book' },
  { to: '/admin/users', label: 'Users', icon: 'users' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
  { to: '/', label: 'Back to Home', icon: 'globe' },
]

const getInitials = (name?: string) =>
  (name || 'TribeStudio')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const AdminIcon = ({
  name,
  className = 'h-5 w-5',
}: {
  name: AdminIconName
  className?: string
}) => {
  const commonProps = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2,
    viewBox: '0 0 24 24',
  }

  const paths: Record<AdminIconName, ReactNode> = {
    bell: (
      <>
        <path d="M15.5 17h4l-1.2-1.5a2.5 2.5 0 0 1-.5-1.5v-3a5.8 5.8 0 0 0-11.6 0v3a2.5 2.5 0 0 1-.5 1.5L4.5 17h4" />
        <path d="M9.7 19a2.7 2.7 0 0 0 4.6 0" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
      </>
    ),
    clipboard: (
      <>
        <path d="M9 5h6" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
        <path d="M8 3h8l1 2h2v16H5V5h2z" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 0 20" />
        <path d="M12 2a15.3 15.3 0 0 0 0 20" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v11h14V10" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1z" />
      </>
    ),
    upload: (
      <>
        <path d="M12 3v12" />
        <path d="m7 8 5-5 5 5" />
        <path d="M5 21h14" />
        <path d="M5 17v4" />
        <path d="M19 17v4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  }

  return <svg {...commonProps}>{paths[name]}</svg>
}

const BrandMark = () => (
  <span className="grid h-12 w-12 shrink-0 grid-cols-2 gap-1 rounded-lg border border-kassena-gold/50 bg-[#062f1d] p-1 shadow-lg shadow-black/20">
    <span className="rounded-sm border border-kassena-gold bg-kassena-orange/90" />
    <span className="rounded-sm border border-kassena-gold bg-kassena-green" />
    <span className="rounded-sm border border-kassena-gold bg-kassena-green" />
    <span className="rounded-sm border border-kassena-gold bg-kassena-gold" />
  </span>
)

export const AdminLayout = () => {
  const { appUser } = useAuth()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const initials = getInitials(appUser?.displayName)

  const isItemActive = (item: AdminNavItem) => {
    if (item.to === '/') {
      return false
    }

    if (item.exact) {
      return location.pathname === item.to
    }

    return location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
  }

  const renderAdminNav = () => (
    <nav className="space-y-1" aria-label="Admin navigation">
      {adminItems.map((item) => {
        const isActive = isItemActive(item)

        return (
          <Link
            key={`${item.to}-${item.label}`}
            to={item.to}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <AdminIcon name={item.icon} className="h-5 w-5 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col bg-gradient-to-b from-[#073b22] via-[#064227] to-[#022817] text-white">
      <div className="flex items-center gap-3 px-4 py-5">
        <BrandMark />
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">TribeStudio</p>
          <p className="text-xs font-medium text-white/75">Admin Dashboard</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        {renderAdminNav()}
      </div>

      <p className="px-4 pb-4 text-xs leading-5 text-white/70">
        TribeStudio admin workspace
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fffaf2] text-slate-900 md:flex">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-kassena-cream bg-white/95 px-4 py-3 shadow-sm backdrop-blur md:hidden">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-kassena-cream text-kassena-green"
          aria-label="Open admin navigation"
          onClick={() => setIsSidebarOpen(true)}
        >
          <span className="flex flex-col gap-1">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>
        <div className="min-w-0 px-3 text-center">
          <p className="truncate text-sm font-bold text-kassena-green">
            TribeStudio
          </p>
          <p className="text-xs text-slate-500">Operations Center</p>
        </div>
        {appUser?.photoURL ? (
          <img
            src={appUser.photoURL}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-kassena-green text-xs font-bold text-white">
            {initials}
          </span>
        )}
      </header>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-950/50 md:hidden">
          <button
            type="button"
            aria-label="Close admin navigation"
            className="absolute inset-0 h-full w-full"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="relative z-10 h-full w-[min(20rem,88vw)] shadow-2xl">
            {sidebar}
          </aside>
        </div>
      ) : null}

      <aside className="hidden h-screen w-64 shrink-0 md:sticky md:top-0 md:block">
        {sidebar}
      </aside>

      <section className="min-w-0 flex-1 overflow-x-hidden">
        {!isFirebaseConfigured ? (
          <div className="border-b border-amber-200 bg-amber-100 px-4 py-2 text-center text-xs text-amber-800">
            Firebase is not configured. Add values in .env.local to enable
            sign-in and data features.
          </div>
        ) : null}
        <Outlet />
      </section>
    </div>
  )
}
