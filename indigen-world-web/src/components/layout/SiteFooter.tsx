import { Link } from 'react-router-dom'
import { footerGroups } from '../../content/siteData'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink/10 bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_1.8fr]">
        <div>
          <p className="font-display text-xl font-semibold">Indigen World</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-cream/65">
            A cultural technology ecosystem. Project Kasena is the flagship
            Kasem-language programme inside the wider Indigen World platform.
          </p>
          <p className="mt-4 rounded-lg border border-cream/15 bg-cream/10 p-3 text-xs leading-5 text-cream/70">
            MVP status: local demo data, no production payment processing, no
            production Firebase writes and no external AI calls.
          </p>
        </div>
        <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-cream">{group.title}</h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link className="text-sm text-cream/60 hover:text-cream" to={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {year} Indigen World.</p>
          <p>Draft legal and cultural-data policies require owner review.</p>
        </div>
      </div>
    </footer>
  )
}
