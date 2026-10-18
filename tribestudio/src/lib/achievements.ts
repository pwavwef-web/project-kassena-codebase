export type AchievementId =
  | 'first-word'
  | 'rising-voice'
  | 'language-keeper'
  | 'word-hunter'
  | 'story-weaver'
  | 'sentence-builder'
  | 'dialect-guardian'
  | 'audio-pioneer'
  | 'cultural-archivist'
  | 'community-helper'
  | 'knowledge-river'
  | 'elders-trust'
  | 'bounty-hunter'
  | 'school-champion'
  | 'community-champion'
  | 'consistency-master'
  | 'midnight-scholar'
  | 'word-of-the-day-explorer'
  | 'knowledge-sharer'
  | 'verification-legend'
  | 'corpus-builder'
  | 'ai-trainer'
  | 'language-hero'
  | 'kasena-legend'
  | 'living-archive'
  | 'last-word'
  | 'revivalist'
  | 'perfect-scholar'
  | 'triple-threat'
  | 'cultural-bridge'

export type AchievementCategory =
  | 'Contribution'
  | 'Specialization'
  | 'Quality'
  | 'Challenges'
  | 'Engagement'
  | 'Hidden'

export interface AchievementDefinition {
  id: AchievementId
  title: string
  unlockCondition: string
  badgeDesign: string
  target: number
  category: AchievementCategory
  hidden?: boolean
  sortOrder: number
}

export interface AchievementState extends AchievementDefinition {
  asset: string
  progress: number
  progressText: string
  unlocked: boolean
  value: number
}

export interface AchievementProfile {
  id: string
  displayName: string
  initials: string
  community: string
  role: string
  points: number
  rank: string
  qualityScore: number
  level: number
  learningProgress: number
  contributionsSubmitted: number
  savedContent: number
  firstContributionSubmitted: boolean
  approvedContributions: number
  missingTranslationSubmitted: boolean
  storyOrProverbSubmitted: boolean
  approvedExampleSentences: number
  uniqueDialects: number
  approvedAudio: number
  approvedCulturalNotes: number
  acceptedCorrections: number
  reviewedSubmissions: number
  approvalRate: number
  bountyChallengesCompleted: number
  schoolLeaderboardRank: number | null
  communityLeaderboardRank: number | null
  longestContributionStreak: number
  contributedAfterWordRefresh: boolean
  wordOfDayViews: number
  socialShares: number
  validatedSentencePairs: number
  activeYears: number
  uniqueWordSubmitted: boolean
  endangeredWordContributed: boolean
  perfectApprovalRun: number
  tripleThreatEntry: boolean
  culturalBridgeContribution: boolean
  unlockedAchievementIds: AchievementId[]
  updatedAt: string
}

export interface AchievementSummary {
  total: number
  unlocked: number
  locked: number
  regularTotal: number
  regularUnlocked: number
  hiddenTotal: number
  hiddenUnlocked: number
  nextLocked: AchievementState | null
}

export interface AchievementAssetAudit {
  total: number
  mapped: number
  missing: AchievementDefinition[]
}

