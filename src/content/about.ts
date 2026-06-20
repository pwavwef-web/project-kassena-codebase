/**
 * About-page content for Project Kasena. Prose lives here so it can be edited
 * without touching JSX. Nothing in this file invents founders, dates, funding,
 * partnerships, statistics or endorsements. Any unconfirmed real-world fact is
 * marked with a PLACEHOLDER comment and surfaced with an honest visible label.
 */

export interface AboutHero {
  eyebrow: string
  headlineLead: string
  headlineEmphasis: string
  supporting: string
  primaryCta: { label: string; to: string }
  secondaryCta: { label: string; to: string }
}

export interface AboutOrigin {
  eyebrow: string
  title: string
  /** Short, scannable paragraphs — no wall of text. */
  paragraphs: string[]
  /** Clearly-labelled honest note about origin specifics. */
  note: string
}

export interface ProblemPoint {
  title: string
  description: string
  icon: string
}

export interface AboutProblem {
  eyebrow: string
  title: string
  body: string
  points: ProblemPoint[]
}

export interface MissionVision {
  eyebrow: string
  missionLabel: string
  mission: string
  visionLabel: string
  vision: string
}

export interface StrategicObjective {
  number: string
  title: string
  description: string
  icon: string
}

export interface WhyKasemReason {
  title: string
  description: string
  icon: string
}

export interface AboutWhyKasem {
  eyebrow: string
  title: string
  body: string
  reasons: WhyKasemReason[]
}

export interface CoreValue {
  title: string
  description: string
  icon: string
}

export interface CommunityRole {
  group: string
  description: string
  icon: string
}

export interface TimelineStage {
  /** Honest, qualitative marker — never a fabricated date. */
  marker: string
  title: string
  description: string
  status: 'in-progress' | 'planned' | 'research'
}

export interface HighlightQuote {
  quote: string
  attribution: string
}

export interface AboutContent {
  hero: AboutHero
  origin: AboutOrigin
  problem: AboutProblem
  missionVision: MissionVision
  objectives: { eyebrow: string; title: string; description: string; items: StrategicObjective[] }
  whyKasem: AboutWhyKasem
  values: { eyebrow: string; title: string; description: string; items: CoreValue[] }
  roles: { eyebrow: string; title: string; description: string; items: CommunityRole[] }
  timeline: { eyebrow: string; title: string; description: string; stages: TimelineStage[] }
  quote: HighlightQuote
  ambition: { eyebrow: string; title: string; body: string }
}

