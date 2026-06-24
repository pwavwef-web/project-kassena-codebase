/**
 * Culture & Heritage content for the public marketing site (/heritage).
 *
 * GOVERNANCE NOTE
 * ----------------
 * Project Kasena treats cultural knowledge as belonging to the communities it
 * comes from. Every record carries explicit governance fields (consent status,
 * publication status, contributor, validator and source attribution) so the
 * archive can be operated responsibly and audited.
 *
 * The seed records below are SMALL IN NUMBER and deliberately GENERIC and
 * ILLUSTRATIVE. They demonstrate the *structure* of the future archive — they
 * are NOT verified entries, do NOT name real individuals, and contain NO
 * sacred, restricted, or sensitive material. They exist only to show how the
 * UI will present community-contributed, consent-cleared records.
 *
 * In production these records are expected to come from Firestore / a CMS. The
 * UI maps over this array, so swapping the data source requires no UI change.
 * Only records with `consentStatus: 'public'` are rendered publicly.
 */

/** Honest consent state for a cultural record. */
export type ConsentStatus = 'public' | 'pending' | 'restricted'

/** Honest publication state, mirrors the wider product-status vocabulary. */
export type HeritagePublicationStatus = 'published' | 'in-review' | 'draft'

/** Top-level cultural categories the archive is organised around. */
export type HeritageCategoryId =
  | 'language'
  | 'dialects'
  | 'proverbs'
  | 'oral-history'
  | 'traditional-knowledge'
  | 'architecture'
  | 'music'
  | 'festivals'
  | 'food'
  | 'craft-weaving'
  | 'community-life'
  | 'significant-places'
  | 'etiquette'

export interface HeritageCategory {
  id: HeritageCategoryId
  title: string
  /** Glyph name (must exist in Glyph.tsx). */
  icon: string
  description: string
}

/**
 * A single cultural record. Designed to map 1:1 to a future Firestore document.
 * Governance fields are first-class, not an afterthought.
 */
export interface CulturalRecord {
  id: string
  title: string
  summary: string
  category: HeritageCategoryId
  /** General region within Kasena-Nankana; no private/precise locations. */
  region: string
  /** Optional Kasem-language label/term, rendered with font-kasem. */
  kasemTerm?: string
  /** Optional named contributor (community member who shared the record). */
  contributor?: string
  /** Optional validator (elder / custodian / linguist who reviewed it). */
  validator?: string
  consentStatus: ConsentStatus
  publicationStatus: HeritagePublicationStatus
  /** Where the knowledge came from / how it may be reused. */
  sourceAttribution: string
}

/** The category map that organises the archive. */
export const heritageCategories: HeritageCategory[] = [
  {
    id: 'language',
    title: 'The Kasem language',
    icon: 'book',
    description:
      'Orthography, grammar and the living vocabulary that carries Kasena thought.',
  },
  {
    id: 'dialects',
    title: 'Dialects & regional variation',
    icon: 'globe',
    description:
      'How a single language shifts in sound and word across its communities.',
  },
  {
    id: 'proverbs',
    title: 'Proverbs & idiom',
    icon: 'spark',
    description:
      'Compact wisdom — the metaphors elders use to teach, warn and bless.',
  },
  {
    id: 'oral-history',
    title: 'Oral history',
    icon: 'microphone',
    description:
      'Migrations, founding accounts and lineages remembered through telling.',
  },
  {
    id: 'traditional-knowledge',
    title: 'Traditional knowledge',
    icon: 'leaf',
    description:
      'Seasonal, agricultural and ecological know-how passed between generations.',
  },
  {
    id: 'architecture',
    title: 'Architecture',
    icon: 'shield',
    description:
      'The earthen forms, courtyards and motifs of compound homesteads.',
  },
  {
    id: 'music',
    title: 'Music & dance',
    icon: 'speaker',
    description:
      'Rhythms, instruments and movement that mark gathering and ceremony.',
  },
  {
    id: 'festivals',
    title: 'Festivals & calendar',
    icon: 'sparkles',
    description:
      'Public celebrations that organise the communal year — as openly shared.',
  },
  {
    id: 'food',
    title: 'Food & cuisine',
    icon: 'heart',
    description:
      'Staple crops, dishes and the everyday craft of cooking together.',
  },
  {
    id: 'craft-weaving',
    title: 'Craft & weaving',
    icon: 'refresh',
    description:
      'Basketry, textiles and the patterns that travel from hand to home.',
  },
  {
    id: 'community-life',
    title: 'Community life',
    icon: 'community',
    description:
      'Kinship, naming, cooperative labour and the rhythms of daily life.',
  },
  {
    id: 'significant-places',
    title: 'Significant places',
    icon: 'target',
    description:
      'Towns, markets and landscapes that anchor identity and memory.',
  },
  {
    id: 'etiquette',
    title: 'Cultural etiquette',
    icon: 'users',
    description:
      'Greetings, respect and the social grammar of how people relate.',
  },
]

/** Quick lookup for category metadata by id. */
export const heritageCategoryById: Record<HeritageCategoryId, HeritageCategory> =
  heritageCategories.reduce(
    (acc, category) => {
      acc[category.id] = category
      return acc
    },
    {} as Record<HeritageCategoryId, HeritageCategory>,
  )

