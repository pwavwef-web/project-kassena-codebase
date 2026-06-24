import type { AppUser, Contribution, UploadRecord } from '../types'

type TimestampLike = {
  toDate?: () => Date
  toMillis?: () => number
}

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

export interface AchievementDefinition {
  id: AchievementId
  title: string
  unlockCondition: string
  badgeDesign: string
  target: number
  hidden?: boolean
  sortOrder: number
}

export interface AchievementState extends AchievementDefinition {
  progress: number
  progressText: string
  unlocked: boolean
  value: number
}

export interface AchievementClientProgress {
  lastWordOfDayViewedAt: number | null
  socialShares: number
  wordOfDayViewKeys: string[]
  wordOfDayViews: number
}

interface AchievementEvaluationInput {
  clientProgress?: AchievementClientProgress
  communityRank?: number | null
  contributions: Contribution[]
  currentRank?: number | null
  uploads: UploadRecord[]
  user?: AppUser | null
}

interface AchievementMetrics {
  acceptedCorrections: number
  activitySpanYears: number
  approvedAudio: number
  approvedContributions: Contribution[]
  approvedContributionCount: number
  approvedCulturalNotes: number
  approvedExampleSentences: number
  approvalRate: number
  bountyChallengeCount: number
  communityRank: number | null
  contributionStreak: number
  currentRank: number | null
  hasCulturalBridge: boolean
  hasFirstContribution: boolean
  hasLastWord: boolean
  hasMidnightContribution: boolean
  hasMissingTranslation: boolean
  hasRevivalistWord: boolean
  hasStoryOrProverb: boolean
  hasTripleThreat: boolean
  perfectApprovalRun: number
  reviewedSubmissions: number
  schoolRank: number | null
  socialShares: number
  uniqueDialects: number
  validatedSentencePairs: number
  wordOfDayViews: number
}

export const ACHIEVEMENT_PROGRESS_EVENT =
  'project-kasena-achievement-progress'

