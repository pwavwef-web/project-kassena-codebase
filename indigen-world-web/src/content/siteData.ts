export type ContentTier = 'Open' | 'Restricted' | 'Sensitive'
export type ProgrammeStatus = 'Active demo' | 'MVP scaffold' | 'Roadmap item'

export interface NavItem {
  label: string
  href: string
}

export interface Programme {
  title: string
  status: ProgrammeStatus
  summary: string
  details: string[]
}

export interface CulturalRecord {
  id: string
  type: 'Story' | 'Proverb' | 'Oral history' | 'Heritage location'
  title: string
  summary: string
  tier: ContentTier
  classification: string
  attribution: string
  source: string
  permittedUses: string
}

export interface DictionaryEntry {
  english: string
  kasem: string
  partOfSpeech: string
  dialect: string
  example: string
  source: string
  tier: ContentTier
}

export interface UpdateArticle {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  body: string[]
}

export const primaryNav: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Programmes', href: '/programmes' },
  { label: 'Communities', href: '/communities' },
  { label: 'Languages', href: '/languages' },
  { label: 'Stories', href: '/stories' },
  { label: 'Impact', href: '/impact' },
  { label: 'Contribute', href: '/contribute' },
  { label: 'Support', href: '/support' },
]

export const footerGroups = [
  {
    title: 'Ecosystem',
    links: [
      { label: 'Programmes', href: '/programmes' },
      { label: 'Communities', href: '/communities' },
      { label: 'Languages', href: '/languages' },
      { label: 'Stories', href: '/stories' },
    ],
  },
  {
    title: 'Take part',
    links: [
      { label: 'Contribute', href: '/contribute' },
      { label: 'Partners', href: '/partners' },
      { label: 'Support', href: '/support' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Governance',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cultural data', href: '/cultural-data' },
    ],
  },
]

export const heroImage = '/images/mission-carousel/01-oral-heritage.jpg'

export const missionImages = [
  {
    src: '/images/mission-carousel/02-dictionary-builders.jpg',
    alt: 'Demo visual for dictionary building work',
    caption: 'Language data, reviewed before publication',
  },
  {
    src: '/images/mission-carousel/03-community-validation.jpg',
    alt: 'Demo visual for community validation work',
    caption: 'Community validation and consent checks',
  },
  {
    src: '/images/mission-carousel/04-learning-tools.jpg',
    alt: 'Demo visual for learning tools',
    caption: 'Learning tools for everyday discovery',
  },
]

export const valueProps = [
  'Community-owned language preservation tools',
  'Consent-aware cultural data governance',
  'Creator and validator workflows for trusted contributions',
  'AI-ready scaffolding with human review before model use',
]

export const homeHighlights = {
  mission:
    'Indigen World helps communities preserve language, stories and heritage through digital tools that keep consent, attribution and cultural stewardship at the centre.',
  flagship:
    'Project Kasena is the flagship Kasem-language programme inside Indigen World. It focuses on dictionary work, translation examples, oral-history preservation and AI-readiness with community review.',
}

export const programmes: Programme[] = [
  {
    title: 'Project Kasena',
    status: 'Active demo',
    summary:
      'The flagship Kasem language programme for dictionary entries, translation examples, oral-history preservation and responsible data preparation.',
    details: [
      'Kasem is the only active flagship programme represented in this MVP.',
      'All sample records are marked as demo or placeholder content.',
      'Validator and consent workflows are shown before publication.',
    ],
  },
  {
    title: 'Language preservation',
    status: 'MVP scaffold',
    summary:
      'Reusable workflows for lexical entries, sentence pairs, dialect notes and review status.',
    details: [
      'Designed for future community teams after governance approval.',
      'Supports source, dialect, consent, licence and validation metadata.',
    ],
  },
  {
    title: 'Oral-history preservation',
    status: 'MVP scaffold',
    summary:
      'Structured records for public summaries, attribution, content tier and takedown status.',
    details: [
      'Restricted and sensitive tiers are visible as governance concepts only.',
      'No sacred or private cultural information is included.',
    ],
  },
  {
    title: 'Storytelling and cultural education',
    status: 'MVP scaffold',
    summary:
      'Story cards, proverb cards and educational pathways that separate public learning material from restricted cultural content.',
    details: [
      'Age suitability and permitted use fields are included in data models.',
      'Creators can draft content; validators approve before publishing.',
    ],
  },
  {
    title: 'Creator empowerment',
    status: 'MVP scaffold',
    summary:
      'TribeStudio supports contributors, creators, validators, elders and administrators with local demo workflows.',
    details: [
      'No real payouts or production Firebase connections are active.',
      'Rewards and campaigns are demonstration interfaces only.',
    ],
  },
  {
    title: 'Digital heritage archive',
    status: 'MVP scaffold',
    summary:
      'A future-friendly structure for heritage locations, artefact notes and media metadata.',
    details: [
      'Publication requires consent status and content classification.',
      'Sensitive records should remain private until reviewed by custodians.',
    ],
  },
  {
    title: 'Cultural tourism and immersive experiences',
    status: 'Roadmap item',
    summary:
      'Future concepts for respectful discovery experiences, clearly separated from the MVP.',
    details: [
      'Not active, not funded here, and not represented as a current partnership.',
      'Would require community governance before any public launch.',
    ],
  },
]

