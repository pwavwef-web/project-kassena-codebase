import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-start">
      <h1 className="font-display text-2xl font-semibold">Not found</h1>
      <p className="mt-2 text-sm text-ink/60">
        This workspace area is not part of the TribeStudio MVP route map.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-md bg-indigo px-4 py-2 text-sm font-medium text-white"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
