/**
 * Content for the Transparency & Reports page (/transparency).
 *
 * IMPORTANT — honesty rules:
 *  - Nothing here invents partnerships, endorsements, funding amounts, statistics
 *    or community approval.
 *  - Milestones describe build progress in honest, status-labelled language.
 *  - The "use of funds" breakdown is CLEARLY LABELLED as an illustrative project
 *    allocation, NOT a reported budget. No real money figures are claimed.
 *  - The public-documents registry starts empty/locked: only documents with
 *    `isPublic === true` are ever rendered, and confidential drafts must never be
 *    added here. Released reports replace the PLACEHOLDER entries below.
 */

/** A single, honestly-labelled progress milestone. */
export interface Milestone {
  id: string
  /** Short period label, e.g. "Phase 1" or "2025". Kept vague where unconfirmed. */
  period: string
  title: string
  description: string
  /** Honest delivery status — never presents future work as complete. */
  status: 'done' | 'in-progress' | 'planned'
  /** Glyph name (must be a valid Glyph). */
  icon: string
}

/**
 * Build milestones. These describe the project's own roadmap in honest terms.
 * Dates are intentionally avoided where unconfirmed; statuses are explicit.
 */
export const milestones: Milestone[] = [
  {
    id: 'platform',
    period: 'Foundation',
    title: 'Public dictionary & contribution platform',
    description:
      'The core platform where words and examples are submitted, reviewed and published is live and accepting contributions.',
    status: 'done',
    icon: 'book',
  },
  {
    id: 'validation',
    period: 'Foundation',
    title: 'Community validation workflow',
    description:
      'A structured review process — with attribution, consent and dialect metadata — so entries are checked before they become part of the verified record.',
    status: 'in-progress',
    icon: 'shield',
  },
  {
    id: 'governance',
    period: 'In progress',
    title: 'Data governance & consent framework',
    description:
      'Documenting how contributions are sourced, consented to, attributed and protected. Draft pending community review before publication.',
    status: 'in-progress',
    icon: 'data',
  },
  {
    id: 'dataset',
    period: 'Phase 1 target',
    title: 'First verified dataset milestone',
    description:
      'Reaching the Phase-1 target of 10,000–20,000 validated entries that form the AI-ready lexical foundation. Project target — in progress.',
    status: 'planned',
    icon: 'target',
  },
  {
    id: 'reporting',
    period: 'Planned',
    title: 'Public progress & transparency reports',
    description:
      'Regular, plain-language reports on contributions, validation, governance decisions and use of any funds raised. Released reports will appear in the registry below.',
    status: 'planned',
    icon: 'analytics',
  },
]

/** A standing governance commitment the project holds itself to. */
export interface GovernanceCommitment {
  id: string
  title: string
  description: string
  icon: string
}

/**
 * Governance commitments. These are principles the project commits to, written
 * as commitments — not as claims of external certification or audit.
 */
export const governanceCommitments: GovernanceCommitment[] = [
  {
    id: 'community-ownership',
    title: 'Community ownership',
    description:
      'The language belongs to its speakers. Decisions about what is collected and how it is used are made with the community, not imposed on it.',
    icon: 'community',
  },
  {
    id: 'data-sovereignty',
    title: 'Data sovereignty',
    description:
      'Kasem language data is governed for the benefit of Kasem speakers first. Datasets are documented and governed, not quietly extracted.',
    icon: 'shield',
  },
  {
    id: 'consent',
    title: 'Consent & dignity',
    description:
      'Contributions are gathered with informed consent. Sacred or restricted knowledge is not collected, and nothing private is published.',
    icon: 'heart',
  },
  {
    id: 'attribution',
    title: 'Attribution',
    description:
      'Contributors and validators are credited for their work. Knowledge carries the names of the people who shared it.',
    icon: 'user',
  },
  {
    id: 'honesty',
    title: 'Honest status language',
    description:
      'Targets are labelled as targets and future capabilities as research or planned. We do not present goals as achievements.',
    icon: 'check',
  },
  {
    id: 'openness',
    title: 'Open process',
    description:
      'How we work — review steps, governance decisions and use of funds — is documented and shared as the project matures.',
    icon: 'globe',
  },
]

/**
 * Illustrative allocation of resources. This is a CLEARLY-LABELLED project target
 * for how effort and any funds raised are intended to be directed. It is NOT a
 * reported budget and contains NO real money figures. Percentages are indicative.
 */
export interface FundingAllocation {
  id: string
  label: string
  /** Indicative share of effort/funds — illustrative target, not actuals. */
  percent: number
  description: string
  /** Tailwind background color class for the bar/legend swatch. */
  colorClass: string
}

export const fundingAllocations: FundingAllocation[] = [
  {
    id: 'collection',
    label: 'Data collection & contributor rewards',
    percent: 35,
    description:
      'Community data drives, fair recognition for contributors, and the people who gather and submit verified language data.',
    colorClass: 'bg-indigo-600',
  },
  {
    id: 'validation',
    label: 'Validation & quality',
    percent: 25,
    description:
      'Reviewers, validators and the tooling that keeps entries accurate, attributed and dialect-aware.',
    colorClass: 'bg-savannah-600',
  },
  {
    id: 'platform',
    label: 'Platform & infrastructure',
    percent: 20,
    description:
      'Hosting, the contribution and dictionary tools, and the engineering that keeps everything reliable and free to use.',
    colorClass: 'bg-terracotta-500',
  },
  {
    id: 'research',
    label: 'Research & dataset preparation',
    percent: 12,
    description:
      'Preparing AI-ready datasets responsibly. Future AI work is research and planned only — never presented as operational.',
    colorClass: 'bg-kente-500',
  },
  {
    id: 'governance',
    label: 'Governance & community',
    percent: 8,
    description:
      'Consent frameworks, documentation, community coordination and transparency reporting.',
    colorClass: 'bg-charcoal-light',
  },
]

/** Document classification. Only `public` documents are ever displayed. */
export type DocumentClassification = 'public' | 'internal' | 'confidential'

/** A registered public document/report. */
export interface PublicDocument {
  id: string
  title: string
  description: string
  /** Free-text publication date, e.g. "2025" or "Q3 2025". May be a target. */
  publicationDate: string
  version: string
  classification: DocumentClassification
  /** File type, e.g. "PDF" or "CSV". */
  fileType: string
  /** Download/view link. '#' is a PLACEHOLDER until the document is released. */
  href: string
  /**
   * Gate flag. ONLY documents with `isPublic === true` are rendered.
   * Confidential drafts must never be added to this array.
   */
  isPublic: boolean
}

/**
 * Public documents registry.
 *
 * PLACEHOLDER: no public reports have been released yet, so every entry below is
 * marked `isPublic: false` and the page shows a graceful empty state. When a
 * report is published, set `isPublic: true`, set `classification: 'public'`, and
 * replace the '#' href with the real, public download link. Never expose
 * confidential or internal drafts here.
 */
export const publicDocuments: PublicDocument[] = [
  {
    id: 'governance-framework',
    title: 'Data Governance & Consent Framework',
    description:
      'How contributions are sourced, consented to, attributed and protected. Draft pending community review.',
    publicationDate: 'Target — pending review',
    version: 'Draft',
    classification: 'internal',
    fileType: 'PDF',
    href: '#',
    isPublic: false,
  },
  {
    id: 'progress-report',
    title: 'Annual Progress & Transparency Report',
    description:
      'A plain-language summary of contributions, validation, governance decisions and use of any funds raised.',
    publicationDate: 'Planned',
    version: '—',
    classification: 'internal',
    fileType: 'PDF',
    href: '#',
    isPublic: false,
  },
]