export const achievementStorageKey = 'tribestudio:achievement-profile'

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-word',
    title: 'First Word',
    unlockCondition: 'Submit first contribution',
    badgeDesign: 'Tiny seed growing from Kasena soil',
    target: 1,
    category: 'Contribution',
    sortOrder: 10,
  },
  {
    id: 'rising-voice',
    title: 'Rising Voice',
    unlockCondition: '10 approved contributions',
    badgeDesign: 'Speech bubble with golden spark',
    target: 10,
    category: 'Contribution',
    sortOrder: 20,
  },
  {
    id: 'language-keeper',
    title: 'Language Keeper',
    unlockCondition: '50 approved contributions',
    badgeDesign: 'Open book with shield',
    target: 50,
    category: 'Contribution',
    sortOrder: 30,
  },
  {
    id: 'word-hunter',
    title: 'Word Hunter',
    unlockCondition: 'Discover and submit missing translation',
    badgeDesign: 'Magnifying glass over Kasem symbol',
    target: 1,
    category: 'Specialization',
    sortOrder: 40,
  },
  {
    id: 'story-weaver',
    title: 'Story Weaver',
    unlockCondition: 'Submit first proverb or story',
    badgeDesign: 'Woven basket pattern',
    target: 1,
    category: 'Specialization',
    sortOrder: 50,
  },
  {
    id: 'sentence-builder',
    title: 'Sentence Builder',
    unlockCondition: '25 approved example sentences',
    badgeDesign: 'Stacked speech scrolls',
    target: 25,
    category: 'Specialization',
    sortOrder: 60,
  },
  {
    id: 'dialect-guardian',
    title: 'Dialect Guardian',
    unlockCondition: 'Submit entries from multiple dialects',
    badgeDesign: 'Three connected village huts',
    target: 2,
    category: 'Specialization',
    sortOrder: 70,
  },
  {
    id: 'audio-pioneer',
    title: 'Audio Pioneer',
    unlockCondition: 'First approved audio recording',
    badgeDesign: 'Traditional drum + microphone',
    target: 1,
    category: 'Specialization',
    sortOrder: 80,
  },
  {
    id: 'cultural-archivist',
    title: 'Cultural Archivist',
    unlockCondition: '10 approved cultural notes',
    badgeDesign: 'Ancient scroll with Adinkra-style border',
    target: 10,
    category: 'Specialization',
    sortOrder: 90,
  },
  {
    id: 'community-helper',
    title: 'Community Helper',
    unlockCondition: '25 accepted corrections',
    badgeDesign: 'Helping hands around a word',
    target: 25,
    category: 'Specialization',
    sortOrder: 100,
  },
  {
    id: 'knowledge-river',
    title: 'Knowledge River',
    unlockCondition: '100 approved contributions',
    badgeDesign: 'Flowing river of glowing words',
    target: 100,
    category: 'Contribution',
    sortOrder: 110,
  },
  {
    id: 'elders-trust',
    title: "Elder's Trust",
    unlockCondition: '95%+ approval rate after 50 submissions',
    badgeDesign: "Elder's staff with gold ring",
    target: 95,
    category: 'Quality',
    sortOrder: 120,
  },
  {
    id: 'bounty-hunter',
    title: 'Bounty Hunter',
    unlockCondition: 'Complete 5 bounty board challenges',
    badgeDesign: 'Crossed spears with reward coin',
    target: 5,
    category: 'Challenges',
    sortOrder: 130,
  },
  {
    id: 'school-champion',
    title: 'School Champion',
    unlockCondition: 'Top contributor in school leaderboard',
    badgeDesign: 'School crest with laurel wreath',
    target: 1,
    category: 'Challenges',
    sortOrder: 140,
  },
  {
    id: 'community-champion',
    title: 'Community Champion',
    unlockCondition: 'Top contributor in community leaderboard',
    badgeDesign: 'Crown over village skyline',
    target: 1,
    category: 'Challenges',
    sortOrder: 150,
  },
  {
    id: 'consistency-master',
    title: 'Consistency Master',
    unlockCondition: 'Contribute 30 consecutive days',
    badgeDesign: 'Rising sun over baobab tree',
    target: 30,
    category: 'Engagement',
    sortOrder: 160,
  },
  {
    id: 'midnight-scholar',
    title: 'Midnight Scholar',
    unlockCondition: 'Contribute after Word of the Day refresh',
    badgeDesign: 'Moon and glowing manuscript',
    target: 1,
    category: 'Engagement',
    sortOrder: 170,
  },
  {
    id: 'word-of-the-day-explorer',
    title: 'Word of the Day Explorer',
    unlockCondition: 'View 30 Words of the Day',
    badgeDesign: 'Compass over open dictionary',
    target: 30,
    category: 'Engagement',
    sortOrder: 180,
  },
  {
    id: 'knowledge-sharer',
    title: 'Knowledge Sharer',
    unlockCondition: 'Share 20 entries to social media',
    badgeDesign: 'Flying paper plane made of words',
    target: 20,
    category: 'Engagement',
    sortOrder: 190,
  },
  {
    id: 'verification-legend',
    title: 'Verification Legend',
    unlockCondition: '500 approved contributions',
    badgeDesign: 'Golden validator stamp',
    target: 500,
    category: 'Contribution',
    sortOrder: 200,
  },
  {
    id: 'corpus-builder',
    title: 'Corpus Builder',
    unlockCondition: '1,000 approved contributions',
    badgeDesign: 'Monument built from floating words',
    target: 1000,
    category: 'Contribution',
    sortOrder: 210,
  },
  {
    id: 'ai-trainer',
    title: 'AI Trainer',
    unlockCondition: 'Contribute 500 validated sentence pairs',
    badgeDesign: 'Circuit board fused with traditional symbol',
    target: 500,
    category: 'Engagement',
    sortOrder: 220,
  },
  {
    id: 'language-hero',
    title: 'Language Hero',
    unlockCondition: '2,500 approved contributions',
    badgeDesign: 'Hero silhouette holding glowing book',
    target: 2500,
    category: 'Contribution',
    sortOrder: 230,
  },
  {
    id: 'kasena-legend',
    title: 'Kasena Legend',
    unlockCondition: '5,000 approved contributions',
    badgeDesign: 'Royal crown crafted from Kasem glyphs',
    target: 5000,
    category: 'Contribution',
    sortOrder: 240,
  },
  {
    id: 'living-archive',
    title: 'Living Archive',
    unlockCondition: 'Contribute over 5 years',
    badgeDesign: 'Ancient baobab with digital roots',
    target: 5,
    category: 'Engagement',
    sortOrder: 250,
  },
  {
    id: 'last-word',
    title: 'The Last Word',
    unlockCondition: 'Submit a word nobody else had contributed before',
    badgeDesign: 'Golden key opening an ancient manuscript',
    hidden: true,
    target: 1,
    category: 'Hidden',
    sortOrder: 300,
  },
  {
    id: 'revivalist',
    title: 'Revivalist',
    unlockCondition: 'Contribute a word marked endangered or rarely used',
    badgeDesign: 'Phoenix made of Kasem characters',
    hidden: true,
    target: 1,
    category: 'Hidden',
    sortOrder: 310,
  },
  {
    id: 'perfect-scholar',
    title: 'Perfect Scholar',
    unlockCondition: '100 consecutive approved submissions',
    badgeDesign: 'Crystal shield with checkmarks',
    hidden: true,
    target: 100,
    category: 'Hidden',
    sortOrder: 320,
  },
  {
    id: 'triple-threat',
    title: 'Triple Threat',
    unlockCondition: 'Contribute word, example sentence, and audio for the same entry',
    badgeDesign: 'Three interlocking gold rings',
    hidden: true,
    target: 1,
    category: 'Hidden',
    sortOrder: 330,
  },
  {
    id: 'cultural-bridge',
    title: 'Cultural Bridge',
    unlockCondition: 'Contribute both modern and traditional versions of a term',
    badgeDesign: 'Stone bridge connecting old and new villages',
    hidden: true,
    target: 1,
    category: 'Hidden',
    sortOrder: 340,
  },
]

