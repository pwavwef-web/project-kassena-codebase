import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const adminItems = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/submissions', label: 'Submissions' },
  { to: '/admin/uploads', label: 'Uploads' },
  { to: '/admin/dictionary', label: 'Dictionary' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/settings', label: 'Settings' },
]

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const renderAdminNav = () => (
    <nav className="space-y-2">
      {adminItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/admin'}
          onClick={() => setIsSidebarOpen(false)}
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-kassena-green text-white' : 'text-kassena-green hover:bg-kassena-cream'}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="space-y-4 md:grid md:grid-cols-[240px_1fr] md:gap-4 md:space-y-0">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-lg border border-kassena-cream bg-white px-4 py-3 text-sm font-semibold text-kassena-green shadow-sm md:hidden"
        aria-label="Open admin navigation"
        onClick={() => setIsSidebarOpen(true)}
      >
        <span className="flex flex-col gap-1">
          <span className="block h-0.5 w-5 bg-kassena-green" />
          <span className="block h-0.5 w-5 bg-kassena-green" />
          <span className="block h-0.5 w-5 bg-kassena-green" />
        </span>
        Admin menu
      </button>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-950/40 md:hidden">
          <aside className="h-full w-72 bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-kassena-green">
                Admin Panel
              </h2>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-lg border border-kassena-cream px-3 py-1.5 text-sm font-semibold text-kassena-green"
              >
                Close
              </button>
            </div>
            {renderAdminNav()}
          </aside>
        </div>
      ) : null}

      <aside className="hidden rounded-2xl border border-kassena-cream bg-white p-4 md:block">
        <h2 className="mb-3 text-base font-semibold text-kassena-green">
          Admin Panel
        </h2>
        {renderAdminNav()}
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  )
}