const storagePrefix = 'project-kasena-achievement-progress'
const dayMs = 24 * 60 * 60 * 1000
const hiddenAchievementIds = new Set<AchievementId>([
  'last-word',
  'revivalist',
  'perfect-scholar',
  'triple-threat',
  'cultural-bridge',
])

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-word',
    title: 'First Word',
    unlockCondition: 'Submit first contribution',
    badgeDesign: 'Tiny seed growing from Kasena soil',
    target: 1,
    sortOrder: 10,
  },
  {
    id: 'rising-voice',
    title: 'Rising Voice',
    unlockCondition: '10 approved contributions',
    badgeDesign: 'Speech bubble with golden spark',
    target: 10,
    sortOrder: 20,
  },
  {
    id: 'language-keeper',
    title: 'Language Keeper',
    unlockCondition: '50 approved contributions',
    badgeDesign: 'Open book with shield',
    target: 50,
    sortOrder: 30,
  },
  {
    id: 'word-hunter',
    title: 'Word Hunter',
    unlockCondition: 'Discover and submit missing translation',
    badgeDesign: 'Magnifying glass over Kasem symbol',
    target: 1,
    sortOrder: 40,
  },
  {
    id: 'story-weaver',
    title: 'Story Weaver',
    unlockCondition: 'Submit first proverb or story',
    badgeDesign: 'Woven basket pattern',
    target: 1,
    sortOrder: 50,
  },
  {
    id: 'sentence-builder',
    title: 'Sentence Builder',
    unlockCondition: '25 approved example sentences',
    badgeDesign: 'Stacked speech scrolls',
    target: 25,
    sortOrder: 60,
  },
  {
    id: 'dialect-guardian',
    title: 'Dialect Guardian',
    unlockCondition: 'Submit entries from multiple dialects',
    badgeDesign: 'Three connected village huts',
    target: 2,
    sortOrder: 70,
  },
  {
    id: 'audio-pioneer',
    title: 'Audio Pioneer',
    unlockCondition: 'First approved audio recording',
    badgeDesign: 'Traditional drum + microphone',
    target: 1,
    sortOrder: 80,
  },
  {
    id: 'cultural-archivist',
    title: 'Cultural Archivist',
    unlockCondition: '10 approved cultural notes',
    badgeDesign: 'Ancient scroll with Adinkra-style border',
    target: 10,
    sortOrder: 90,
  },
  {
    id: 'community-helper',
    title: 'Community Helper',
    unlockCondition: '25 accepted corrections',
    badgeDesign: 'Helping hands around a word',
    target: 25,
    sortOrder: 100,
  },
  {
    id: 'knowledge-river',
    title: 'Knowledge River',
    unlockCondition: '100 approved contributions',
    badgeDesign: 'Flowing river of glowing words',
    target: 100,
    sortOrder: 110,
  },
  {
    id: 'elders-trust',
    title: "Elder's Trust",
    unlockCondition: '95%+ approval rate after 50 submissions',
    badgeDesign: "Elder's staff with gold ring",
    target: 95,
    sortOrder: 120,
  },
  {
    id: 'bounty-hunter',
    title: 'Bounty Hunter',
    unlockCondition: 'Complete 5 bounty board challenges',
    badgeDesign: 'Crossed spears with reward coin',
    target: 5,
    sortOrder: 130,
  },
  {
    id: 'school-champion',
    title: 'School Champion',
    unlockCondition: 'Top contributor in school leaderboard',
    badgeDesign: 'School crest with laurel wreath',
    target: 1,
    sortOrder: 140,
  },
  {
    id: 'community-champion',
    title: 'Community Champion',
    unlockCondition: 'Top contributor in community leaderboard',
    badgeDesign: 'Crown over village skyline',
    target: 1,
    sortOrder: 150,
  },
  {
    id: 'consistency-master',
    title: 'Consistency Master',
    unlockCondition: 'Contribute 30 consecutive days',
    badgeDesign: 'Rising sun over baobab tree',
    target: 30,
    sortOrder: 160,
  },
  {
    id: 'midnight-scholar',
    title: 'Midnight Scholar',
    unlockCondition: 'Contribute after Word of the Day refresh',
    badgeDesign: 'Moon and glowing manuscript',
    target: 1,
    sortOrder: 170,
  },
  {
    id: 'word-of-the-day-explorer',
    title: 'Word of the Day Explorer',
    unlockCondition: 'View 30 Words of the Day',
    badgeDesign: 'Compass over open dictionary',
    target: 30,
    sortOrder: 180,
  },
  {
    id: 'knowledge-sharer',
    title: 'Knowledge Sharer',
    unlockCondition: 'Share 20 entries to social media',
    badgeDesign: 'Flying paper plane made of words',
    target: 20,
    sortOrder: 190,
  },
  {
    id: 'verification-legend',
    title: 'Verification Legend',
    unlockCondition: '500 approved contributions',
    badgeDesign: 'Golden validator stamp',
    target: 500,
    sortOrder: 200,
  },
  {
    id: 'corpus-builder',
    title: 'Corpus Builder',
    unlockCondition: '1,000 approved contributions',
    badgeDesign: 'Monument built from floating words',
    target: 1000,
    sortOrder: 210,
  },
  {
    id: 'ai-trainer',
    title: 'AI Trainer',
    unlockCondition: 'Contribute 500 validated sentence pairs',
    badgeDesign: 'Circuit board fused with traditional symbol',
    target: 500,
    sortOrder: 220,
  },
  {
    id: 'language-hero',
    title: 'Language Hero',
    unlockCondition: '2,500 approved contributions',
    badgeDesign: 'Hero silhouette holding glowing book',
    target: 2500,
    sortOrder: 230,
  },
  {
    id: 'kasena-legend',
    title: 'Kasena Legend',
    unlockCondition: '5,000 approved contributions',
    badgeDesign: 'Royal crown crafted from Kasem glyphs',
    target: 5000,
    sortOrder: 240,
  },
  {
    id: 'living-archive',
    title: 'Living Archive',
    unlockCondition: 'Contribute over 5 years',
    badgeDesign: 'Ancient baobab with digital roots',
    target: 5,
    sortOrder: 250,
  },
  {
    id: 'last-word',
    title: 'The Last Word',
    unlockCondition: 'Submit a word nobody else had contributed before',
    badgeDesign: 'Golden key opening an ancient manuscript',
    hidden: true,
    target: 1,
    sortOrder: 300,
  },
  {
    id: 'revivalist',
    title: 'Revivalist',
    unlockCondition: 'Contribute a word marked endangered or rarely used',
    badgeDesign: 'Phoenix made of Kasem characters',
    hidden: true,
    target: 1,
    sortOrder: 310,
  },
  {
    id: 'perfect-scholar',
    title: 'Perfect Scholar',
    unlockCondition: '100 consecutive approved submissions',
    badgeDesign: 'Crystal shield with checkmarks',
    hidden: true,
    target: 100,
    sortOrder: 320,
  },
  {
    id: 'triple-threat',
    title: 'Triple Threat',
    unlockCondition: 'Contribute word, example sentence, and audio for the same entry',
    badgeDesign: 'Three interlocking gold rings',
    hidden: true,
    target: 1,
    sortOrder: 330,
  },
  {
    id: 'cultural-bridge',
    title: 'Cultural Bridge',
    unlockCondition: 'Contribute both modern and traditional versions of a term',
    badgeDesign: 'Stone bridge connecting old and new villages',
    hidden: true,
    target: 1,
    sortOrder: 340,
  },
]

