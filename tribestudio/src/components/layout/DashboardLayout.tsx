import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

/** Two-pane workspace chrome: fixed sidebar + topbar, scrollable content. */
export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-surface text-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