export const communities = [
  {
    name: 'Kasena / Kasem',
    status: 'Flagship programme',
    summary:
      'The MVP focuses on Project Kasena as the first Kasem-language programme inside Indigen World.',
    governance:
      'Community-specific governance, validator requirements and consent checks must be completed before publication.',
  },
  {
    name: 'Future community teams',
    status: 'Expansion framework',
    summary:
      'The platform is structured for future language teams, but no unsupported communities are claimed as active.',
    governance:
      'Each future team needs named governance, validator criteria, consent principles and takedown processes before launch.',
  },
]

export const validatorRequirements = [
  'Confirmed language or cultural expertise for the relevant community',
  'Agreement to review source, dialect, consent and sensitivity metadata',
  'Ability to request revision rather than approve uncertain records',
  'Escalation path to elders or cultural custodians for restricted material',
]

export const consentRequirements = [
  'Contributor consent for submission and storage',
  'Source consent for elder-sourced or personal cultural material',
  'Clear licence and permitted-use fields on every cultural record',
  'Takedown and correction channels visible on public pages',
]

export const dictionaryPreview: DictionaryEntry[] = [
  {
    english: 'water',
    kasem: 'koom',
    partOfSpeech: 'noun',
    dialect: 'Kasem demo dialect note',
    example: 'Unverified demo sentence for learning UI only.',
    source: 'Unverified Demo Data',
    tier: 'Open',
  },
  {
    english: 'thank you',
    kasem: 'baarika',
    partOfSpeech: 'phrase',
    dialect: 'Kasem demo dialect note',
    example: 'Placeholder example awaiting community validation.',
    source: 'Demo Contributor',
    tier: 'Open',
  },
  {
    english: 'story',
    kasem: 'demo story word',
    partOfSpeech: 'noun',
    dialect: 'Needs validator confirmation',
    example: 'Sample entry demonstrates metadata, not final language authority.',
    source: 'Unverified Demo Data',
    tier: 'Open',
  },
]

export const culturalRecords: CulturalRecord[] = [
  {
    id: 'placeholder-story',
    type: 'Story',
    title: 'Placeholder Story: A learning journey',
    summary:
      'A demonstration story card showing how public summaries, attribution and consent metadata appear.',
    tier: 'Restricted',
    classification: 'Story card, public summary only',
    attribution: 'Demo Contributor',
    source: 'Unverified Demo Data',
    permittedUses: 'Educational preview after review',
  },
  {
    id: 'sample-proverb',
    type: 'Proverb',
    title: 'Sample Proverb Card',
    summary:
      'A proverb interface placeholder. The proverb text is omitted until community-approved content is available.',
    tier: 'Restricted',
    classification: 'Proverb metadata demonstration',
    attribution: 'Sample Validator',
    source: 'Example Community review queue',
    permittedUses: 'Display after validator approval',
  },
  {
    id: 'oral-history-placeholder',
    type: 'Oral history',
    title: 'Oral-history placeholder',
    summary:
      'A record shape for elder-sourced narratives with consent, age suitability and review history.',
    tier: 'Sensitive',
    classification: 'Private until custodian approval',
    attribution: 'Source withheld in demo',
    source: 'No real interview attached',
    permittedUses: 'Not publishable in demo state',
  },
  {
    id: 'heritage-location-placeholder',
    type: 'Heritage location',
    title: 'Heritage location card',
    summary:
      'A location card for public heritage education. Exact non-public locations should never be exposed without consent.',
    tier: 'Sensitive',
    classification: 'Location metadata placeholder',
    attribution: 'Demo Contributor',
    source: 'Unverified Demo Data',
    permittedUses: 'Public summary only after review',
  },
]