export const REGULAR_ACHIEVEMENT_COUNT = ACHIEVEMENTS.filter(
  (achievement) => !achievement.hidden,
).length

const getStorageKey = (userId?: string | null) =>
  `${storagePrefix}:${userId || 'guest'}`

const emptyClientProgress: AchievementClientProgress = {
  lastWordOfDayViewedAt: null,
  socialShares: 0,
  wordOfDayViewKeys: [],
  wordOfDayViews: 0,
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getRecordNumber = (
  value: unknown,
  keys: string[],
): number | null => {
  if (!isRecord(value)) {
    return null
  }

  for (const key of keys) {
    const candidate = value[key]
    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
      return candidate
    }
  }

  return null
}

const getRecordBoolean = (value: unknown, keys: string[]): boolean => {
  if (!isRecord(value)) {
    return false
  }

  return keys.some((key) => value[key] === true)
}

const normalizeProgress = (value: unknown): AchievementClientProgress => {
  if (!isRecord(value)) {
    return emptyClientProgress
  }

  const wordOfDayViewKeys = Array.isArray(value.wordOfDayViewKeys)
    ? value.wordOfDayViewKeys.filter(
        (item): item is string => typeof item === 'string',
      )
    : []
  const socialShares =
    typeof value.socialShares === 'number' && Number.isFinite(value.socialShares)
      ? value.socialShares
      : 0
  const lastWordOfDayViewedAt =
    typeof value.lastWordOfDayViewedAt === 'number' &&
    Number.isFinite(value.lastWordOfDayViewedAt)
      ? value.lastWordOfDayViewedAt
      : null

  return {
    lastWordOfDayViewedAt,
    socialShares,
    wordOfDayViewKeys,
    wordOfDayViews: wordOfDayViewKeys.length,
  }
}

const emitProgressEvent = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(ACHIEVEMENT_PROGRESS_EVENT))
}

const writeAchievementProgress = (
  userId: string | null | undefined,
  progress: AchievementClientProgress,
) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(getStorageKey(userId), JSON.stringify(progress))
  emitProgressEvent()
}

export const readAchievementProgress = (
  userId?: string | null,
): AchievementClientProgress => {
  if (typeof window === 'undefined') {
    return emptyClientProgress
  }

  try {
    return normalizeProgress(
      JSON.parse(window.localStorage.getItem(getStorageKey(userId)) ?? '{}'),
    )
  } catch {
    return emptyClientProgress
  }
}

