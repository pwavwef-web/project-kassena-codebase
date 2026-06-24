import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const DashboardPage = () => {
  const { appUser } = useAuth()

  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-kassena-green">
        Welcome back, {appUser?.displayName}
      </h1>
      <p className="text-sm text-slate-600">
        Continue collecting, reviewing and preserving Kasem language knowledge.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/submit"
          className="rounded-lg bg-kassena-orange px-4 py-2 text-white"
        >
          Submit contribution
        </Link>
        <Link
          to="/uploads"
          className="rounded-lg bg-kassena-green px-4 py-2 text-white"
        >
          Upload document
        </Link>
        {(appUser?.role === 'admin' || appUser?.role === 'validator') && (
          <Link
            to="/admin"
            className="rounded-lg border border-kassena-gold px-4 py-2 text-kassena-green"
          >
            Open admin panel
          </Link>
        )}
      </div>
    </section>
  )
}
