/**
 * Lightweight inline line-icons for the marketing site. Pure SVG keyed by name
 * so there are no per-icon network requests and they inherit currentColor.
 */
const paths: Record<string, string> = {
  book: 'M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2zM18 3v18',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18',
  upload: 'M12 16V4M7 9l5-5 5 5M5 20h14',
  shield: 'M12 3l7 3v6c0 5-3 7-7 9-4-2-7-4-7-9V6z M9 12l2 2 4-4',
  data: 'M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  reward: 'M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM9 13l-2 8 5-3 5 3-2-8',
  trophy: 'M7 4h10v4a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 18h6M10 14v4M14 14v4',
  leaf: 'M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19c4-4 8-7 12-9',
  analytics: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  spark: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
  microphone: 'M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  speaker: 'M4 9v6h4l5 4V5L8 9zM16 9a3 3 0 0 1 0 6M18 7a6 6 0 0 1 0 10',
  community:
    'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 6-5s6 2 6 5M16 14c2 0 5 1 5 4',
  users:
    'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 6-5s6 2 6 5M16 6a3 3 0 1 1 1 6',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  refresh: 'M4 12a8 8 0 0 1 14-5M20 12a8 8 0 0 1-14 5M18 3v4h-4M6 21v-4h4',
  heart: 'M12 21C5 16 3 11 3 8a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 3-2 8-9 13z',
  check: 'M5 13l4 4L19 7',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01',
  sparkles: 'M12 3v6M9 6h6M6 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM17 13l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z',
}

export const Glyph = ({
  name,
  className = 'h-6 w-6',
  strokeWidth = 1.7,
}: {
  name: string
  className?: string
  strokeWidth?: number
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
    role="presentation"
  >
    <path
      d={paths[name] ?? paths.spark}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