export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  'Contribution',
  'Specialization',
  'Quality',
  'Challenges',
  'Engagement',
  'Hidden',
]

export const ACHIEVEMENT_BADGE_ASSET_IDS: AchievementId[] = [
  'ai-trainer',
  'audio-pioneer',
  'bounty-hunter',
  'community-champion',
  'community-helper',
  'consistency-master',
  'corpus-builder',
  'cultural-archivist',
  'cultural-bridge',
  'dialect-guardian',
  'elders-trust',
  'first-word',
  'kasena-legend',
  'knowledge-river',
  'knowledge-sharer',
  'language-hero',
  'language-keeper',
  'last-word',
  'living-archive',
  'midnight-scholar',
  'perfect-scholar',
  'revivalist',
  'rising-voice',
  'school-champion',
  'sentence-builder',
  'story-weaver',
  'triple-threat',
  'verification-legend',
  'word-hunter',
  'word-of-the-day-explorer',
]

export const DEFAULT_ACHIEVEMENT_PROFILE: AchievementProfile = {
  id: 'demo-contributor',
  displayName: 'Demo Contributor',
  initials: 'DC',
  community: 'Kasem language team placeholder',
  role: 'Contributor',
  points: 840,
  rank: 'Language Steward',
  qualityScore: 92,
  level: 4,
  learningProgress: 42,
  contributionsSubmitted: 12,
  savedContent: 8,
  firstContributionSubmitted: true,
  approvedContributions: 8,
  missingTranslationSubmitted: false,
  storyOrProverbSubmitted: true,
  approvedExampleSentences: 11,
  uniqueDialects: 2,
  approvedAudio: 0,
  approvedCulturalNotes: 3,
  acceptedCorrections: 4,
  reviewedSubmissions: 10,
  approvalRate: 92,
  bountyChallengesCompleted: 1,
  schoolLeaderboardRank: 4,
  communityLeaderboardRank: 8,
  longestContributionStreak: 7,
  contributedAfterWordRefresh: false,
  wordOfDayViews: 9,
  socialShares: 3,
  validatedSentencePairs: 11,
  activeYears: 0.4,
  uniqueWordSubmitted: false,
  endangeredWordContributed: false,
  perfectApprovalRun: 8,
  tripleThreatEntry: false,
  culturalBridgeContribution: false,
  unlockedAchievementIds: [],
  updatedAt: '2026-07-05T00:00:00.000Z',
}

