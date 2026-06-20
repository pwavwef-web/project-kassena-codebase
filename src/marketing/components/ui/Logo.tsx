import { site } from '../../../content/site'

/**
 * Project Kasena logo: an original node-branch mark (language data branching
 * like a baobab) plus the wordmark. Pure SVG so it stays crisp and tiny.
 */
export const Logo = ({
  className = '',
  tone = 'dark',
  showWordmark = true,
}: {
  className?: string
  /** "dark" for light backgrounds, "light" for dark backgrounds. */
  tone?: 'dark' | 'light'
  showWordmark?: boolean
}) => {
  const wordmarkColor = tone === 'light' ? 'text-cream-100' : 'text-indigo-900'
  const subColor = tone === 'light' ? 'text-cream-200/70' : 'text-charcoal-muted'

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label={site.name}
    >
      <svg
        viewBox="0 0 40 40"
        width="36"
        height="36"
        className="shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pk-logo-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e365d" />
            <stop offset="100%" stopColor="#245c3b" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#pk-logo-bg)" />
        {/* node-branch glyph */}
        <g
          stroke="#d69b00"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M20 31 L20 21" />
          <path d="M20 23 L12 16" />
          <path d="M20 23 L28 16" />
          <path d="M20 21 L20 13" />
        </g>
        <g fill="#fbf7ee">
          <circle cx="20" cy="31" r="2.1" />
          <circle cx="12" cy="16" r="2.4" fill="#d69b00" />
          <circle cx="28" cy="16" r="2.4" fill="#d87a55" />
          <circle cx="20" cy="12" r="2.4" fill="#7bbb91" />
        </g>
      </svg>
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span
            className={`text-[0.62rem] font-semibold uppercase tracking-[0.24em] ${subColor}`}
          >
            Project
          </span>
          <span
            className={`font-display text-lg font-bold tracking-tight ${wordmarkColor}`}
          >
            Kasena
          </span>
        </span>
      ) : null}
    </span>
  )
}
