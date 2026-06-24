import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <section className="rounded-2xl bg-white p-6 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-kassena-green">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">
        The page you requested does not exist.
      </p>
      <Link
        to="/"
        className="mt-4 inline-block rounded-lg bg-kassena-orange px-4 py-2 text-white"
      >
        Return home
      </Link>
    </section>
  )
}
