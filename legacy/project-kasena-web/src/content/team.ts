/**
 * Team content for the public website.
 *
 * IMPORTANT — HONESTY RULE:
 * Project Kasena does NOT invent people. No names, roles, bios or photos are
 * listed here unless and until a person's participation is confirmed and they
 * have consented to being named publicly. Every group below is intentionally an
 * EMPTY array by default, so the /team page renders no member cards until real,
 * confirmed members are added. The page is designed so that the empty state
 * reads as deliberate ("we are building the team") rather than broken.
 *
 * To add a confirmed member later, push a typed `TeamMember` into the relevant
 * group array. Do not add anyone without confirmation and consent.
 */

/** A single contributor to the project. Only added once confirmed + consented. */
export interface TeamMember {
  /** Full public-facing name (as the person consents to be listed). */
  name: string
  /** Their role on the project, e.g. "Language Validator". */
  role: string
  /** Which group they belong to (must match a key in `teamGroups`). */
  group: TeamGroupId
  /** Optional short bio. Keep factual; no invented credentials. */
  bio?: string
  /** Optional photo URL (only with the person's consent). */
  photoUrl?: string
  /** Optional public profile links (only those the person consents to share). */
  links?: TeamMemberLink[]
}

export interface TeamMemberLink {
  label: string
  url: string
}

/** Stable identifiers for the team groups. */
export type TeamGroupId =
  | 'leadership'
  | 'engineering'
  | 'languageValidators'
  | 'culturalAdvisers'
  | 'communityCoordinators'
  | 'contributors'
  | 'institutionalAdvisers'

/** Display metadata for a team group. */
export interface TeamGroup {
  id: TeamGroupId
  /** Section heading for the group. */
  title: string
  /** One-line description of what the group does. */
  description: string
  /** Glyph name (see Glyph component) used for the group's icon. */
  icon: string
  /** Confirmed, consented members. EMPTY by default — do not invent people. */
  members: TeamMember[]
}

/**
 * The team is organised into groups. ALL member arrays are empty by default
 * because real members are not yet confirmed. The page auto-hides any group
 * that has zero members, so by default no member cards are shown at all.
 */
export const teamGroups: TeamGroup[] = [
  {
    id: 'leadership',
    title: 'Leadership',
    description:
      'Stewards who hold the mission, set direction and stay accountable to the community.',
    icon: 'target',
    members: [],
  },
  {
    id: 'engineering',
    title: 'Engineering & product',
    description:
      'Builders shaping the dictionary, contribution and validation tools, and the data infrastructure underneath.',
    icon: 'data',
    members: [],
  },
  {
    id: 'languageValidators',
    title: 'Language validators',
    description:
      'Fluent speakers who review submissions for accuracy, spelling and dialect so the dataset stays trustworthy.',
    icon: 'shield',
    members: [],
  },
  {
    id: 'culturalAdvisers',
    title: 'Cultural advisers',
    description:
      'Elders and custodians who guide consent, attribution and what is appropriate to share publicly.',
    icon: 'leaf',
    members: [],
  },
  {
    id: 'communityCoordinators',
    title: 'Community coordinators',
    description:
      'Organisers who run data drives, support contributors and connect the project to schools and towns.',
    icon: 'community',
    members: [],
  },
  {
    id: 'contributors',
    title: 'Contributors',
    description:
      'Speakers, students and volunteers adding words, examples and recordings to the growing record.',
    icon: 'users',
    members: [],
  },
  {
    id: 'institutionalAdvisers',
    title: 'Institutional advisers',
    description:
      'Universities, educators and organisations offering guidance on research, governance and ethics.',
    icon: 'globe',
    members: [],
  },
]

/**
 * The roles the project is actively growing. This describes the SHAPE of the
 * team we are building — without naming any individual. Safe to show publicly
 * while the team is forming.
 */
export interface OpenRole {
  title: string
  /** What this person does and why it matters. */
  description: string
  icon: string
  /** A short, honest commitment expectation. */
  commitment: string
}

export const openRoles: OpenRole[] = [
  {
    title: 'Language validators',
    description:
      'Fluent Kasem speakers who check that new entries are accurate in meaning, spelling and dialect before they are published.',
    icon: 'shield',
    commitment: 'Flexible, review-based',
  },
  {
    title: 'Contributors',
    description:
      'Speakers, students and families who add words, example sentences and meanings — the backbone of the dataset.',
    icon: 'upload',
    commitment: 'Open to anyone',
  },
  {
    title: 'Cultural advisers',
    description:
      'Elders and custodians who advise on consent, attribution and what should — and should not — be shared publicly.',
    icon: 'leaf',
    commitment: 'Advisory, as available',
  },
  {
    title: 'Engineers & designers',
    description:
      'People who can help build and improve the tools: web, data pipelines, accessibility and design.',
    icon: 'data',
    commitment: 'Project-based',
  },
  {
    title: 'Community coordinators',
    description:
      'Organisers who run local data drives, support new contributors and link the project to schools and towns.',
    icon: 'community',
    commitment: 'Regional, ongoing',
  },
  {
    title: 'Researchers & institutional partners',
    description:
      'Universities and organisations who can guide responsible linguistics, governance and language-technology research.',
    icon: 'globe',
    commitment: 'Partnership-based',
  },
]

/**
 * The principles that govern how this page works. Surfaced on the page so the
 * empty-by-design state is clearly intentional.
 */
export const teamPrinciples: string[] = [
  'People are listed here only when their participation is confirmed and they consent to being named.',
  'We never invent contributors, advisers or endorsements to look bigger than we are.',
  'Cultural knowledge is shared with attribution and consent — and sacred or restricted material is kept off the public site.',
]

/** Short note explaining the deliberate empty state. */
export const teamRosterNote =
  'No public roster is shown yet. Team members appear here only once their participation is confirmed and they have consented to being named.'
