/**
 * Indigen World web design tokens (starter).
 * Keep this in sync with tailwind.config.js. The full legacy palette and type
 * scale are documented in docs/project-kasena-web/design-system.md.
 */
export const tokens = {
  color: {
    ink: '#0c172a',
    cream: '#f7f3ec',
    indigo: '#2d3a8c',
    terracotta: '#c0573b',
    gold: '#d8a44a',
  },
  font: {
    sans: 'Inter, system-ui, sans-serif',
    display: 'Sora, Inter, system-ui, sans-serif',
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    full: '9999px',
  },
} as const

export type Tokens = typeof tokens