export const recordWordOfTheDayView = (
  userId: string | null | undefined,
  wordKey: string,
) => {
  const progress = readAchievementProgress(userId)
  const todayKey = new Date().toISOString().slice(0, 10)
  const normalizedWord = wordKey.trim().toLowerCase() || 'word'
  const viewKey = `${todayKey}:${normalizedWord}`

  if (!progress.wordOfDayViewKeys.includes(viewKey)) {
    progress.wordOfDayViewKeys = [...progress.wordOfDayViewKeys, viewKey]
    progress.wordOfDayViews = progress.wordOfDayViewKeys.length
  }

  progress.lastWordOfDayViewedAt = Date.now()
  writeAchievementProgress(userId, progress)
}

export const recordAchievementShare = (userId?: string | null) => {
  const progress = readAchievementProgress(userId)
  progress.socialShares += 1
  writeAchievementProgress(userId, progress)
}

const getMillis = (value?: TimestampLike | null): number =>
  value?.toMillis?.() ?? value?.toDate?.().getTime() ?? 0

const getDate = (value?: TimestampLike | null): Date | null => {
  const millis = getMillis(value)
  return millis ? new Date(millis) : null
}

const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const dayKey = (date: Date): string => startOfDay(date).toISOString()

const includesAny = (value: string, needles: string[]): boolean => {
  const normalized = value.toLowerCase()
  return needles.some((needle) => normalized.includes(needle))
}

const contributionText = (contribution: Contribution): string =>
  [
    contribution.contributionType,
    contribution.englishText,
    contribution.kasemText,
    contribution.alternateKasemTerms,
    contribution.englishExample,
    contribution.kasemExample,
    contribution.dialect,
    contribution.partOfSpeech,
    contribution.category,
    contribution.notes,
    contribution.wordUseRules,
    contribution.pronunciation,
    contribution.culturalNote,
    contribution.selectedBountyTitle,
  ]
    .filter(Boolean)
    .join(' ')

const uploadText = (upload: UploadRecord): string =>
  [upload.title, upload.description, upload.category, upload.dialect, upload.tags]
    .filter(Boolean)
    .join(' ')

const hasExample = (contribution: Contribution): boolean =>
  Boolean(contribution.englishExample?.trim() || contribution.kasemExample?.trim())

const hasSentencePair = (contribution: Contribution): boolean =>
  Boolean(contribution.englishExample?.trim() && contribution.kasemExample?.trim())

const isStoryOrProverb = (contribution: Contribution): boolean =>
  includesAny(contributionText(contribution), [
    'proverb',
    'story',
    'storytelling',
    'folklore',
    'oral history',
  ])

const hasAudioContribution = (contribution: Contribution): boolean =>
  Boolean(
    contribution.audioUrl?.trim() ||
      contribution.voiceRecordings?.length ||
      contribution.attachedFiles?.some((file) =>
        file.contentType.startsWith('audio/'),
      ),
  )

const isAudioUpload = (upload: UploadRecord): boolean =>
  upload.contentType.startsWith('audio/') ||
  includesAny(uploadText(upload), ['audio', 'voice', 'recording'])

const isCulturalContribution = (contribution: Contribution): boolean =>
  Boolean(contribution.culturalNote?.trim()) ||
  includesAny(contributionText(contribution), [
    'culture',
    'cultural',
    'custom',
    'tradition',
    'traditional',
    'ceremony',
    'heritage',
    'note',
  ])

const isCulturalUpload = (upload: UploadRecord): boolean =>
  includesAny(uploadText(upload), [
    'culture',
    'cultural',
    'custom',
    'tradition',
    'story',
    'folklore',
    'proverb',
    'heritage',
  ])

const isCorrection = (contribution: Contribution): boolean =>
  Boolean(
    getRecordBoolean(contribution, ['isCorrection', 'acceptedCorrection']) ||
      (isRecord(contribution) &&
        typeof contribution.sourceContributionId === 'string' &&
        contribution.sourceContributionId.trim()) ||
      includesAny(contributionText(contribution), ['correction', 'corrected']),
  )

