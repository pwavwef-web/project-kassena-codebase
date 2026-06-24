/**
 * TribeStudio design tokens (starter). Keep in sync with tailwind.config.js.
 */
export const tokens = {
  color: {
    ink: '#0c172a',
    surface: '#f4f5f7',
    panel: '#ffffff',
    indigo: '#2d3a8c',
    terracotta: '#c0573b',
  },
  font: {
    sans: 'Inter, system-ui, sans-serif',
    display: 'Sora, Inter, system-ui, sans-serif',
  },
  radius: {
    md: '0.75rem',
    lg: '1rem',
    full: '9999px',
  },
} as const

export type Tokens = typeof tokens
