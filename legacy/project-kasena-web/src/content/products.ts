import type { ProductStatus } from './site'

export interface ProductModule {
  id: string
  title: string
  status: ProductStatus
  /** Short one-line summary for cards. */
  summary: string
  /** Longer description for the product page. */
  description: string
  audience: string
  impact: string
  category: 'Language' | 'Community' | 'Education' | 'Data' | 'Future AI'
  icon: string
  cta?: { label: string; to: string }
}

/**
 * The Project Kasena product ecosystem. Statuses are honest: "available"
 * reflects capabilities already shipped in the web application; future AI
 * capabilities are clearly marked "research" or "planned" and are never
 * presented as operational.
 */
export const products: ProductModule[] = [
  {
    id: 'dictionary',
    title: 'English–Kasem dictionary',
    status: 'available',
    summary: 'A growing, validated dictionary you can search today.',
    description:
      'Search English and Kasem entries with parts of speech, dialect notes, example sentences and pronunciation where available. Every published entry has passed community review.',
    audience: 'Speakers, learners, teachers, researchers',
    impact: 'A reliable digital reference for a language with few online resources.',
    category: 'Language',
    icon: 'book',
    cta: { label: 'Explore the dictionary', to: '/dictionary' },
  },
  {
    id: 'translation',
    title: 'Kasem translation tools',
    status: 'in-development',
    summary: 'Word and phrase lookup growing toward fuller translation.',
    description:
      'Look up words and common phrases between English and Kasem. As the validated dataset grows, translation coverage and accuracy expand with it.',
    audience: 'Speakers, learners, the diaspora',
    impact: 'Everyday access to Kasem meaning online.',
    category: 'Language',
    icon: 'globe',
  },
  {
    id: 'contribution',
    title: 'Word & phrase contribution',
    status: 'available',
    summary: 'Anyone can suggest words, sentences and dialect variants.',
    description:
      'A structured contribution flow captures translations, example sentences, dialect, part of speech, cultural notes and optional audio — ready for review.',
    audience: 'Community contributors, students, teachers',
    impact: 'Turns living knowledge into structured language data.',
    category: 'Community',
    icon: 'upload',
    cta: { label: 'Start contributing', to: '/contributions' },
  },
  {
    id: 'validation',
    title: 'Elder & teacher validation',
    status: 'available',
    summary: 'Qualified validators review submissions before they publish.',
    description:
      'Submissions move through automated checks and human review by qualified Kasem teachers and validators. Only approved records enter the verified dataset.',
    audience: 'Teachers, elders, validators',
    impact: 'Protects accuracy and community trust in the data.',
    category: 'Community',
    icon: 'shield',
  },
  {
    id: 'dialect',
    title: 'Dialect-aware language records',
    status: 'in-development',
    summary: 'Records carry dialect and regional metadata.',
    description:
      'Entries can capture dialect and regional variation (Navrongo, Paga, Chiana, Chuchuliga, Sandema and more) so the dataset reflects how Kasem is really spoken.',
    audience: 'Researchers, linguists, communities',
    impact: 'Preserves variation instead of flattening it.',
    category: 'Data',
    icon: 'data',
  },
  {
    id: 'rewards',
    title: 'Contributor rewards & bounties',
    status: 'available',
    summary: 'Points, levels and sponsored data bounties.',
    description:
      'Contributors earn points and recognition for approved work, and can take part in focused data bounty campaigns that target specific vocabulary needs.',
    audience: 'Contributors, sponsors',
    impact: 'Sustains community participation over time.',
    category: 'Community',
    icon: 'reward',
    cta: { label: 'See rewards', to: '/rewards' },
  },
  {
    id: 'leaderboard',
    title: 'Leaderboards & achievements',
    status: 'available',
    summary: 'Recognition for the people building the language.',
    description:
      'Weekly, monthly and all-time leaderboards plus achievement badges celebrate contributors and validators.',
    audience: 'Contributors, community',
    impact: 'Makes contribution visible and valued.',
    category: 'Community',
    icon: 'trophy',
  },
  {
    id: 'culture',
    title: 'Cultural stories & proverbs',
    status: 'in-development',
    summary: 'An editorial archive of proverbs, stories and heritage.',
    description:
      'A growing, consent-aware archive of proverbs, oral history and cultural knowledge — with source, region and publication status attached to each record.',
    audience: 'Community, students, cultural institutions',
    impact: 'Keeps cultural knowledge accessible and attributed.',
    category: 'Education',
    icon: 'leaf',
    cta: { label: 'Visit culture & heritage', to: '/heritage' },
  },
  {
    id: 'education',
    title: 'Educational resources',
    status: 'planned',
    summary: 'Bilingual learning tools built on verified data.',
    description:
      'Planned learning resources for schools and self-learners, grounded in the verified dataset and designed with teachers.',
    audience: 'Schools, teachers, learners',
    impact: 'Supports Kasem literacy for the next generation.',
    category: 'Education',
    icon: 'book',
  },
  {
    id: 'datasets',
    title: 'Research-ready datasets',
    status: 'in-development',
    summary: 'Structured, documented data for responsible research.',
    description:
      'Verified word pairs, sentence pairs and metadata, packaged for responsible academic and language-technology research under community governance.',
    audience: 'Researchers, universities, partners',
    impact: 'A foundation others can build on, ethically.',
    category: 'Data',
    icon: 'analytics',
  },
  {
    id: 'conversational-ai',
    title: 'Conversational AI',
    status: 'research',
    summary: 'Future text assistants grounded in Kasem.',
    description:
      'A future capability: educational and conversational assistants trained on verified Kasem instruction and context data. Not yet operational.',
    audience: 'Learners, public services',
    impact: 'Answers in Kasem, when the data is ready.',
    category: 'Future AI',
    icon: 'spark',
  },
  {
    id: 'speech-recognition',
    title: 'Speech recognition',
    status: 'research',
    summary: 'Future Kasem speech-to-text.',
    description:
      'A future capability dependent on aligned audio and text with speaker and dialect diversity. Research phase — not yet operational.',
    audience: 'Speakers, low-literacy users',
    impact: 'Voice access to digital tools.',
    category: 'Future AI',
    icon: 'microphone',
  },
  {
    id: 'text-to-speech',
    title: 'Kasem text-to-speech',
    status: 'research',
    summary: 'Future Kasem voice synthesis.',
    description:
      'A future capability to give Kasem a natural digital voice for accessible interfaces. Research phase — not yet operational.',
    audience: 'Elders, low-literacy users',
    impact: 'Inclusive, voice-first access.',
    category: 'Future AI',
    icon: 'speaker',
  },
]
