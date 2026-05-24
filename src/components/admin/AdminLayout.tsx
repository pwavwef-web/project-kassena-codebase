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
  return (
    <div className="grid gap-4 md:grid-cols-[240px_1fr]">
      <aside className="rounded-2xl border border-kassena-cream bg-white p-4">
        <h2 className="mb-3 text-base font-semibold text-kassena-green">
          Admin Panel
        </h2>
        <nav className="space-y-2">
          {adminItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-kassena-green text-white' : 'text-kassena-green hover:bg-kassena-cream'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  )
}
