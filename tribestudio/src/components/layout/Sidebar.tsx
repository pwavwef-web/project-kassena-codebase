import { NavLink } from 'react-router-dom'
import { navGroups } from '../../data/studioData'

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink/10 bg-panel md:flex">
      <div className="px-5 py-5">
        <span className="font-display text-lg font-semibold">
          Tribe<span className="text-terracotta">Studio</span>
        </span>
        <p className="mt-1 text-xs text-ink/45">Indigen World workspace</p>
      </div>
      <nav aria-label="Workspace" className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {navGroups.map((section) => (
          <div key={section.label}>
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-ink/40">
              {section.label}
            </p>
            <ul className="mt-1 space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `block rounded-lg px-2 py-2 text-sm font-medium transition ${
                        isActive ? 'bg-indigo text-white' : 'text-ink/70 hover:bg-surface hover:text-ink'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