const isMissingTranslation = (contribution: Contribution): boolean =>
  getRecordBoolean(contribution, [
    'isMissingTranslation',
    'missingTranslation',
    'wordHunter',
  ]) ||
  includesAny(contributionText(contribution), [
    'missing translation',
    'missing word',
    'untranslated',
    'translation gap',
    'word hunter',
    'not in dictionary',
  ])

const isLastWord = (contribution: Contribution): boolean =>
  getRecordBoolean(contribution, [
    'isUniqueWord',
    'isFirstKnownContribution',
    'isLastWord',
  ]) ||
  includesAny(contributionText(contribution), [
    'nobody else',
    'never contributed',
    'first known',
    'not in dictionary',
    'new word',
    'unique word',
  ])

const isRevivalist = (contribution: Contribution): boolean =>
  getRecordBoolean(contribution, ['isEndangeredWord', 'isRareWord']) ||
  includesAny(contributionText(contribution), [
    'endangered',
    'rarely used',
    'rare word',
    'forgotten',
    'archaic',
    'revival',
    'revive',
  ])

const hasCulturalBridge = (contribution: Contribution): boolean => {
  const text = contributionText(contribution)
  return (
    getRecordBoolean(contribution, ['hasCulturalBridge']) ||
    (includesAny(text, ['modern', 'new usage']) &&
      includesAny(text, ['traditional', 'old usage', 'ancestral']))
  )
}

const getActivityDates = (
  contributions: Contribution[],
  uploads: UploadRecord[],
): Date[] =>
  [
    ...contributions.map((item) => getDate(item.createdAt)),
    ...uploads.map((item) => getDate(item.createdAt)),
  ].filter((date): date is Date => Boolean(date))

const getLongestDailyStreak = (dates: Date[]): number => {
  const activeDays = Array.from(new Set(dates.map(dayKey))).sort()
  let longestStreak = 0
  let runningStreak = 0
  let previousDate: Date | null = null

  activeDays.forEach((key) => {
    const date = new Date(key)
    if (!previousDate) {
      runningStreak = 1
    } else {
      const diffDays = Math.round(
        (date.getTime() - previousDate.getTime()) / dayMs,
      )
      runningStreak = diffDays === 1 ? runningStreak + 1 : 1
    }

    longestStreak = Math.max(longestStreak, runningStreak)
    previousDate = date
  })

  return longestStreak
}

const getActivitySpanYears = (dates: Date[]): number => {
  if (!dates.length) {
    return 0
  }

  const sorted = [...dates].sort((first, second) => first.getTime() - second.getTime())
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const end = Math.max(last.getTime(), Date.now())

  return (end - first.getTime()) / (365.25 * dayMs)
}

const getSubmissionSortDate = (
  item: {
    createdAt: TimestampLike | null
    reviewedAt?: TimestampLike | null
    updatedAt?: TimestampLike | null
  },
): number =>
  getMillis(item.createdAt) || getMillis(item.reviewedAt) || getMillis(item.updatedAt)

const getLongestApprovedRun = (
  contributions: Contribution[],
  uploads: UploadRecord[],
): number => {
  const reviewed = [...contributions, ...uploads]
    .filter((item) => item.status !== 'pending')
    .sort((first, second) => getSubmissionSortDate(first) - getSubmissionSortDate(second))

  let longestRun = 0
  let runningRun = 0

  reviewed.forEach((item) => {
    if (item.status === 'approved') {
      runningRun += 1
      longestRun = Math.max(longestRun, runningRun)
      return
    }

    runningRun = 0
  })

  return longestRun
}

const getUniqueDialectCount = (contributions: Contribution[]): number => {
  const ignored = new Set(['', 'not sure', 'other'])
  return new Set(
    contributions
      .map((contribution) => contribution.dialect.trim().toLowerCase())
      .filter((dialect) => !ignored.has(dialect)),
  ).size
}

const getSchoolRank = (user?: AppUser | null): number | null => {
  const rank = getRecordNumber(user, [
    'schoolRank',
    'schoolLeaderboardRank',
    'schoolLeaderboardPosition',
  ])

  if (rank) {
    return rank
  }

  return getRecordBoolean(user, ['isSchoolChampion']) ? 1 : null
}

