import { Link } from 'react-router-dom'
import { footerColumns, legalNav } from '../../content/navigation'
import { allianceStatement, site } from '../../content/site'
import { NewsletterForm } from '../components/forms/NewsletterForm'
import { Logo } from '../components/ui/Logo'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

const statusPills = [
  'Building the Kasem language engine',
  'Community-powered',
  'Elder-validated',
  'AI-ready',
]

export const Footer = () => {
  const activeSocial = site.social.filter((s) => s.url.length > 0)

  return (
    <footer className="pk relative overflow-hidden bg-indigo-950 text-cream-100">
      <CulturalPatternLayer
        variant="weave"
        color="text-cream-100"
        opacity={0.04}
      />
      <div className="container relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div className="lg:pr-8">
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-cream-200/75">
              {site.description}
            </p>
            <div className="mt-6 max-w-sm">
              <NewsletterForm tone="dark" />
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-kente-300">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="pk-focus text-sm text-cream-200/75 transition-colors hover:text-cream-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Status pills */}
        <div className="mt-12 flex flex-wrap gap-2.5 border-t border-white/10 pt-8">
          {statusPills.map((pill) => (
            <span
              key={pill}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-cream-200/80"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-savannah-400" />
              {pill}
            </span>
          ))}
        </div>

        {/* Alliance statement */}
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-cream-200/70">
          <span className="font-semibold text-cream-100">In alliance: </span>
          {allianceStatement}{' '}
          <Link
            to="/alliance"
            className="pk-focus font-semibold text-kente-300 underline-offset-4 hover:underline"
          >
            Read about the alliance →
          </Link>
        </p>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-cream-200/60">
            © {new Date().getFullYear()} {site.legalName}. Cultural data is held
            in trust with the community.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalNav.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="pk-focus text-xs text-cream-200/60 transition-colors hover:text-cream-100"
              >
                {link.label}
              </Link>
            ))}
            {activeSocial.length > 0 ? (
              <div className="flex items-center gap-3">
                {activeSocial.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pk-focus text-xs text-cream-200/60 transition-colors hover:text-cream-100"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