export const impactMetrics = [
  {
    label: 'Flagship programme',
    value: '1',
    qualifier: 'Demonstration metric',
    note: 'Project Kasena is the only active flagship programme shown in this MVP.',
  },
  {
    label: 'Contribution workflows',
    value: '9',
    qualifier: 'Demo interface count',
    note: 'Word, sentence, proverb, story, note, oral history, lesson, image collection and artisan profile.',
  },
  {
    label: 'Production AI calls',
    value: '0',
    qualifier: 'Implementation confirmation',
    note: 'AI providers are scaffolded only; no live calls are made by this MVP.',
  },
  {
    label: 'Payment processing',
    value: '0',
    qualifier: 'Placeholder only',
    note: 'Support UI is local and does not process donations.',
  },
]

export const contributionPathways = [
  'Submit language data',
  'Contribute stories',
  'Become a creator',
  'Become a validator',
  'Join a community language team',
]

export const partnerPathways = [
  {
    title: 'Research and education',
    text: 'Discuss ethical collaboration on language learning, curriculum, dataset preparation or evaluation.',
  },
  {
    title: 'Community programme support',
    text: 'Explore sponsorship or institutional support without implying endorsement before agreement.',
  },
  {
    title: 'Technology collaboration',
    text: 'Help build tools for review queues, offline access, accessibility, or consent-aware archives.',
  },
]

export const updates: UpdateArticle[] = [
  {
    slug: 'mvp-scaffold-note',
    title: 'MVP scaffold note',
    date: '2026-06-24',
    category: 'Build note',
    excerpt:
      'A local fixture article explaining what the Indigen World MVP demonstrates without claiming production launch.',
    body: [
      'This update is fixture content for the local MVP. It describes the shape of the public website, TribeStudio and mobile app without representing a production announcement.',
      'The repository keeps Project Kasena as the flagship Kasem-language programme while introducing Indigen World as the umbrella ecosystem.',
      'All data shown in this MVP is local, labelled demonstration content. Production Firebase, payments and AI providers remain inactive.',
    ],
  },
  {
    slug: 'cultural-data-governance-draft',
    title: 'Cultural data governance draft',
    date: '2026-06-24',
    category: 'Governance',
    excerpt:
      'A placeholder article for consent, correction, takedown and cultural content classification principles.',
    body: [
      'The governance model separates open, restricted and sensitive content. Each cultural record should carry language, dialect, community, source, contributor, validator, consent, licence and permitted-use metadata.',
      'Restricted and sensitive records require human review before publication or AI use. The MVP does not include sacred, private or disputed cultural information.',
      'This page is a draft for review by project owners, community representatives and legal advisors.',
    ],
  },
]

export const legalDrafts = {
  privacy: {
    title: 'Privacy draft',
    body: [
      'This placeholder explains the intended privacy posture for Indigen World. It is not legal advice and must be reviewed before production launch.',
      'The MVP uses local demo data only. Future production systems should document account data, contribution metadata, media storage, analytics and retention periods.',
      'Private profiles, consent records and sensitive cultural media should be protected by authentication, role-based access and audit logging.',
    ],
  },
  terms: {
    title: 'Terms draft',
    body: [
      'These draft terms describe expected platform use, contribution rules and moderation principles for future review.',
      'Contributors should submit only material they have permission to share and should respect community-specific restrictions.',
      'Rewards, sponsorships and donation interfaces in this MVP are placeholders and do not create payment or payout obligations.',
    ],
  },
  culturalData: {
    title: 'Cultural data governance draft',
    body: [
      'Cultural records should be classified as Open, Restricted or Sensitive before publication or downstream use.',
      'Correction, takedown and consent withdrawal channels must remain visible and respected.',
      'AI-training permission and commercial-use permission should be explicit fields, not assumptions.',
    ],
  },
}

export const culturalTiers = [
  {
    tier: 'Open' as ContentTier,
    examples: 'Ordinary dictionary words, approved educational phrases, public learning materials.',
  },
  {
    tier: 'Restricted' as ContentTier,
    examples: 'Proverbs, oral histories, stories, cultural symbols, performances, elder-sourced knowledge.',
  },
  {
    tier: 'Sensitive' as ContentTier,
    examples:
      'Sacred knowledge, disputed history, private cultural practices, personal stories, content involving minors, non-public locations.',
  },
]
