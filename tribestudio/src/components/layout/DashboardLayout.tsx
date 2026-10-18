import { Outlet, NavLink } from 'react-router-dom'
import { navGroups } from '../../data/studioData'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

const mobileItems = navGroups.flatMap((group) => group.items)

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-surface text-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <nav aria-label="Mobile workspace" className="flex gap-2 overflow-x-auto border-b border-ink/10 bg-panel px-4 py-3 md:hidden">
          {mobileItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isActive ? 'bg-indigo text-white' : 'bg-surface text-ink/65'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
