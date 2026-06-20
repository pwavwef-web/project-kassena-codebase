import type { ProductStatus } from './site'

/**
 * Content for the Project Kasena × Indigen World alliance page (/alliance).
 *
 * This describes a DISCIPLINED STRATEGIC ALLIANCE — two aligned but separately
 * governed projects — NOT a merger. Nothing here exposes confidential
 * negotiations, disagreements, legal drafts, or private financial arrangements,
 * and nothing claims funding, endorsements, or operational AI.
 *
 * The single approved public framing lives in `allianceStatement` in
 * `content/site.ts`:
 *   "Project Kasena builds the language engine.
 *    Indigen World builds the wider cultural experience."
 */

/** The two parties in the alliance, used for the page intro and headers. */
export interface AllianceParty {
  id: 'kasena' | 'indigen'
  name: string
  role: string
  /** One-line summary of what this party is responsible for. */
  focus: string
  /** Closest matching Glyph name. */
  icon: string
}

export const allianceParties: AllianceParty[] = [
  {
    id: 'kasena',
    name: 'Project Kasena',
    role: 'The language engine',
    focus:
      'Kasem language data, validation, translation and the AI infrastructure beneath it.',
    icon: 'data',
  },
  {
    id: 'indigen',
    name: 'Indigen World',
    role: 'The cultural experience',
    focus:
      'Storytelling, diaspora engagement, cultural learning, distribution and future cultural commerce.',
    icon: 'globe',
  },
]

/**
 * A single "who does what" responsibility, mapped to exactly one party so the
 * boundary between the two projects stays legible. `note` adds an honest caveat
 * where a capability is future-facing rather than operational.
 */
export interface AllianceResponsibility {
  /** Which party owns this responsibility. */
  party: 'kasena' | 'indigen'
  title: string
  description: string
  /** Closest matching Glyph name. */
  icon: string
  /** Optional honest status note (e.g. future capability). */
  note?: string
}

export const allianceResponsibilities: AllianceResponsibility[] = [
  // ---- Project Kasena: the language engine ----
  {
    party: 'kasena',
    title: 'Language data & validation',
    description:
      'Collecting Kasem words, dialects and examples, then putting every entry through community and elder validation before it is published.',
    icon: 'shield',
  },
  {
    party: 'kasena',
    title: 'Translation infrastructure',
    description:
      'Dictionaries, translation tools and the structured data formats that make Kasem usable by software, not just readable on a page.',
    icon: 'refresh',
  },
  {
    party: 'kasena',
    title: 'Governed datasets',
    description:
      'Documented, consent-aware datasets with clear provenance, designed for responsible research and language technology.',
    icon: 'data',
  },
  {
    party: 'kasena',
    title: 'AI foundations',
    description:
      'The verified data layer that future Kasem AI would be built on — kept in a research and planning stage, never presented as a live capability.',
    icon: 'spark',
    note: 'Future AI is research / planned, not operational.',
  },
  // ---- Indigen World: the cultural experience ----
  {
    party: 'indigen',
    title: 'Storytelling & cultural content',
    description:
      'Bringing language to life through narrative, media and experiences that make heritage feel present rather than archived.',
    icon: 'speaker',
  },
  {
    party: 'indigen',
    title: 'Diaspora engagement',
    description:
      'Connecting families living far from Kasena-Nankana back to their language and culture through accessible, welcoming entry points.',
    icon: 'community',
  },
  {
    party: 'indigen',
    title: 'Cultural learning',
    description:
      'Learning journeys and educational experiences that build on validated language material without altering or owning it.',
    icon: 'book',
  },
  {
    party: 'indigen',
    title: 'Distribution & future commerce',
    description:
      'Reaching wider audiences and exploring ethical cultural commerce — always within agreed boundaries on what data may and may not be used.',
    icon: 'globe',
    note: 'Future cultural commerce is planned, not active.',
  },
]

/**
 * The layered ecosystem, rendered as a stacked CSS/SVG diagram on the page.
 * Order matters: it reads from the foundation (community governance) upward to
 * future ethical commerce. Each layer names its primary steward so the
 * governance and data boundaries stay explicit.
 */
export interface EcosystemLayer {
  id: string
  /** Display order, 1 = foundation. */
  order: number
  title: string
  description: string
  /** Which project (or shared) is primarily responsible for this layer. */
  steward: 'Community' | 'Project Kasena' | 'Indigen World' | 'Shared'
  /** Closest matching Glyph name. */
  icon: string
  /** Tailwind classes for the layer accent (kept on-palette). */
  accent: string
}