const createMetrics = ({
  clientProgress,
  communityRank = null,
  contributions,
  currentRank = null,
  uploads,
  user,
}: AchievementEvaluationInput): AchievementMetrics => {
  const progress = clientProgress ?? readAchievementProgress(user?.uid)
  const approvedContributions = contributions.filter(
    (item) => item.status === 'approved',
  )
  const approvedUploads = uploads.filter((item) => item.status === 'approved')
  const approvedSubmissionCount =
    approvedContributions.length + approvedUploads.length
  const reviewedSubmissions =
    contributions.filter((item) => item.status !== 'pending').length +
    uploads.filter((item) => item.status !== 'pending').length
  const approvalRate = reviewedSubmissions
    ? (approvedSubmissionCount / reviewedSubmissions) * 100
    : 0
  const activityDates = getActivityDates(contributions, uploads)
  const lastWordView = progress.lastWordOfDayViewedAt ?? 0
  const hasAfterTrackedWordView =
    lastWordView > 0 &&
    contributions.some((contribution) => getMillis(contribution.createdAt) > lastWordView)
  const hasMidnightWindowContribution = contributions.some((contribution) => {
    const date = getDate(contribution.createdAt)
    return date ? date.getHours() >= 0 && date.getHours() < 4 : false
  })

  return {
    acceptedCorrections: approvedContributions.filter(isCorrection).length,
    activitySpanYears: getActivitySpanYears(activityDates),
    approvedAudio:
      approvedContributions.filter(hasAudioContribution).length +
      approvedUploads.filter(isAudioUpload).length,
    approvedContributions,
    approvedContributionCount: approvedContributions.length,
    approvedCulturalNotes:
      approvedContributions.filter(isCulturalContribution).length +
      approvedUploads.filter(isCulturalUpload).length,
    approvedExampleSentences: approvedContributions.filter(hasExample).length,
    approvalRate,
    bountyChallengeCount: new Set(
      approvedContributions
        .map((contribution) => contribution.selectedBountyId?.trim())
        .filter((id): id is string => Boolean(id)),
    ).size,
    communityRank,
    contributionStreak: getLongestDailyStreak(activityDates),
    currentRank,
    hasCulturalBridge: approvedContributions.some(hasCulturalBridge),
    hasFirstContribution: contributions.length > 0,
    hasLastWord: approvedContributions.some(isLastWord),
    hasMidnightContribution:
      hasAfterTrackedWordView || hasMidnightWindowContribution,
    hasMissingTranslation: contributions.some(isMissingTranslation),
    hasRevivalistWord: approvedContributions.some(isRevivalist),
    hasStoryOrProverb: contributions.some(isStoryOrProverb),
    hasTripleThreat: approvedContributions.some(
      (contribution) =>
        Boolean(contribution.englishText?.trim()) &&
        Boolean(contribution.kasemText?.trim()) &&
        hasExample(contribution) &&
        hasAudioContribution(contribution),
    ),
    perfectApprovalRun: getLongestApprovedRun(contributions, uploads),
    reviewedSubmissions,
    schoolRank: getSchoolRank(user),
    socialShares: progress.socialShares,
    uniqueDialects: getUniqueDialectCount(contributions),
    validatedSentencePairs: approvedContributions.filter(hasSentencePair).length,
    wordOfDayViews: progress.wordOfDayViews,
  }
}

const formatNumber = (value: number): string =>
  Math.floor(value).toLocaleString()

const createState = (
  definition: AchievementDefinition,
  value: number,
  target = definition.target,
  progressText?: string,
  unlocked = value >= target,
): AchievementState => ({
  ...definition,
  progress: Math.min(100, (value / Math.max(1, target)) * 100),
  progressText:
    progressText ??
    (unlocked
      ? 'Unlocked'
      : `${formatNumber(value)} / ${formatNumber(target)}`),
  target,
  unlocked,
  value,
})

