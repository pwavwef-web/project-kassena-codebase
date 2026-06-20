/**
 * Global, single-source-of-truth site configuration for the public website.
 *
 * Values marked `PLACEHOLDER` are safe defaults that should be confirmed with
 * the Project Kasena team before launch. Nothing here invents partnerships,
 * funding, statistics, or endorsements.
 */

export interface SiteContact {
  /** PLACEHOLDER — confirm the public-facing inbox before launch. */
  generalEmail: string
  partnershipsEmail: string
  pressEmail: string
  dataProtectionEmail: string
  /** General location; no private addresses or phone numbers. */
  location: string
}

export interface SocialLink {
  label: string
  /** Empty string => not rendered (avoids fake links). */
  url: string
  icon: string
}

export interface SiteConfig {
  name: string
  shortName: string
  legalName: string
  tagline: string
  description: string
  /** Canonical production origin (no trailing slash). */
  url: string
  /** Path to the default social preview image, relative to /public. */
  ogImage: string
  /** The route that launches the existing web application. */
  appLaunchPath: string
  contact: SiteContact
  social: SocialLink[]
}

export const site: SiteConfig = {
  name: 'Project Kasena',
  shortName: 'Kasena',
  legalName: 'Project Kasena',
  tagline: 'A language should not disappear from the future.',
  description:
    'Project Kasena is building the digital language infrastructure, verified datasets, educational tools, and future AI systems that will allow Kasem to thrive online.',
  url: 'https://kassena.azlearner.me',
  ogImage: '/social/og-default.svg',
  appLaunchPath: '/dictionary',
  contact: {
    // PLACEHOLDER addresses — replace with confirmed inboxes before launch.
    generalEmail: 'hello@projectkasena.org',
    partnershipsEmail: 'partners@projectkasena.org',
    pressEmail: 'media@projectkasena.org',
    dataProtectionEmail: 'data@projectkasena.org',
    location: 'Kasena-Nankana, Upper East Region, Ghana',
  },
  social: [
    // Add real URLs to enable. Empty url => the link is not rendered.
    { label: 'X (Twitter)', url: '', icon: 'x' },
    { label: 'LinkedIn', url: '', icon: 'globe' },
    { label: 'YouTube', url: '', icon: 'play' },
    { label: 'Instagram', url: '', icon: 'camera' },
  ],
}

/** Honest product-status vocabulary used across the site. */
export type ProductStatus =
  | 'available'
  | 'in-development'
  | 'planned'
  | 'research'

export const productStatusLabels: Record<ProductStatus, string> = {
  available: 'Available',
  'in-development': 'In development',
  planned: 'Planned',
  research: 'Research phase',
}

/** Honest data/metric labels — never present targets as achieved numbers. */
export type MetricKind =
  | 'current'
  | 'target'
  | 'pilot-target'
  | 'in-progress'

export const metricKindLabels: Record<MetricKind, string> = {
  current: 'Current verified count',
  target: 'Project target',
  'pilot-target': 'Pilot target',
  'in-progress': 'In progress',
}

export const allianceStatement =
  'Project Kasena builds the language engine. Indigen World builds the wider cultural experience.'
