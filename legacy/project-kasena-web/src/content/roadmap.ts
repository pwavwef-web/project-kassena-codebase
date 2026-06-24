export interface RoadmapPhase {
  id: string
  number: number
  name: string
  status: 'in-progress' | 'planned' | 'research'
  tagline: string
  /** What the phase focuses on collecting / building. */
  focus: string[]
  /** What the phase produces. */
  outcomes: string[]
}

/**
 * The AI & data roadmap. Phrasing is deliberately honest: a smaller, carefully
 * validated dataset is more valuable than a large, noisy one. No phase is
 * presented as complete, and no AI is presented as trained or operational.
 */
export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 'foundation',
    number: 1,
    name: 'Language foundation',
    status: 'in-progress',
    tagline: 'Verified words, sentences and the lexical bedrock.',
    focus: [
      'Validated word pairs',
      'Sentence pairs',
      'Dialect metadata',
      'Parts of speech',
      'Context examples',
      'Contributor and validator records',
    ],
    outcomes: [
      'Digital dictionary',
      'Basic translation utility',
      'AI-ready lexical foundation',
    ],
  },
  {
    id: 'conversational',
    number: 2,
    name: 'Conversational intelligence',
    status: 'planned',
    tagline: 'Grammar, context and domain knowledge in Kasem.',
    focus: [
      'Instructional question-and-answer pairs',
      'Grammar and context',
      'Domain corpora: health, education, agriculture, civic, tourism',
      'Proverbs and idiomatic expressions',
      'Culturally appropriate responses',
    ],
    outcomes: [
      'Stronger text translation',
      'Educational assistants',
      'Domain-specific language APIs',
      'Early conversational AI',
    ],
  },
  {
    id: 'voice',
    number: 3,
    name: 'Voice & multimodal AI',
    status: 'research',
    tagline: 'Giving Kasem a digital voice.',
    focus: [
      'Aligned audio and text',
      'Speaker and dialect diversity',
      'Broadcast and conversational audio',
      'Phonetic mapping',
    ],
    outcomes: [
      'Kasem speech recognition',
      'Kasem voice synthesis',
      'Accessible voice interfaces',
    ],
  },
]

/** Phase-1 dataset target, expressed honestly as a target (not an achievement). */
export const datasetTarget = {
  min: 10000,
  max: 20000,
  label: 'validated entries',
}
