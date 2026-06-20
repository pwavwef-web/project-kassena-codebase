import type { MetricKind } from './site'

export interface Audience {
  title: string
  description: string
  icon: string
}

/** Who the project serves. */
export const audiences: Audience[] = [
  {
    title: 'Kasem speakers & families',
    description:
      'A digital home for the language — for speakers today and the diaspora reconnecting from afar.',
    icon: 'community',
  },
  {
    title: 'Students & teachers',
    description:
      'Verified words, examples and future learning tools that support Kasem literacy in and out of school.',
    icon: 'book',
  },
  {
    title: 'Elders & cultural custodians',
    description:
      'A respectful way to pass on knowledge, with validation, attribution and consent built in.',
    icon: 'leaf',
  },
  {
    title: 'Researchers & universities',
    description:
      'Documented, governed datasets for responsible linguistics and language-technology research.',
    icon: 'analytics',
  },
  {
    title: 'Schools & communities',
    description:
      'Data drives and community mobilisation that turn local knowledge into shared infrastructure.',
    icon: 'users',
  },
  {
    title: 'Technology & cultural partners',
    description:
      'A trustworthy foundation for ethical AI, education and cultural collaboration.',
    icon: 'spark',
  },
]

export interface ImpactCategory {
  title: string
  description: string
}

export const impactCategories: ImpactCategory[] = [
  {
    title: 'Digital inclusion',
    description: 'Bringing an under-served language onto the internet on its own terms.',
  },
  {
    title: 'Language preservation',
    description: 'Capturing words, dialects and meaning before they fade.',
  },
  {
    title: 'Youth opportunities',
    description: 'Skills, recognition and roles for young contributors and validators.',
  },
  {
    title: 'Education',
    description: 'Verified material that teachers and learners can trust.',
  },
  {
    title: 'Research infrastructure',
    description: 'Governed datasets that responsible researchers can build on.',
  },
  {
    title: 'Diaspora reconnection',
    description: 'A bridge home for families living far from Kasena-Nankana.',
  },
]

export interface TargetMetric {
  id: string
  value: number
  prefix?: string
  suffix?: string
  label: string
  kind: MetricKind
  caption: string
}

/**
 * Headline figures shown on the marketing site. These are TARGETS, clearly
 * labelled as such. Live "current" counts are read from Firestore at runtime
 * (see usePublicStats) and never hard-coded here.
 */
export const targetMetrics: TargetMetric[] = [
  {
    id: 'entries',
    value: 20000,
    suffix: '+',
    label: 'Validated entries',
    kind: 'target',
    caption: 'Phase-1 dataset target (10,000–20,000 validated entries).',
  },
  {
    id: 'dialects',
    value: 5,
    suffix: '+',
    label: 'Dialect regions',
    kind: 'in-progress',
    caption: 'Navrongo, Paga, Chiana, Chuchuliga, Sandema and beyond.',
  },
  {
    id: 'phases',
    value: 3,
    label: 'AI roadmap phases',
    kind: 'in-progress',
    caption: 'Foundation → conversational → voice.',
  },
]