export const about: AboutContent = {
  hero: {
    eyebrow: 'About Project Kasena',
    headlineLead: 'The story of a language',
    headlineEmphasis: 'claiming its place online.',
    supporting:
      'Project Kasena is a community-led effort to give Kasem a verified digital foundation — the words, datasets, tools and future AI that let a living language thrive in the spaces where the next generation already lives.',
    primaryCta: { label: 'Contribute to the language', to: '/contributions' },
    secondaryCta: { label: 'Partner with us', to: '/partners' },
  },

  origin: {
    eyebrow: 'How it began',
    title: 'It started with a simple observation.',
    paragraphs: [
      'When you search the internet in Kasem, you find almost nothing. The language that carries the greetings, proverbs and oral history of the Kasena-Nankana people is largely absent from search, software and the AI tools shaping how the world communicates.',
      'Project Kasena grew from a conviction that this gap is not inevitable. A language with living speakers can have a living digital presence — if its own community builds it, owns it and decides what is correct.',
      'So the work began where it should: with words, with speakers, and with the people who know the language best.',
    ],
    note:
      'Specific founding dates and individuals are intentionally not published here pending confirmation by the Project Kasena team.',
  },

  problem: {
    eyebrow: 'The problem we exist to solve',
    title: 'Digital language exclusion is quiet, and it is permanent.',
    body: 'When a language has no verified digital footprint, it slowly disappears from the spaces where young people learn, search and connect — and from the AI systems being trained today on everything except languages like Kasem.',
    points: [
      {
        title: 'Missing from the internet',
        description:
          'Few verified resources exist, so search engines and AI tools cannot understand or answer in Kasem.',
        icon: 'globe',
      },
      {
        title: 'Knowledge at risk',
        description:
          'Much of the language and its meaning lives with elders — undocumented and vulnerable to being lost.',
        icon: 'leaf',
      },
      {
        title: 'Left out of AI',
        description:
          'Modern language models are trained on data that simply does not include Kasem, deepening the divide.',
        icon: 'data',
      },
    ],
  },

  missionVision: {
    eyebrow: 'Mission & vision',
    missionLabel: 'Our mission',
    mission:
      'To build the verified digital language infrastructure — data, tools and future AI — that allows Kasem to thrive online, owned and validated by the community that speaks it.',
    visionLabel: 'Our vision',
    vision:
      'A future where a child can ask the internet a question and be answered in Kasem — and where the digital model that documents one language becomes a path other under-served languages can follow.',
  },

  objectives: {
    eyebrow: 'Strategic objectives',
    title: 'What we are working toward.',
    description:
      'A small set of clear objectives keeps the work honest and sequenced — a verified foundation first, before anything is presented as more than it is.',
    items: [
      {
        number: '01',
        title: 'Build a verified Kasem dataset',
        description:
          'Validated words, sentences, dialect metadata and context examples — checked by software and approved by qualified teachers and elders.',
        icon: 'data',
      },
      {
        number: '02',
        title: 'Create trustworthy learning tools',
        description:
          'A digital dictionary and educational resources that students, teachers and families can rely on.',
        icon: 'book',
      },
      {
        number: '03',
        title: 'Lay the groundwork for Kasem AI',
        description:
          'An AI-ready foundation that future, responsibly-built language and voice systems can be trained on — researched and planned, never overclaimed.',
        icon: 'spark',
      },
      {
        number: '04',
        title: 'Keep ownership with the community',
        description:
          'Governance, consent and attribution that ensure the verified language data is held in trust, not extracted or sold.',
        icon: 'shield',
      },
    ],
  },

  whyKasem: {
    eyebrow: 'Why Kasem',
    title: 'Why this language, and why now.',
    body: 'Kasem is spoken across the Kasena-Nankana area of northern Ghana and southern Burkina Faso. It is rich, living and deeply tied to community identity — and like many under-served languages, it is largely missing from the digital world.',
    reasons: [
      {
        title: 'A living language with deep roots',
        description:
          'Kasem carries proverbs, greetings and oral history across the Kasena-Nankana area of northern Ghana and southern Burkina Faso.',
        icon: 'community',
      },
      {
        title: 'Under-served, not unimportant',
        description:
          'Its absence online is a gap in resources, not in value — exactly the kind of gap this work is built to close.',
        icon: 'target',
      },
      {
        title: 'Knowledge worth documenting now',
        description:
          'Capturing words, dialects and meaning while fluent elders can validate them is time-sensitive, careful work.',
        icon: 'leaf',
      },
      {
        title: 'A model others can follow',
        description:
          'A respectful, community-owned method for one language can become a template for many.',
        icon: 'refresh',
      },
    ],
  },

  values: {
    eyebrow: 'Mission & values',
    title: 'The principles the work is built on.',
    description:
      'These values are not decoration. They decide who has the final say, how data is handled, and what we will and will not claim.',
    items: [
      {
        title: 'Community ownership',
        description: 'The verified language data is held in trust for its speakers, never extracted or sold.',
        icon: 'community',
      },
      {
        title: 'Cultural dignity',
        description: 'Heritage is shared with consent and attribution — and sacred or restricted material is left untouched.',
        icon: 'heart',
      },
      {
        title: 'Linguistic accuracy',
        description: 'Qualified teachers and elders have the final say on what is correct, not an algorithm alone.',
        icon: 'check',
      },
      {
        title: 'Open collaboration',
        description: 'Schools, researchers, partners and the diaspora all have a clear, welcome role to play.',
        icon: 'users',
      },
      {
        title: 'Responsible innovation',
        description: 'Future AI is researched and planned in honest phases, and never presented as already operational.',
        icon: 'spark',
      },
      {
        title: 'Youth empowerment',
        description: 'Young contributors and validators gain real skills, recognition and roles in the work.',
        icon: 'reward',
      },
      {
        title: 'Data sovereignty',
        description: 'Governance and boundaries keep decisions about Kasem data with the community it belongs to.',
        icon: 'shield',
      },
      {
        title: 'Intergenerational transfer',
        description: 'Knowledge moves from elders to youth in a form that can be carried forward, not just remembered.',
        icon: 'refresh',
      },
    ],
  },

  roles: {
    eyebrow: 'Who builds it',
    title: 'A language grows when its people grow it together.',
    description:
      'Project Kasena is built around the Kasena-Nankana community. Everyone has something to contribute — from a student in Navrongo to a grandparent in the diaspora.',
    items: [
      {
        group: 'Youth',
        description:
          'Contribute words and examples, learn validation skills, and earn recognition for documenting their own language.',
        icon: 'spark',
      },
      {
        group: 'Teachers',
        description:
          'Serve as qualified validators, bring classroom rigour, and help shape resources students can trust.',
        icon: 'book',
      },
      {
        group: 'Elders',
        description:
          'Hold the deepest knowledge of meaning and usage, and give the final word on what is accurate — with consent and attribution.',
        icon: 'leaf',
      },
      {
        group: 'Schools',
        description:
          'Host data drives, mobilise communities, and turn local knowledge into shared digital infrastructure.',
        icon: 'users',
      },
      {
        group: 'Researchers',
        description:
          'Build responsibly on documented, governed datasets for linguistics and language-technology work.',
        icon: 'analytics',
      },
      {
        group: 'Diaspora',
        description:
          'Reconnect from afar, contribute knowledge, and help carry Kasem forward across distance and generations.',
        icon: 'globe',
      },
    ],
  },

  timeline: {
    eyebrow: 'The path so far and ahead',
    title: 'A deliberate sequence, honestly labelled.',
    description:
      'We are intentional about order: a strong, verified foundation first — because a smaller, carefully validated dataset is more valuable than a large, noisy one.',
    stages: [
      {
        marker: 'Foundation',
        title: 'Verified language foundation',
        description:
          'Building validated words, sentences and dialect metadata, reviewed by teachers and elders — the lexical bedrock everything else depends on.',
        status: 'in-progress',
      },
      {
        marker: 'Next',
        title: 'Conversational intelligence',
        description:
          'Grammar, context and domain knowledge in Kasem to support stronger translation and educational assistants.',
        status: 'planned',
      },
      {
        marker: 'Horizon',
        title: 'Voice & multimodal AI',
        description:
          'Researching aligned audio and text so that, in time, Kasem can have a digital voice and accessible interfaces.',
        status: 'research',
      },
    ],
  },

  quote: {
    quote:
      'When the next generation asks the internet a question, it should be able to answer them in Kasem.',
    // PLACEHOLDER attribution — kept general; no individual is named without confirmation.
    attribution: 'The guiding belief behind Project Kasena',
  },

  ambition: {
    eyebrow: 'The long-term ambition',
    title: 'More than a dictionary. A language with a future.',
    body: 'The long-term ambition is a Kasem that lives fully online — searchable, teachable and, in time, able to be spoken and understood by responsibly-built AI. And beyond Kasem, a proven, community-owned model that other under-served languages can follow to claim their own place in the digital world.',
  },
}
