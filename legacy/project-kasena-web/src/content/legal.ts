import { site } from './site'

export interface LegalSection {
  heading: string
  paragraphs: string[]
  list?: string[]
}

export interface LegalDoc {
  slug: string
  title: string
  /** Short summary for the index + meta description. */
  summary: string
  /** ISO date string of last revision. */
  lastUpdated: string
  status: 'draft' | 'published'
  intro: string
  sections: LegalSection[]
}

const DRAFT_NOTE =
  'This document is a working draft pending legal review. It describes our current intentions in good faith and does not constitute legal advice or a final agreement.'

/**
 * Legal & governance content. Several documents are clearly marked as drafts
 * pending legal review — they must be reviewed by a qualified professional
 * before launch. Nothing here should be presented as final legal advice.
 */
export const legalDocs: LegalDoc[] = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    summary:
      'How Project Kasena collects, uses and protects personal information.',
    lastUpdated: '2026-06-20',
    status: 'draft',
    intro: DRAFT_NOTE,
    sections: [
      {
        heading: 'What we collect',
        paragraphs: [
          'We collect the information you choose to provide — for example when you sign in, contribute language data, donate, or contact us. This may include your name, email address, and the content you submit.',
        ],
      },
      {
        heading: 'How we use it',
        paragraphs: [
          'We use your information to operate the platform, review and publish contributions, recognise contributors, process donations, and communicate with you. We do not sell personal data.',
        ],
      },
      {
        heading: 'Analytics',
        paragraphs: [
          'We use privacy-conscious analytics to understand how the website is used in aggregate. Analytics never block the website and we avoid collecting unnecessary personal data.',
        ],
      },
      {
        heading: 'Your rights & contact',
        paragraphs: [
          `You can request access to, correction of, or deletion of your personal data. For privacy and data-protection enquiries, contact ${site.contact.dataProtectionEmail}.`,
        ],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of Use',
    summary: 'The terms that govern your use of the Project Kasena website and app.',
    lastUpdated: '2026-06-20',
    status: 'draft',
    intro: DRAFT_NOTE,
    sections: [
      {
        heading: 'Acceptable use',
        paragraphs: [
          'Use the platform lawfully and respectfully. Do not submit harmful, infringing, or deliberately false content, and do not attempt to disrupt the service.',
        ],
      },
      {
        heading: 'Accounts',
        paragraphs: [
          'You are responsible for activity under your account. We may suspend accounts that violate these terms or our community standards.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: [
          'We may update these terms as the project evolves. Material changes will be communicated through the website.',
        ],
      },
    ],
  },
  {
    slug: 'contributor-terms',
    title: 'Contributor Terms',
    summary: 'How contributed language and cultural data is used and protected.',
    lastUpdated: '2026-06-20',
    status: 'draft',
    intro: DRAFT_NOTE,
    sections: [
      {
        heading: 'Your contributions',
        paragraphs: [
          'When you contribute words, sentences, recordings or cultural records, you confirm you have the right to share them and you grant Project Kasena permission to review, publish and include them in the verified, community-governed dataset.',
        ],
      },
      {
        heading: 'Community benefit',
        paragraphs: [
          'Contributed data is held in trust for the benefit of the Kasem language community. It is not treated as unrestricted commercial content, and funders do not acquire ownership of the language corpus.',
        ],
      },
      {
        heading: 'Attribution & withdrawal',
        paragraphs: [
          'We aim to attribute contributions appropriately. You may request correction or removal of content you contributed, subject to community governance.',
        ],
      },
    ],
  },
  {
    slug: 'data-governance',
    title: 'Community Data Governance',
    summary:
      'Our commitments to community ownership and responsible stewardship of Kasem data.',
    lastUpdated: '2026-06-20',
    status: 'draft',
    intro: DRAFT_NOTE,
    sections: [
      {
        heading: 'Community ownership',
        paragraphs: [
          'The Kasem language belongs to its speakers. Project Kasena stewards the verified dataset on behalf of the community and is accountable to it.',
        ],
      },
      {
        heading: 'Data sovereignty',
        paragraphs: [
          'Decisions about how community-controlled data is used are made with the community in mind. Cultural data is not sold or treated as unrestricted commercial content.',
        ],
      },
      {
        heading: 'Boundaries with partners',
        paragraphs: [
          'Where we collaborate with partners — including Indigen World — clear governance and data boundaries are maintained. Strategic alignment never means unrestricted access to community data.',
        ],
      },
    ],
  },
  {
    slug: 'cultural-content',
    title: 'Cultural Content Policy',
    summary: 'How cultural knowledge is documented with consent and attribution.',
    lastUpdated: '2026-06-20',
    status: 'draft',
    intro: DRAFT_NOTE,
    sections: [
      {
        heading: 'Consent first',
        paragraphs: [
          'We document cultural knowledge only with appropriate consent. We do not publish restricted, sacred, private, or unverified cultural material.',
        ],
      },
      {
        heading: 'Attribution & status',
        paragraphs: [
          'Every cultural record can carry its source, community or region, contributor, validator, and consent or publication status. Only records marked public are displayed.',
        ],
      },
      {
        heading: 'Corrections',
        paragraphs: [
          'Communities and individuals can request correction or takedown of cultural content. See our correction & takedown policy.',
        ],
      },
    ],
  },
  {
    slug: 'accessibility',
    title: 'Accessibility Statement',
    summary: 'Our commitment to an accessible, inclusive experience.',
    lastUpdated: '2026-06-20',
    status: 'draft',
    intro: DRAFT_NOTE,
    sections: [
      {
        heading: 'Our commitment',
        paragraphs: [
          'We aim to meet WCAG 2.2 AA as closely as possible: semantic structure, keyboard navigation, visible focus, sufficient colour contrast, reduced-motion support, and descriptive alternative text.',
        ],
      },
      {
        heading: 'Ongoing work',
        paragraphs: [
          'Accessibility is continuous. If you encounter a barrier, please tell us so we can fix it.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          `Report an accessibility issue at ${site.contact.generalEmail}.`,
        ],
      },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookie & Analytics Notice',
    summary: 'How we use cookies and analytics.',
    lastUpdated: '2026-06-20',
    status: 'draft',
    intro: DRAFT_NOTE,
    sections: [
      {
        heading: 'Essential storage',
        paragraphs: [
          'We use essential storage to keep you signed in and to remember basic preferences.',
        ],
      },
      {
        heading: 'Analytics',
        paragraphs: [
          'Aggregate analytics help us improve the site. We minimise data collection and analytics never break the website.',
        ],
      },
    ],
  },
  {
    slug: 'takedown',
    title: 'Correction & Takedown Policy',
    summary: 'How to request correction or removal of content.',
    lastUpdated: '2026-06-20',
    status: 'draft',
    intro: DRAFT_NOTE,
    sections: [
      {
        heading: 'How to request',
        paragraphs: [
          `If you believe content is inaccurate, culturally inappropriate, was shared without consent, or infringes your rights, contact ${site.contact.generalEmail} with details. For data-protection matters, use ${site.contact.dataProtectionEmail}.`,
        ],
      },
      {
        heading: 'What happens next',
        paragraphs: [
          'We review requests promptly, may temporarily unpublish the content while reviewing, and work with the community and validators to resolve them.',
        ],
      },
    ],
  },
  {
    slug: 'data-protection',
    title: 'Data Protection Contact',
    summary: 'Who to contact about data protection.',
    lastUpdated: '2026-06-20',
    status: 'draft',
    intro: DRAFT_NOTE,
    sections: [
      {
        heading: 'Get in touch',
        paragraphs: [
          `For any data-protection enquiry — access, correction, deletion, or questions about how we handle personal data — contact ${site.contact.dataProtectionEmail}.`,
        ],
      },
    ],
  },
]

export const getLegalDoc = (slug: string): LegalDoc | undefined =>
  legalDocs.find((doc) => doc.slug === slug)