const achievementIdSet = new Set<AchievementId>(
  ACHIEVEMENTS.map((achievement) => achievement.id),
)

const assetIdSet = new Set<AchievementId>(ACHIEVEMENT_BADGE_ASSET_IDS)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const cloneDefaultProfile = (): AchievementProfile => ({
  ...DEFAULT_ACHIEVEMENT_PROFILE,
  unlockedAchievementIds: [...DEFAULT_ACHIEVEMENT_PROFILE.unlockedAchievementIds],
})

const toFiniteNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const toNullableRank = (
  value: unknown,
  fallback: number | null,
): number | null => {
  if (value === null) {
    return null
  }

  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

const toBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback

const toStringValue = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() ? value : fallback

const sanitizeAchievementIds = (value: unknown): AchievementId[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(
    (item): item is AchievementId =>
      typeof item === 'string' && achievementIdSet.has(item as AchievementId),
  )
}

export const getAchievementAssetSrc = (id: AchievementId): string =>
  `/achievements/${id}.png`

export const normalizeAchievementProfile = (
  value: unknown,
): AchievementProfile => {
  const fallback = cloneDefaultProfile()

  if (!isRecord(value)) {
    return fallback
  }

  return {
    ...fallback,
    id: toStringValue(value.id, fallback.id),
    displayName: toStringValue(value.displayName, fallback.displayName),
    initials: toStringValue(value.initials, fallback.initials),
    community: toStringValue(value.community, fallback.community),
    role: toStringValue(value.role, fallback.role),
    points: toFiniteNumber(value.points, fallback.points),
    rank: toStringValue(value.rank, fallback.rank),
    qualityScore: toFiniteNumber(value.qualityScore, fallback.qualityScore),
    level: toFiniteNumber(value.level, fallback.level),
    learningProgress: toFiniteNumber(value.learningProgress, fallback.learningProgress),
    contributionsSubmitted: toFiniteNumber(
      value.contributionsSubmitted,
      fallback.contributionsSubmitted,
    ),
    savedContent: toFiniteNumber(value.savedContent, fallback.savedContent),
    firstContributionSubmitted: toBoolean(
      value.firstContributionSubmitted,
      fallback.firstContributionSubmitted,
    ),
    approvedContributions: toFiniteNumber(
      value.approvedContributions,
      fallback.approvedContributions,
    ),
    missingTranslationSubmitted: toBoolean(
      value.missingTranslationSubmitted,
      fallback.missingTranslationSubmitted,
    ),
    storyOrProverbSubmitted: toBoolean(
      value.storyOrProverbSubmitted,
      fallback.storyOrProverbSubmitted,
    ),
    approvedExampleSentences: toFiniteNumber(
      value.approvedExampleSentences,
      fallback.approvedExampleSentences,
    ),
    uniqueDialects: toFiniteNumber(value.uniqueDialects, fallback.uniqueDialects),
    approvedAudio: toFiniteNumber(value.approvedAudio, fallback.approvedAudio),
    approvedCulturalNotes: toFiniteNumber(
      value.approvedCulturalNotes,
      fallback.approvedCulturalNotes,
    ),
    acceptedCorrections: toFiniteNumber(
      value.acceptedCorrections,
      fallback.acceptedCorrections,
    ),
    reviewedSubmissions: toFiniteNumber(
      value.reviewedSubmissions,
      fallback.reviewedSubmissions,
    ),
    approvalRate: toFiniteNumber(value.approvalRate, fallback.approvalRate),
    bountyChallengesCompleted: toFiniteNumber(
      value.bountyChallengesCompleted,
      fallback.bountyChallengesCompleted,
    ),
    schoolLeaderboardRank: toNullableRank(
      value.schoolLeaderboardRank,
      fallback.schoolLeaderboardRank,
    ),
    communityLeaderboardRank: toNullableRank(
      value.communityLeaderboardRank,
      fallback.communityLeaderboardRank,
    ),
    longestContributionStreak: toFiniteNumber(
      value.longestContributionStreak,
      fallback.longestContributionStreak,
    ),
    contributedAfterWordRefresh: toBoolean(
      value.contributedAfterWordRefresh,
      fallback.contributedAfterWordRefresh,
    ),
    wordOfDayViews: toFiniteNumber(value.wordOfDayViews, fallback.wordOfDayViews),
    socialShares: toFiniteNumber(value.socialShares, fallback.socialShares),
    validatedSentencePairs: toFiniteNumber(
      value.validatedSentencePairs,
      fallback.validatedSentencePairs,
    ),
    activeYears: toFiniteNumber(value.activeYears, fallback.activeYears),
    uniqueWordSubmitted: toBoolean(
      value.uniqueWordSubmitted,
      fallback.uniqueWordSubmitted,
    ),
    endangeredWordContributed: toBoolean(
      value.endangeredWordContributed,
      fallback.endangeredWordContributed,
    ),
    perfectApprovalRun: toFiniteNumber(
      value.perfectApprovalRun,
      fallback.perfectApprovalRun,
    ),
    tripleThreatEntry: toBoolean(
      value.tripleThreatEntry,
      fallback.tripleThreatEntry,
    ),
    culturalBridgeContribution: toBoolean(
      value.culturalBridgeContribution,
      fallback.culturalBridgeContribution,
    ),
    unlockedAchievementIds: sanitizeAchievementIds(value.unlockedAchievementIds),
    updatedAt: toStringValue(value.updatedAt, fallback.updatedAt),
  }
}

export const readAchievementProfile = (): AchievementProfile => {
  if (typeof window === 'undefined') {
    return cloneDefaultProfile()
  }

  try {
    return normalizeAchievementProfile(
      JSON.parse(window.localStorage.getItem(achievementStorageKey) ?? '{}'),
    )
  } catch {
    return cloneDefaultProfile()
  }
}

export const writeAchievementProfile = (
  profile: AchievementProfile,
): AchievementProfile => {
  const nextProfile = normalizeAchievementProfile({
    ...profile,
    updatedAt: new Date().toISOString(),
  })

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(achievementStorageKey, JSON.stringify(nextProfile))
  }

  return nextProfile
}

