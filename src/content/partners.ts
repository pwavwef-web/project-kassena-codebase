/**
 * Partnership pathways for the public /partners page.
 *
 * IMPORTANT — honesty rules:
 * - Nothing here names a confirmed partner, endorsement, funder or institution.
 * - Categories describe the *kinds* of organisations and people Project Kasena
 *   HOPES to collaborate with. Wording is aspirational, never claimed as live.
 * - Where a concrete commitment would normally appear, copy is framed as an
 *   invitation or a clearly-labelled intention, not as an existing arrangement.
 *
 * Each pathway maps a collaborator type to four honest fields:
 *   whyItMatters             — why this group is important to the mission
 *   whatCollaborationLooksLike — concrete, realistic ways to work together
 *   whatWeProvide            — what the project can offer in return
 *   whatWeExpect             — the responsibilities / consent posture we ask for
 */

/** Valid Glyph icon names only (see components/ui/Glyph.tsx). */
export type PartnerIcon =
  | 'leaf'
  | 'book'
  | 'community'
  | 'analytics'
  | 'heart'
  | 'shield'
  | 'spark'
  | 'globe'
  | 'speaker'
  | 'users'
  | 'reward'
  | 'send'
  | 'check'

export interface PartnerPathway {
  /** Stable id, used for accordion state and anchors. */
  id: string
  title: string
  icon: PartnerIcon
  /** One-line summary shown on the collapsed card. */
  summary: string
  whyItMatters: string
  whatCollaborationLooksLike: string[]
  whatWeProvide: string[]
  whatWeExpect: string[]
}

