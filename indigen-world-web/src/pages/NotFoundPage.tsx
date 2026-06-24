import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start px-6 py-24">
      <p className="font-display text-sm uppercase tracking-[0.3em] text-terracotta">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold">Page not found</h1>
      <p className="mt-4 text-ink/70">
        This route does not exist in the starter shell yet.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-indigo px-6 py-3 text-sm font-medium text-cream"
      >
        Back home
      </Link>
    </section>
  )
}
