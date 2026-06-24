import { Link } from 'react-router-dom'

// Placeholder navigation. Real nav items live in content modules in the
// full build — see legacy/project-kasena-web/src/content/navigation.ts.
const NAV_ITEMS = [
  { label: 'About', href: '/' },
  { label: 'Project Kasena', href: '/' },
  { label: 'Impact', href: '/' },
  { label: 'Contact', href: '/' },
]

export function SiteHeader() {
  return (
    <header className="border-b border-ink/10 bg-cream/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-lg font-semibold tracking-tight">
          Indigen<span className="text-terracotta"> World</span>
        </Link>
        <nav aria-label="Primary" className="hidden gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-sm text-ink/70 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