export const partnerPathways: PartnerPathway[] = [
  {
    id: 'traditional-leaders',
    title: 'Traditional leaders & elders',
    icon: 'leaf',
    summary:
      'Custodians of meaning, proverbs and the boundaries of what may be shared.',
    whyItMatters:
      'Kasem lives first in the voices of elders and traditional authorities. Their guidance keeps the project rooted in real meaning and protects knowledge that should not be digitised or made public.',
    whatCollaborationLooksLike: [
      'Advising on what is appropriate to record, publish or keep private.',
      'Validating words, proverbs and usage against lived knowledge.',
      'Helping convene community members for respectful data drives.',
    ],
    whatWeProvide: [
      'Clear consent controls and the right to withdraw contributed material.',
      'Attribution for knowledge shared, where attribution is welcomed.',
      'A transparent record of how contributions are used.',
    ],
    whatWeExpect: [
      'Honest guidance on sacred or restricted material we must not include.',
      'A shared commitment to accuracy over speed.',
    ],
  },
  {
    id: 'teachers-linguists',
    title: 'Teachers & linguists',
    icon: 'book',
    summary:
      'Specialists in orthography, grammar and how the language is taught.',
    whyItMatters:
      'Sound documentation needs people who understand Kasem structure, spelling and dialect difference. Teachers and linguists turn raw contributions into material learners and researchers can trust.',
    whatCollaborationLooksLike: [
      'Reviewing entries for spelling, tone marking and grammatical accuracy.',
      'Advising on orthography decisions across dialect regions.',
      'Shaping future learning tools and example sentences.',
    ],
    whatWeProvide: [
      'A structured validation workflow and tooling to review at scale.',
      'Credit for editorial and linguistic contributions.',
      'Access to governed datasets for legitimate teaching and study.',
    ],
    whatWeExpect: [
      'Rigour and a willingness to flag uncertainty rather than guess.',
      'Respect for community sources and consent.',
    ],
  },
  {
    id: 'schools-universities',
    title: 'Schools & universities',
    icon: 'community',
    summary:
      'Classrooms and campuses where the language can be learned and studied.',
    whyItMatters:
      'Schools and universities reach the next generation of speakers and the researchers who will build on this work. They are where verified language material becomes everyday practice.',
    whatCollaborationLooksLike: [
      'Hosting student-led data drives and contribution sessions.',
      'Piloting verified material in literacy and language classes.',
      'Supervising research projects that use governed datasets.',
    ],
    whatWeProvide: [
      'Honest, status-labelled tools (available, in development or planned).',
      'Guidance for running ethical, consent-aware contribution activities.',
      'Recognition for participating classes and student contributors.',
    ],
    whatWeExpect: [
      'A commitment to data governance and learner consent.',
      'Feedback that helps improve the tools for everyone.',
    ],
  },
  {
    id: 'researchers',
    title: 'Researchers',
    icon: 'analytics',
    summary:
      'Linguists and language-technology researchers working responsibly.',
    whyItMatters:
      'Under-resourced languages are too often studied without benefit returning to the community. Responsible researchers can change that by working within clear governance and giving back.',
    whatCollaborationLooksLike: [
      'Using governed datasets for documentation and language-technology work.',
      'Co-designing data formats that serve both research and community needs.',
      'Sharing findings back with the community in accessible form.',
    ],
    whatWeProvide: [
      'Documented dataset structure and provenance, where available.',
      'A point of contact for access requests and governance questions.',
      'A transparent account of how data was collected and validated.',
    ],
    whatWeExpect: [
      'Adherence to data-governance terms and community consent.',
      'Attribution and a commitment to share value back.',
    ],
  },
  {
    id: 'ngos',
    title: 'NGOs & community organisations',
    icon: 'heart',
    summary:
      'Groups already trusted within Kasena-Nankana and beyond.',
    whyItMatters:
      'Established community organisations carry trust, reach and on-the-ground experience. They help the project mobilise contributors in a way that is welcomed locally.',
    whatCollaborationLooksLike: [
      'Co-organising community data drives and awareness sessions.',
      'Connecting the project with speakers and local custodians.',
      'Supporting youth participation and digital-skills opportunities.',
    ],
    whatWeProvide: [
      'Shared, honest messaging that avoids overclaiming.',
      'Recognition of partner roles in community activities.',
      'Tools and guidance for consent-aware contribution.',
    ],
    whatWeExpect: [
      'Respect for community consent and cultural boundaries.',
      'A collaborative, non-extractive approach.',
    ],
  },
  {
    id: 'government',
    title: 'Government agencies',
    icon: 'shield',
    summary:
      'Public bodies with a mandate in education, culture or language policy.',
    whyItMatters:
      'Public institutions shape education and language policy at scale. Alignment with public goals helps verified Kasem material reach classrooms and official use responsibly.',
    whatCollaborationLooksLike: [
      'Aligning with curriculum and literacy objectives where appropriate.',
      'Supporting recognition of digital Kasem language infrastructure.',
      'Exploring pathways for verified material in public education.',
    ],
    whatWeProvide: [
      'Transparency on methodology, data governance and status.',
      'Honest reporting on progress against stated targets.',
      'A community-rooted, consent-first approach.',
    ],
    whatWeExpect: [
      'Respect for the community-owned nature of the work.',
      'Clear, accountable points of contact.',
    ],
  },
  {
    id: 'technology',
    title: 'Technology companies',
    icon: 'spark',
    summary:
      'Engineering and AI teams who can support infrastructure ethically.',
    whyItMatters:
      'Building durable language infrastructure takes engineering capacity. Technology collaborators can help — provided future AI work stays in research and planning until it is genuinely ready.',
    whatCollaborationLooksLike: [
      'Contributing engineering, tooling or hosting capacity.',
      'Advising on data pipelines, accessibility and performance.',
      'Supporting research-phase language-technology work, clearly labelled.',
    ],
    whatWeProvide: [
      'A real, growing dataset built on verified, consent-aware contributions.',
      'Honest status language — no operational AI claims until proven.',
      'Recognition for meaningful technical contributions.',
    ],
    whatWeExpect: [
      'Respect for community ownership and data governance.',
      'No premature claims about capabilities that do not yet exist.',
    ],
  },
  {
    id: 'cultural-institutions',
    title: 'Cultural institutions',
    icon: 'globe',
    summary:
      'Museums, archives and heritage bodies safeguarding Kasena culture.',
    whyItMatters:
      'Cultural institutions hold expertise in stewardship, provenance and ethical display. They help ensure the project treats heritage with the care it deserves.',
    whatCollaborationLooksLike: [
      'Advising on provenance, consent and respectful presentation.',
      'Sharing expertise on what may be shared and what must be protected.',
      'Exploring complementary archival and educational programmes.',
    ],
    whatWeProvide: [
      'Original, clearly-labelled cultural design that avoids sacred material.',
      'Consent and attribution controls on contributed content.',
      'A transparent account of how material is presented and why.',
    ],
    whatWeExpect: [
      'Guidance on boundaries around restricted or sacred knowledge.',
      'A shared commitment to ethical stewardship.',
    ],
  },
  {
    id: 'radio-media',
    title: 'Radio & media partners',
    icon: 'speaker',
    summary:
      'Local radio and media that reach speakers in their own language.',
    whyItMatters:
      'Radio and community media are powerful in Kasena-Nankana. They can raise awareness, invite contributions and celebrate the language with the people who speak it.',
    whatCollaborationLooksLike: [
      'Sharing accurate, non-sensational stories about the work.',
      'Inviting listeners to contribute words, examples and corrections.',
      'Amplifying community data drives and milestones.',
    ],
    whatWeProvide: [
      'Honest, ready-to-use messaging and progress updates.',
      'Spokespeople and clear answers to questions about methodology.',
      'Recognition of media collaborators in project updates.',
    ],
    whatWeExpect: [
      'Accurate reporting that avoids overstating capabilities.',
      'Respect for contributor consent and privacy.',
    ],
  },
  {
    id: 'diaspora',
    title: 'Diaspora organisations',
    icon: 'users',
    summary:
      'Kasena communities abroad reconnecting with home.',
    whyItMatters:
      'The diaspora carries the language across distance. Diaspora organisations can mobilise contributors, raise awareness and help families stay connected to Kasem.',
    whatCollaborationLooksLike: [
      'Encouraging members to contribute and validate from abroad.',
      'Connecting younger generations with the language online.',
      'Helping spread the word within diaspora networks.',
    ],
    whatWeProvide: [
      'A web-based platform reachable from anywhere.',
      'Honest updates on progress and how to get involved.',
      'Recognition of diaspora contributions to the work.',
    ],
    whatWeExpect: [
      'Respect for community consent and accuracy.',
      'A genuine, give-back spirit of collaboration.',
    ],
  },
  {
    id: 'sponsors-funders',
    title: 'Sponsors & funders',
    icon: 'reward',
    summary:
      'Supporters who can resource the work without compromising its values.',
    whyItMatters:
      'Sustained documentation, validation and tooling need resources. Aligned sponsors and funders can help — as long as the work stays community-owned and transparently reported.',
    whatCollaborationLooksLike: [
      'Supporting specific, costed activities such as data drives or tooling.',
      'Funding capacity for validation and documentation work.',
      'Backing the project without directing its cultural decisions.',
    ],
    whatWeProvide: [
      'Transparent reporting against clearly-labelled targets.',
      'Honest status updates — no inflated numbers or claims.',
      'Acknowledgement aligned with the supporter relationship.',
    ],
    whatWeExpect: [
      'Respect for the community-owned, consent-first model.',
      // PLACEHOLDER — formal funding terms and recognition tiers are pending review.
      'Patience while formal funding terms are confirmed by the team.',
    ],
  },
  {
    id: 'volunteers',
    title: 'Volunteers',
    icon: 'send',
    summary:
      'Individuals offering time, skills and energy to the mission.',
    whyItMatters:
      'Much of this work is human work — contributing, reviewing, organising and translating. Volunteers with the right skills and respect for the community move the project forward.',
    whatCollaborationLooksLike: [
      'Contributing and validating entries through the platform.',
      'Helping with outreach, documentation, design or engineering.',
      'Supporting community events and data drives.',
    ],
    whatWeProvide: [
      'Clear, meaningful tasks and recognition for contributions.',
      'A welcoming, consent-aware community of contributors.',
      'Skills, experience and a stake in a shared mission.',
    ],
    whatWeExpect: [
      'Respect for community sources, consent and accuracy.',
      'Reliability on the tasks you take on.',
    ],
  },
]

/**
 * High-level principles shown above the pathways. These describe how Project
 * Kasena *intends* to collaborate — they are commitments of posture, not claims
 * of existing partnerships.
 */
export interface CollaborationPrinciple {
  title: string
  description: string
  icon: PartnerIcon
}

export const collaborationPrinciples: CollaborationPrinciple[] = [
  {
    title: 'Community-owned',
    description:
      'The language and its data belong to the community. Collaboration never overrides that.',
    icon: 'shield',
  },
  {
    title: 'Consent-first',
    description:
      'Contributions carry consent and attribution, with the right to withdraw what was shared.',
    icon: 'heart',
  },
  {
    title: 'Honest by default',
    description:
      'We label what is available, in development or planned — and never overstate AI capability.',
    icon: 'check',
  },
]