export const resetAchievementProfile = (): AchievementProfile => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(achievementStorageKey)
  }

  return cloneDefaultProfile()
}

const formatNumber = (value: number): string =>
  Math.floor(value).toLocaleString()

const formatYears = (value: number): string =>
  `${Number.isInteger(value) ? value : value.toFixed(1)} / 5 years`

const createState = (
  definition: AchievementDefinition,
  value: number,
  target = definition.target,
  progressText?: string,
  conditionUnlocked = value >= target,
): AchievementState => ({
  ...definition,
  asset: getAchievementAssetSrc(definition.id),
  progress: Math.min(100, (Math.max(0, value) / Math.max(1, target)) * 100),
  progressText:
    conditionUnlocked
      ? 'Unlocked'
      : progressText ?? `${formatNumber(value)} / ${formatNumber(target)}`,
  target,
  unlocked: conditionUnlocked,
  value,
})

const getRankState = (
  definition: AchievementDefinition,
  rank: number | null,
  label: string,
): AchievementState =>
  createState(
    definition,
    rank === 1 ? 1 : 0,
    1,
    rank ? `${label} rank #${rank}` : `${label} rank #1 needed`,
    rank === 1,
  )

const evaluateAchievement = (
  definition: AchievementDefinition,
  profile: AchievementProfile,
): AchievementState => {
  switch (definition.id) {
    case 'first-word':
      return createState(
        definition,
        profile.firstContributionSubmitted || profile.contributionsSubmitted > 0
          ? 1
          : 0,
      )
    case 'rising-voice':
    case 'language-keeper':
    case 'knowledge-river':
    case 'verification-legend':
    case 'corpus-builder':
    case 'language-hero':
    case 'kasena-legend':
      return createState(definition, profile.approvedContributions)
    case 'word-hunter':
      return createState(definition, profile.missingTranslationSubmitted ? 1 : 0)
    case 'story-weaver':
      return createState(definition, profile.storyOrProverbSubmitted ? 1 : 0)
    case 'sentence-builder':
      return createState(definition, profile.approvedExampleSentences)
    case 'dialect-guardian':
      return createState(definition, profile.uniqueDialects)
    case 'audio-pioneer':
      return createState(definition, profile.approvedAudio)
    case 'cultural-archivist':
      return createState(definition, profile.approvedCulturalNotes)
    case 'community-helper':
      return createState(definition, profile.acceptedCorrections)
    case 'elders-trust': {
      const hasEnoughSubmissions = profile.reviewedSubmissions >= 50
      const unlocked = hasEnoughSubmissions && profile.approvalRate >= 95

      return createState(
        definition,
        hasEnoughSubmissions ? profile.approvalRate : profile.reviewedSubmissions,
        hasEnoughSubmissions ? 95 : 50,
        hasEnoughSubmissions
          ? `${Math.round(profile.approvalRate)}% / 95%`
          : `${formatNumber(profile.reviewedSubmissions)} / 50 reviewed`,
        unlocked,
      )
    }
    case 'bounty-hunter':
      return createState(definition, profile.bountyChallengesCompleted)
    case 'school-champion':
      return getRankState(definition, profile.schoolLeaderboardRank, 'School')
    case 'community-champion':
      return getRankState(definition, profile.communityLeaderboardRank, 'Community')
    case 'consistency-master':
      return createState(definition, profile.longestContributionStreak)
    case 'midnight-scholar':
      return createState(definition, profile.contributedAfterWordRefresh ? 1 : 0)
    case 'word-of-the-day-explorer':
      return createState(definition, profile.wordOfDayViews)
    case 'knowledge-sharer':
      return createState(definition, profile.socialShares)
    case 'ai-trainer':
      return createState(definition, profile.validatedSentencePairs)
    case 'living-archive':
      return createState(
        definition,
        profile.activeYears,
        definition.target,
        formatYears(profile.activeYears),
      )
    case 'last-word':
      return createState(definition, profile.uniqueWordSubmitted ? 1 : 0)
    case 'revivalist':
      return createState(definition, profile.endangeredWordContributed ? 1 : 0)
    case 'perfect-scholar':
      return createState(definition, profile.perfectApprovalRun)
    case 'triple-threat':
      return createState(definition, profile.tripleThreatEntry ? 1 : 0)
    case 'cultural-bridge':
      return createState(definition, profile.culturalBridgeContribution ? 1 : 0)
    default:
      return createState(definition, 0)
  }
}

