/** Navigation model for the public marketing site. */

export interface NavChild {
  label: string
  to: string
  description?: string
  icon?: string
}

export interface NavItem {
  label: string
  to?: string
  /** When present, the item renders as a grouped menu (desktop) / section (mobile). */
  children?: NavChild[]
}

export const primaryNav: NavItem[] = [
  {
    label: 'About',
    to: '/about',
  },
  {
    label: 'What we build',
    children: [
      {
        label: 'What we are building',
        to: '/build',
        description: 'The Project Kasena product ecosystem',
        icon: 'data',
      },
      {
        label: 'How it works',
        to: '/how-it-works',
        description: 'From a word to a verified dataset',
        icon: 'refresh',
      },
      {
        label: 'AI & data roadmap',
        to: '/ai-data',
        description: 'Three phases to Kasem voice AI',
        icon: 'spark',
      },
    ],
  },
  {
    label: 'Impact',
    children: [
      {
        label: 'Community & impact',
        to: '/impact',
        description: 'Who the project serves',
        icon: 'community',
      },
      {
        label: 'Culture & heritage',
        to: '/heritage',
        description: 'An editorial cultural archive',
        icon: 'leaf',
      },
      {
        label: 'Transparency & reports',
        to: '/transparency',
        description: 'Milestones, policies and public documents',
        icon: 'shield',
      },
    ],
  },
  {
    label: 'Alliance',
    to: '/alliance',
  },
  {
    label: 'Partner',
    children: [
      {
        label: 'Partners & collaborate',
        to: '/partners',
        description: 'Pathways for institutions and individuals',
        icon: 'users',
      },
      {
        label: 'Team',
        to: '/team',
        description: 'The people building Project Kasena',
        icon: 'user',
      },
      {
        label: 'Contact',
        to: '/contact',
        description: 'Start a conversation',
        icon: 'send',
      },
    ],
  },
  {
    label: 'Updates',
    to: '/updates',
  },
]

/** Footer link columns. */
export interface FooterColumn {
  title: string
  links: { label: string; to: string }[]
}

export const footerColumns: FooterColumn[] = [
  {
    title: 'Project',
    links: [
      { label: 'About', to: '/about' },
      { label: 'What we build', to: '/build' },
      { label: 'How it works', to: '/how-it-works' },
      { label: 'AI & data roadmap', to: '/ai-data' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Community & impact', to: '/impact' },
      { label: 'Culture & heritage', to: '/heritage' },
      { label: 'Indigen World alliance', to: '/alliance' },
      { label: 'Updates', to: '/updates' },
    ],
  },
  {
    title: 'Get involved',
    links: [
      { label: 'Partner with us', to: '/partners' },
      { label: 'Support the work', to: '/support' },
      { label: 'Team', to: '/team' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Governance',
    links: [
      { label: 'Transparency & reports', to: '/transparency' },
      { label: 'Community data governance', to: '/legal/data-governance' },
      { label: 'Privacy policy', to: '/legal/privacy' },
      { label: 'Cultural content policy', to: '/legal/cultural-content' },
    ],
  },
]

export const legalNav: { label: string; to: string }[] = [
  { label: 'Privacy', to: '/legal/privacy' },
  { label: 'Terms', to: '/legal/terms' },
  { label: 'Accessibility', to: '/legal/accessibility' },
  { label: 'Correction & takedown', to: '/legal/takedown' },
]