const evaluateAchievement = (
  definition: AchievementDefinition,
  metrics: AchievementMetrics,
): AchievementState => {
  switch (definition.id) {
    case 'first-word':
      return createState(definition, metrics.hasFirstContribution ? 1 : 0)
    case 'rising-voice':
    case 'language-keeper':
    case 'knowledge-river':
    case 'verification-legend':
    case 'corpus-builder':
    case 'language-hero':
    case 'kasena-legend':
      return createState(definition, metrics.approvedContributionCount)
    case 'word-hunter':
      return createState(definition, metrics.hasMissingTranslation ? 1 : 0)
    case 'story-weaver':
      return createState(definition, metrics.hasStoryOrProverb ? 1 : 0)
    case 'sentence-builder':
      return createState(definition, metrics.approvedExampleSentences)
    case 'dialect-guardian':
      return createState(definition, metrics.uniqueDialects)
    case 'audio-pioneer':
      return createState(definition, metrics.approvedAudio)
    case 'cultural-archivist':
      return createState(definition, metrics.approvedCulturalNotes)
    case 'community-helper':
      return createState(definition, metrics.acceptedCorrections)
    case 'elders-trust': {
      const hasEnoughSubmissions = metrics.reviewedSubmissions >= 50
      const unlocked = hasEnoughSubmissions && metrics.approvalRate >= 95
      const value = hasEnoughSubmissions
        ? metrics.approvalRate
        : metrics.reviewedSubmissions
      const target = hasEnoughSubmissions ? 95 : 50
      const progressText = hasEnoughSubmissions
        ? `${Math.round(metrics.approvalRate)}% / 95%`
        : `${metrics.reviewedSubmissions} / 50 reviewed`

      return createState(definition, value, target, progressText, unlocked)
    }
    case 'bounty-hunter':
      return createState(definition, metrics.bountyChallengeCount)
    case 'school-champion':
      return createState(
        definition,
        metrics.schoolRank === 1 ? 1 : 0,
        1,
        metrics.schoolRank ? `Rank #${metrics.schoolRank}` : 'Rank #1 needed',
      )
    case 'community-champion':
      return createState(
        definition,
        metrics.communityRank === 1 ? 1 : 0,
        1,
        metrics.communityRank
          ? `Community rank #${metrics.communityRank}`
          : 'Community rank #1 needed',
      )
    case 'consistency-master':
      return createState(definition, metrics.contributionStreak)
    case 'midnight-scholar':
      return createState(definition, metrics.hasMidnightContribution ? 1 : 0)
    case 'word-of-the-day-explorer':
      return createState(definition, metrics.wordOfDayViews)
    case 'knowledge-sharer':
      return createState(definition, metrics.socialShares)
    case 'ai-trainer':
      return createState(definition, metrics.validatedSentencePairs)
    case 'living-archive': {
      const years = Math.floor(metrics.activitySpanYears)
      return createState(
        definition,
        metrics.activitySpanYears,
        definition.target,
        `${years} / 5 years`,
      )
    }
    case 'last-word':
      return createState(definition, metrics.hasLastWord ? 1 : 0)
    case 'revivalist':
      return createState(definition, metrics.hasRevivalistWord ? 1 : 0)
    case 'perfect-scholar':
      return createState(definition, metrics.perfectApprovalRun)
    case 'triple-threat':
      return createState(definition, metrics.hasTripleThreat ? 1 : 0)
    case 'cultural-bridge':
      return createState(definition, metrics.hasCulturalBridge ? 1 : 0)
    default:
      return createState(definition, 0)
  }
}

export const getAchievementStates = (
  input: AchievementEvaluationInput,
): AchievementState[] => {
  const metrics = createMetrics(input)

  return ACHIEVEMENTS.map((definition) =>
    evaluateAchievement(definition, metrics),
  )
    .filter(
      (achievement) =>
        !hiddenAchievementIds.has(achievement.id) || achievement.unlocked,
    )
    .sort((first, second) => first.sortOrder - second.sortOrder)
}