export const ecosystemLayers: EcosystemLayer[] = [
  {
    id: 'governance',
    order: 1,
    title: 'Community governance',
    description:
      'The foundation. Speakers, elders and cultural custodians set the rules for consent, attribution and what may be shared.',
    steward: 'Community',
    icon: 'shield',
    accent: 'from-indigo-800 to-indigo-700',
  },
  {
    id: 'language',
    order: 2,
    title: 'Language infrastructure',
    description:
      'Validated Kasem data, dictionaries and translation tools — the engine Project Kasena builds and maintains.',
    steward: 'Project Kasena',
    icon: 'data',
    accent: 'from-indigo-700 to-savannah-700',
  },
  {
    id: 'content',
    order: 3,
    title: 'Content experience',
    description:
      'Storytelling and media that turn language into living culture, built by Indigen World on top of validated material.',
    steward: 'Indigen World',
    icon: 'speaker',
    accent: 'from-savannah-700 to-savannah-600',
  },
  {
    id: 'distribution',
    order: 4,
    title: 'Distribution',
    description:
      'Reaching speakers and the diaspora wherever they are, through the channels Indigen World operates.',
    steward: 'Indigen World',
    icon: 'globe',
    accent: 'from-savannah-600 to-terracotta-600',
  },
  {
    id: 'education',
    order: 5,
    title: 'Education',
    description:
      'Learning journeys and teaching material that both projects support, drawing only on validated, consented data.',
    steward: 'Shared',
    icon: 'book',
    accent: 'from-terracotta-600 to-terracotta-500',
  },
  {
    id: 'research',
    order: 6,
    title: 'Research',
    description:
      'Responsible study of the governed datasets, with provenance and consent preserved at every step.',
    steward: 'Project Kasena',
    icon: 'analytics',
    accent: 'from-terracotta-500 to-kente-600',
  },
  {
    id: 'commerce',
    order: 7,
    title: 'Future ethical commerce',
    description:
      'Possible, carefully bounded cultural commerce that returns value to the community — planned, not active.',
    steward: 'Indigen World',
    icon: 'reward',
    accent: 'from-kente-600 to-kente-500',
  },
]

/**
 * The principles that keep the alliance disciplined. These describe boundaries
 * and governance — not contracts, money, or private terms.
 */
export interface AlliancePrinciple {
  title: string
  description: string
  icon: string
}

export const alliancePrinciples: AlliancePrinciple[] = [
  {
    title: 'Clear governance',
    description:
      'Each project keeps its own decision-making. Alignment does not mean one party speaks for the other.',
    icon: 'shield',
  },
  {
    title: 'Hard data boundaries',
    description:
      'Community-controlled cultural data is not treated as unrestricted commercial content. What can be used, and how, is defined and respected.',
    icon: 'data',
  },
  {
    title: 'Consent & attribution',
    description:
      'Contributions stay tied to the people and communities they came from, with consent controls carried through every layer.',
    icon: 'users',
  },
  {
    title: 'No sacred or restricted material',
    description:
      'Restricted or sacred knowledge is kept out of public products and commercial pathways entirely.',
    icon: 'leaf',
  },
]

/**
 * Plain-language statements of what this alliance is — and what it is not — so
 * the relationship is never mistaken for a merger or a takeover.
 */
export interface AllianceContrast {
  isLabel: string
  isText: string
  notLabel: string
  notText: string
}

export const allianceContrasts: AllianceContrast[] = [
  {
    isLabel: 'A strategic alignment',
    isText: 'Two projects pulling in the same direction with shared respect for the community.',
    notLabel: 'An uncontrolled merger',
    notText: 'Neither project absorbs or overrides the other.',
  },
  {
    isLabel: 'Separate governance',
    isText: 'Each side owns its own decisions, roadmap and accountability.',
    notLabel: 'A single authority',
    notText: 'No one party gets to speak for the whole.',
  },
  {
    isLabel: 'Defined data boundaries',
    isText: 'Cultural data has explicit rules on use, sharing and commerce.',
    notLabel: 'A free-for-all data pool',
    notText: 'Community data is never treated as open commercial stock.',
  },
]

/**
 * A small honest status surface for the alliance, used in the page hero.
 * PLACEHOLDER copy — phrased as project intent. Confirm exact public wording
 * with the Project Kasena team before launch. Nothing here implies a signed
 * deal, funding, or confidential terms.
 */
export interface AllianceStatus {
  label: string
  value: string
  status: ProductStatus
}

export const allianceStatusItems: AllianceStatus[] = [
  // PLACEHOLDER — confirm public framing of the relationship before launch.
  {
    label: 'Relationship',
    value: 'Strategic alliance',
    status: 'in-development',
  },
  {
    label: 'Language engine',
    value: 'Building now',
    status: 'available',
  },
  {
    label: 'Future commerce',
    value: 'Planned & bounded',
    status: 'planned',
  },
]