const applyPersistedUnlock = (
  state: AchievementState,
  profile: AchievementProfile,
): AchievementState => {
  if (!profile.unlockedAchievementIds.includes(state.id) || state.unlocked) {
    return state
  }

  return {
    ...state,
    progress: 100,
    progressText: 'Unlocked',
    unlocked: true,
  }
}

export const getAchievementStates = (
  profile: AchievementProfile,
): AchievementState[] =>
  ACHIEVEMENTS.map((definition) =>
    applyPersistedUnlock(evaluateAchievement(definition, profile), profile),
  ).sort((first, second) => first.sortOrder - second.sortOrder)

export const getAchievementSummary = (
  states: AchievementState[],
): AchievementSummary => {
  const regularStates = states.filter((state) => !state.hidden)
  const hiddenStates = states.filter((state) => state.hidden)
  const unlockedStates = states.filter((state) => state.unlocked)
  const nextLocked =
    states
      .filter((state) => !state.unlocked && !state.hidden)
      .sort((first, second) => second.progress - first.progress)[0] ?? null

  return {
    total: states.length,
    unlocked: unlockedStates.length,
    locked: states.length - unlockedStates.length,
    regularTotal: regularStates.length,
    regularUnlocked: regularStates.filter((state) => state.unlocked).length,
    hiddenTotal: hiddenStates.length,
    hiddenUnlocked: hiddenStates.filter((state) => state.unlocked).length,
    nextLocked,
  }
}