/**
 * ILLUSTRATIVE SEED RECORDS — not verified, no real individuals, no sacred or
 * restricted material. These demonstrate the card structure only. Records with
 * `consentStatus` other than 'public' are intentionally included so the UI can
 * be developed against the full governance lifecycle, but the page renders only
 * the 'public' ones.
 */
export const culturalRecords: CulturalRecord[] = [
  {
    id: 'rec-greeting-respect',
    title: 'Everyday greetings and showing respect',
    summary:
      'Greetings open almost every interaction. Their form can shift with age, time of day and setting — a small, generic illustration of how etiquette is structured.',
    category: 'etiquette',
    region: 'Kasena-Nankana (general)',
    kasemTerm: 'báláŋ',
    consentStatus: 'public',
    publicationStatus: 'published',
    sourceAttribution:
      'Illustrative summary for demonstration. Community-reviewed before any real publication.',
  },
  {
    id: 'rec-proverb-pattern',
    title: 'How proverbs teach through metaphor',
    summary:
      'A generic look at the shape of Kasena proverbs — drawing on farming, weather and family imagery to pass on guidance in a single memorable line.',
    category: 'proverbs',
    region: 'Kasena-Nankana (general)',
    consentStatus: 'public',
    publicationStatus: 'published',
    sourceAttribution:
      'Illustrative summary for demonstration. Specific proverbs require contributor consent and validation.',
  },
  {
    id: 'rec-compound-architecture',
    title: 'The compound homestead, in outline',
    summary:
      'Traditional earthen compounds are organised around shared courtyards. This is a high-level, non-sensitive overview of common spatial ideas, not a survey of any real home.',
    category: 'architecture',
    region: 'Kasena-Nankana (general)',
    consentStatus: 'public',
    publicationStatus: 'published',
    sourceAttribution:
      'Illustrative summary for demonstration. Photographs and specific sites need owner permission.',
  },
  {
    id: 'rec-basketry-weaving',
    title: 'Basketry and woven patterns',
    summary:
      'Weaving turns local materials into baskets and mats whose patterns carry meaning. A generic introduction to craft as everyday, shareable culture.',
    category: 'craft-weaving',
    region: 'Kasena-Nankana (general)',
    contributor: 'Community contributor (illustrative)',
    consentStatus: 'public',
    publicationStatus: 'published',
    sourceAttribution:
      'Illustrative summary for demonstration. Real entries attribute the maker and community.',
  },
  {
    id: 'rec-staple-foods',
    title: 'Staple crops and shared meals',
    summary:
      'Food is prepared and eaten together. This generic entry sketches the role of staple grains and communal cooking without claiming any single authentic recipe.',
    category: 'food',
    region: 'Kasena-Nankana (general)',
    consentStatus: 'public',
    publicationStatus: 'published',
    sourceAttribution:
      'Illustrative summary for demonstration. Family recipes are shared only with consent.',
  },
  {
    id: 'rec-dialect-variation',
    title: 'Why the same word can sound different',
    summary:
      'Kasem varies across its communities in sound and vocabulary. A non-technical overview of regional variation, kept general and verifiable.',
    category: 'dialects',
    region: 'Multiple communities (general)',
    kasemTerm: 'Kasɛm',
    validator: 'Language reviewer (illustrative)',
    consentStatus: 'public',
    publicationStatus: 'published',
    sourceAttribution:
      'Illustrative summary for demonstration. Dialect data is validated with community speakers.',
  },
  {
    id: 'rec-oral-history-pending',
    title: 'A founding account (awaiting consent)',
    summary:
      'An oral-history record held back until the family that holds it has reviewed and approved how it is told. Shown here only to illustrate the pending state.',
    category: 'oral-history',
    region: 'Kasena-Nankana (general)',
    consentStatus: 'pending',
    publicationStatus: 'in-review',
    sourceAttribution:
      'Illustrative placeholder. Not published — consent and validation outstanding.',
  },
  {
    id: 'rec-restricted-knowledge',
    title: 'Restricted custodial knowledge',
    summary:
      'Some knowledge is not for public display. This placeholder marks a record kept restricted by its custodians; the archive respects that boundary by design.',
    category: 'traditional-knowledge',
    region: 'Kasena-Nankana (general)',
    consentStatus: 'restricted',
    publicationStatus: 'draft',
    sourceAttribution:
      'Illustrative placeholder. Restricted by custodians — never displayed publicly.',
  },
]

/** Only consent-cleared records are eligible for public display. */
export const publicCulturalRecords: CulturalRecord[] = culturalRecords.filter(
  (record) => record.consentStatus === 'public',
)

/** The governance principles surfaced in the Cultural Content Notice. */
export interface GovernancePrinciple {
  title: string
  description: string
  icon: string
}

export const governancePrinciples: GovernancePrinciple[] = [
  {
    title: 'Consent first',
    description:
      'Nothing is published without the agreement of the people and families it belongs to. Consent can be withdrawn.',
    icon: 'shield',
  },
  {
    title: 'Attribution always',
    description:
      'Contributors and validators are credited. Knowledge keeps its source rather than becoming anonymous data.',
    icon: 'user',
  },
  {
    title: 'Community validation',
    description:
      'Entries are reviewed by speakers, elders and custodians before they are presented as part of the record.',
    icon: 'check',
  },
  {
    title: 'Respect for what is restricted',
    description:
      'Sacred or restricted material is never shown publicly. Boundaries set by custodians are honoured by default.',
    icon: 'leaf',
  },
]