const sortAchievementIds = (ids: AchievementId[]): AchievementId[] => {
  const order = new Map(
    ACHIEVEMENTS.map((achievement, index) => [achievement.id, index]),
  )

  return [...ids].sort((first, second) => {
    return (order.get(first) ?? 0) - (order.get(second) ?? 0)
  })
}

const areSameIds = (first: AchievementId[], second: AchievementId[]): boolean =>
  first.length === second.length && first.every((id, index) => id === second[index])

export const persistAchievementUnlocks = (
  profile: AchievementProfile,
  states: AchievementState[],
): AchievementProfile => {
  const nextUnlockedAchievementIds = sortAchievementIds(
    Array.from(
      new Set([
        ...profile.unlockedAchievementIds,
        ...states.filter((state) => state.unlocked).map((state) => state.id),
      ]),
    ),
  )

  if (areSameIds(profile.unlockedAchievementIds, nextUnlockedAchievementIds)) {
    return profile
  }

  return writeAchievementProfile({
    ...profile,
    unlockedAchievementIds: nextUnlockedAchievementIds,
  })
}

export const getFeaturedAchievementStates = (
  states: AchievementState[],
  limit = 4,
): AchievementState[] =>
  [...states]
    .filter((state) => !state.hidden || state.unlocked)
    .sort((first, second) => {
      if (first.unlocked !== second.unlocked) {
        return first.unlocked ? -1 : 1
      }

      return second.progress - first.progress || first.sortOrder - second.sortOrder
    })
    .slice(0, limit)

export const getAchievementAssetAudit = (): AchievementAssetAudit => {
  const missing = ACHIEVEMENTS.filter((achievement) => !assetIdSet.has(achievement.id))

  return {
    total: ACHIEVEMENTS.length,
    mapped: ACHIEVEMENTS.length - missing.length,
    missing,
  }
}

export const ACHIEVEMENT_ASSET_AUDIT = getAchievementAssetAudit()
