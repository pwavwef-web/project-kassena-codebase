import type {
  AppUser,
  Contribution,
  LeaderboardPeriod,
  ReviewStatus,
  UploadRecord,
  UserRole,
} from '../types'

export type CoreRankId =
  | 'visitor'
  | 'learner'
  | 'contributor'
  | 'word-scout'
  | 'language-keeper'
  | 'knowledge-builder'
  | 'community-scholar'
  | 'cultural-archivist'
  | 'dialect-guardian'
  | 'elders-trust'
  | 'language-steward'
  | 'corpus-architect'
  | 'heritage-guardian'
  | 'kasena-legend'
  | 'living-archive'

export type StaffRankId =
  | 'validator'
  | 'senior-validator'
  | 'elder-council'
  | 'research-fellow'
  | 'community-ambassador'
  | 'founder'

export type RankIconName =
  | 'baobab'
  | 'book'
  | 'brickWall'
  | 'compass'
  | 'crest'
  | 'crown'
  | 'drum'
  | 'feather'
  | 'footprints'
  | 'megaphone'
  | 'monument'
  | 'scale'
  | 'scholarStaff'
  | 'scroll'
  | 'seal'
  | 'shield'
  | 'staff'
  | 'temple'
  | 'huts'

export interface RankDefinition {
  id: CoreRankId
  title: string
  description: string
  minPoints: number
  icon: RankIconName
  colorLabel: string
  tone: string
  requirements: string[]
  sortOrder: number
}

export interface StaffRankDefinition {
  id: StaffRankId
  title: string
  description: string
  icon: RankIconName
  colorLabel: string
  tone: string
}

export interface RankMetrics {
  approvalRate: number
  approvedContributions: number
  approvedEntries: number
  approvedSubmissions: number
  hasCulturalContributions: boolean
  hasExampleSentences: boolean
  points: number
  reviewedSubmissions: number
  role?: UserRole
  staffRank?: StaffRankId | string
  trustScore: number
  uniqueDialects: number
}

type RankProfileLike = {
  approvalRate?: number
  approvedCulturalContributions?: number
  approvedEntries?: number
  approvedExampleSentences?: number
  approvedSubmissions?: number
  badgeTitle?: string
  dialects?: string[]
  reviewedSubmissions?: number
  role?: UserRole
  staffRank?: string
  totalPoints?: number
  trustScore?: number
  uniqueDialects?: number
}

export interface RankRequirementStatus {
  label: string
  met: boolean
}

export interface RankState {
  coreRank: RankDefinition
  displayRank: RankDefinition | StaffRankDefinition
  isStaffRank: boolean
  nextCoreRank: RankDefinition | null
  pointsToNextRank: number
  prestigeTitle: string | null
  progressToNextRank: number
  requirements: RankRequirementStatus[]
  trustScore: number
}

export const getDisplayRankTitleForProfile = (
  profile: RankProfileLike,
): string => getRankState(getRankMetricsFromProfile(profile)).displayRank.title

const coreTone = {
  bronze: 'from-[#b97942] to-[#6e3e1f] text-white ring-[#e1b07a]',
  bronzeIndigo: 'from-[#8b5a34] to-[#30306e] text-white ring-[#d7ad80]',
  silver: 'from-[#f3f5f6] to-[#9ca8b1] text-[#26323a] ring-[#cbd3d9]',
  silverGold: 'from-[#dfe4e8] to-[#caa54a] text-[#273018] ring-[#d7c278]',
  gold: 'from-[#ffe08a] to-[#c98713] text-[#4a3000] ring-[#f0bf3d]',
  emeraldGold: 'from-[#0f7b4a] to-[#d3a31f] text-white ring-[#d1b85c]',
  platinum: 'from-[#ffffff] to-[#b7c4ce] text-[#26323a] ring-[#dfe7ec]',
  platinumGold: 'from-[#f7fbff] to-[#d2a63d] text-[#26323a] ring-[#ead18a]',
  sapphire: 'from-[#2d69b3] to-[#14396d] text-white ring-[#78a8dc]',
  sapphireGold: 'from-[#1f5f9f] to-[#d0a02b] text-white ring-[#94b9df]',
  diamond: 'from-[#d9fbff] to-[#7ca8ff] text-[#143056] ring-[#bdeeff]',
  diamondGold: 'from-[#ecfeff] to-[#e0b43f] text-[#143056] ring-[#e7d387]',
}

export const CORE_RANKS: RankDefinition[] = [
  {
    id: 'visitor',
    title: 'Visitor',
    description: 'Just exploring.',
    minPoints: 0,
    icon: 'footprints',
    colorLabel: 'Neutral',
    tone: 'from-[#f7efe0] to-[#d7c4a3] text-[#513a1d] ring-[#e5d2ad]',
    requirements: [],
    sortOrder: 1,
  },
  {
    id: 'learner',
    title: 'Learner',
    description: 'Started learning Kasem.',
    minPoints: 50,
    icon: 'book',
    colorLabel: 'Bronze',
    tone: coreTone.bronze,
    requirements: [],
    sortOrder: 2,
  },
  {
    id: 'contributor',
    title: 'Contributor',
    description: 'Submitted approved content.',
    minPoints: 150,
    icon: 'feather',
    colorLabel: 'Bronze + Indigo',
    tone: coreTone.bronzeIndigo,
    requirements: ['1 approved entry'],
    sortOrder: 3,
  },
  {
    id: 'word-scout',
    title: 'Word Scout',
    description: 'Actively finding missing words.',
    minPoints: 300,
    icon: 'compass',
    colorLabel: 'Silver',
    tone: coreTone.silver,
    requirements: [],
    sortOrder: 4,
  },
  {
    id: 'language-keeper',
    title: 'Language Keeper',
    description: 'Regular contributor.',
    minPoints: 600,
    icon: 'shield',
    colorLabel: 'Silver',
    tone: coreTone.silver,
    requirements: ['50 approved entries', '70% approval rate'],
    sortOrder: 5,
  },
  {
    id: 'knowledge-builder',
    title: 'Knowledge Builder',
    description: 'Building the Kasem corpus.',
    minPoints: 1000,
    icon: 'brickWall',
    colorLabel: 'Silver + Gold',
    tone: coreTone.silverGold,
    requirements: ['100 approved entries', '75% approval rate'],
    sortOrder: 6,
  },
  {
    id: 'community-scholar',
    title: 'Community Scholar',
    description: 'Highly trusted contributor.',
    minPoints: 2000,
    icon: 'scholarStaff',
    colorLabel: 'Gold',
    tone: coreTone.gold,
    requirements: ['200 approved entries', 'Example sentences submitted'],
    sortOrder: 7,
  },
  {
    id: 'cultural-archivist',
    title: 'Cultural Archivist',
    description: 'Preserving proverbs, stories, and cultural notes.',
    minPoints: 4000,
    icon: 'scroll',
    colorLabel: 'Gold',
    tone: coreTone.gold,
    requirements: ['Cultural contributions approved'],
    sortOrder: 8,
  },
  {
    id: 'dialect-guardian',
    title: 'Dialect Guardian',
    description: 'Protecting regional language diversity.',
    minPoints: 7500,
    icon: 'huts',
    colorLabel: 'Emerald + Gold',
    tone: coreTone.emeraldGold,
    requirements: ['Contributions across multiple dialects'],
    sortOrder: 9,
  },
  {
    id: 'elders-trust',
    title: "Elder's Trust",
    description: 'Known for exceptional accuracy.',
    minPoints: 12000,
    icon: 'staff',
    colorLabel: 'Platinum',
    tone: coreTone.platinum,
    requirements: ['90% approval rate', '500 approved contributions'],
    sortOrder: 10,
  },
  {
    id: 'language-steward',
    title: 'Language Steward',
    description: 'Helps shape the language database.',
    minPoints: 20000,
    icon: 'baobab',
    colorLabel: 'Platinum + Gold',
    tone: coreTone.platinumGold,
    requirements: [],
    sortOrder: 11,
  },
  {
    id: 'corpus-architect',
    title: 'Corpus Architect',
    description: 'Built a significant portion of the language engine.',
    minPoints: 35000,
    icon: 'temple',
    colorLabel: 'Sapphire',
    tone: coreTone.sapphire,
    requirements: [],
    sortOrder: 12,
  },
  {
    id: 'heritage-guardian',
    title: 'Heritage Guardian',
    description: 'Protecting culture for future generations.',
    minPoints: 50000,
    icon: 'shield',
    colorLabel: 'Sapphire + Gold',
    tone: coreTone.sapphireGold,
    requirements: [],
    sortOrder: 13,
  },
  {
    id: 'kasena-legend',
    title: 'Kasena Legend',
    description: "One of the platform's most valuable contributors.",
    minPoints: 75000,
    icon: 'crown',
    colorLabel: 'Diamond',
    tone: coreTone.diamond,
    requirements: [],
    sortOrder: 14,
  },
  {
    id: 'living-archive',
    title: 'Living Archive',
    description: 'A walking repository of knowledge.',
    minPoints: 100000,
    icon: 'baobab',
    colorLabel: 'Diamond + Gold',
    tone: coreTone.diamondGold,
    requirements: [],
    sortOrder: 15,
  },
]

export const STAFF_RANKS: StaffRankDefinition[] = [
  {
    id: 'validator',
    title: 'Validator',
    description: 'Reviews contributions.',
    icon: 'seal',
    colorLabel: 'Staff',
    tone: 'from-[#e9f7ef] to-[#94c7a7] text-[#103b24] ring-[#aad6bb]',
  },
  {
    id: 'senior-validator',
    title: 'Senior Validator',
    description: 'Reviews disputes.',
    icon: 'scale',
    colorLabel: 'Staff',
    tone: 'from-[#f5f3ff] to-[#b7a7df] text-[#30205d] ring-[#cfc1ee]',
  },
  {
    id: 'elder-council',
    title: 'Elder Council',
    description: 'Cultural authority.',
    icon: 'drum',
    colorLabel: 'Staff',
    tone: 'from-[#fff1cc] to-[#b7752d] text-[#43240c] ring-[#e2b86c]',
  },
  {
    id: 'research-fellow',
    title: 'Research Fellow',
    description: 'University researcher.',
    icon: 'crest',
    colorLabel: 'Staff',
    tone: 'from-[#e9f1ff] to-[#5d82c7] text-[#112b58] ring-[#aac2ef]',
  },
  {
    id: 'community-ambassador',
    title: 'Community Ambassador',
    description: 'Promotes Kasena in schools and communities.',
    icon: 'megaphone',
    colorLabel: 'Staff',
    tone: 'from-[#fff3e7] to-[#d76c2c] text-[#4a2208] ring-[#efb07a]',
  },
  {
    id: 'founder',
    title: 'Founder',
    description: 'Project founder.',
    icon: 'monument',
    colorLabel: 'Staff',
    tone: 'from-[#ffed9f] to-[#9f6b08] text-[#372100] ring-[#f4c95a]',
  },
]

const prestigeTiers = [
  { minPoints: 1000000, title: 'Cultural Immortal' },
  { minPoints: 500000, title: 'Living Archive V' },
  { minPoints: 350000, title: 'Living Archive IV' },
  { minPoints: 250000, title: 'Living Archive III' },
  { minPoints: 175000, title: 'Living Archive II' },
  { minPoints: 125000, title: 'Living Archive I' },
]

const normalizedStaffRank = (value?: string): StaffRankDefinition | null =>
  STAFF_RANKS.find((rank) => rank.id === value) ?? null

const includesAny = (value: string, needles: string[]): boolean => {
  const normalized = value.toLowerCase()
  return needles.some((needle) => normalized.includes(needle))
}

const contributionText = (contribution: Contribution): string =>
  [
    contribution.contributionType,
    contribution.category,
    contribution.partOfSpeech,
    contribution.notes,
    contribution.wordUseRules,
    contribution.culturalNote,
  ]
    .filter(Boolean)
    .join(' ')

const uploadText = (upload: UploadRecord): string =>
  [upload.category, upload.title, upload.description, upload.tags]
    .filter(Boolean)
    .join(' ')

const isCulturalContribution = (contribution: Contribution): boolean =>
  Boolean(contribution.culturalNote?.trim()) ||
  includesAny(contributionText(contribution), [
    'culture',
    'cultural',
    'custom',
    'tradition',
    'traditional',
    'proverb',
    'story',
    'folklore',
    'heritage',
  ])

const isCulturalUpload = (upload: UploadRecord): boolean =>
  includesAny(uploadText(upload), [
    'culture',
    'cultural',
    'custom',
    'tradition',
    'traditional',
    'proverb',
    'story',
    'folklore',
    'heritage',
  ])

const getUniqueDialectCount = (
  contributions: Contribution[],
  uploads: UploadRecord[],
): number => {
  const ignored = new Set(['', 'not sure', 'other'])
  const dialects = [
    ...contributions.map((item) => item.dialect),
    ...uploads.map((item) => item.dialect ?? ''),
  ]

  return new Set(
    dialects
      .map((dialect) => dialect.trim().toLowerCase())
      .filter((dialect) => !ignored.has(dialect)),
  ).size
}

export const getTrustScore = ({
  approvalRate,
  approvedEntries,
  hasCulturalContributions,
  hasExampleSentences,
  reviewedSubmissions,
  uniqueDialects,
}: {
  approvalRate: number
  approvedEntries: number
  hasCulturalContributions: boolean
  hasExampleSentences: boolean
  reviewedSubmissions: number
  uniqueDialects: number
}): number => {
  if (reviewedSubmissions <= 0) {
    return 0
  }

  const confidenceScore = Math.min(100, (reviewedSubmissions / 50) * 100)
  const impactScore = Math.min(
    100,
    (hasExampleSentences ? 35 : 0) +
      (hasCulturalContributions ? 35 : 0) +
      Math.min(30, uniqueDialects * 10) +
      Math.min(20, approvedEntries / 10),
  )

  return Math.round(
    approvalRate * 0.7 + confidenceScore * 0.15 + impactScore * 0.15,
  )
}

export const getRankMetricsFromActivity = ({
  contributions,
  points,
  uploads,
  user,
}: {
  contributions: Contribution[]
  points: number
  uploads: UploadRecord[]
  user?: AppUser | null
}): RankMetrics => {
  const approvedContributions = contributions.filter(
    (item) => item.status === 'approved',
  )
  const approvedUploads = uploads.filter((item) => item.status === 'approved')
  const reviewedSubmissions =
    contributions.filter((item) => item.status !== 'pending').length +
    uploads.filter((item) => item.status !== 'pending').length
  const approvedSubmissions =
    approvedContributions.length + approvedUploads.length
  const approvalRate = reviewedSubmissions
    ? (approvedSubmissions / reviewedSubmissions) * 100
    : 0
  const uniqueDialects = getUniqueDialectCount(contributions, uploads)
  const hasExampleSentences = approvedContributions.some(
    (item) => item.englishExample.trim() || item.kasemExample.trim(),
  )
  const hasCulturalContributions =
    approvedContributions.some(isCulturalContribution) ||
    approvedUploads.some(isCulturalUpload)
  const trustScore = getTrustScore({
    approvalRate,
    approvedEntries: approvedSubmissions,
    hasCulturalContributions,
    hasExampleSentences,
    reviewedSubmissions,
    uniqueDialects,
  })

  return {
    approvalRate,
    approvedContributions: approvedContributions.length,
    approvedEntries: approvedSubmissions,
    approvedSubmissions,
    hasCulturalContributions,
    hasExampleSentences,
    points,
    reviewedSubmissions,
    role: user?.role,
    staffRank: user?.staffRank,
    trustScore,
    uniqueDialects,
  }
}

export const getRankMetricsFromProfile = (
  profile: RankProfileLike,
): RankMetrics => {
  const reviewedSubmissions = profile.reviewedSubmissions ?? 0
  const approvedSubmissions =
    profile.approvedSubmissions ?? profile.approvedEntries ?? 0
  const approvalRate =
    profile.approvalRate ??
    (reviewedSubmissions
      ? (approvedSubmissions / reviewedSubmissions) * 100
      : 0)
  const hasCulturalContributions =
    (profile.approvedCulturalContributions ?? 0) > 0
  const hasExampleSentences = (profile.approvedExampleSentences ?? 0) > 0
  const uniqueDialects =
    profile.uniqueDialects ??
    (profile.dialects?.filter((dialect) => dialect.trim()).length ?? 0)
  const trustScore =
    profile.trustScore ??
    getTrustScore({
      approvalRate,
      approvedEntries: approvedSubmissions,
      hasCulturalContributions,
      hasExampleSentences,
      reviewedSubmissions,
      uniqueDialects,
    })

  return {
    approvalRate,
    approvedContributions: profile.approvedEntries ?? approvedSubmissions,
    approvedEntries: profile.approvedEntries ?? approvedSubmissions,
    approvedSubmissions,
    hasCulturalContributions,
    hasExampleSentences,
    points: profile.totalPoints ?? 0,
    reviewedSubmissions,
    role: profile.role,
    staffRank: profile.staffRank,
    trustScore,
    uniqueDialects,
  }
}

const requirementStatuses = (
  rank: RankDefinition,
  metrics: RankMetrics,
): RankRequirementStatus[] =>
  rank.requirements.map((label) => {
    switch (rank.id) {
      case 'contributor':
        return { label, met: metrics.approvedEntries >= 1 }
      case 'language-keeper':
        return {
          label,
          met: label.includes('50')
            ? metrics.approvedEntries >= 50
            : metrics.approvalRate >= 70,
        }
      case 'knowledge-builder':
        return {
          label,
          met: label.includes('100')
            ? metrics.approvedEntries >= 100
            : metrics.approvalRate >= 75,
        }
      case 'community-scholar':
        return {
          label,
          met: label.includes('200')
            ? metrics.approvedEntries >= 200
            : metrics.hasExampleSentences,
        }
      case 'cultural-archivist':
        return { label, met: metrics.hasCulturalContributions }
      case 'dialect-guardian':
        return { label, met: metrics.uniqueDialects >= 2 }
      case 'elders-trust':
        return {
          label,
          met: label.includes('500')
            ? metrics.approvedContributions >= 500
            : metrics.approvalRate >= 90,
        }
      default:
        return { label, met: true }
    }
  })

const qualifiesForRank = (
  rank: RankDefinition,
  metrics: RankMetrics,
): boolean =>
  CORE_RANKS.filter((item) => item.sortOrder <= rank.sortOrder).every(
    (item) =>
      metrics.points >= item.minPoints &&
      requirementStatuses(item, metrics).every((requirement) => requirement.met),
  )

const getPrestigeTitle = (metrics: RankMetrics): string | null => {
  if (!qualifiesForRank(CORE_RANKS[CORE_RANKS.length - 1], metrics)) {
    return null
  }

  const tier = prestigeTiers.find((item) => {
    if (item.title === 'Cultural Immortal') {
      return (
        metrics.points >= item.minPoints &&
        metrics.trustScore >= 98 &&
        metrics.approvedEntries >= 5000
      )
    }

    return metrics.points >= item.minPoints
  })

  return tier?.title ?? null
}

export const getRankState = (metrics: RankMetrics): RankState => {
  const coreRank =
    [...CORE_RANKS]
      .reverse()
      .find((rank) => qualifiesForRank(rank, metrics)) ?? CORE_RANKS[0]
  const nextCoreRank =
    CORE_RANKS.find(
      (rank) => rank.sortOrder > coreRank.sortOrder && !qualifiesForRank(rank, metrics),
    ) ?? null
  const nextRankRequirements = nextCoreRank
    ? requirementStatuses(nextCoreRank, metrics)
    : []
  const nextRankReady = nextRankRequirements.every((requirement) => requirement.met)
  const staffRank =
    normalizedStaffRank(metrics.staffRank) ??
    (metrics.role === 'admin'
      ? normalizedStaffRank('founder')
      : metrics.role === 'validator'
        ? normalizedStaffRank('validator')
        : null)
  const pointsToNextRank = nextCoreRank
    ? Math.max(0, nextCoreRank.minPoints - metrics.points)
    : 0
  const progressToNextRank = nextCoreRank
    ? ((metrics.points - coreRank.minPoints) /
        Math.max(1, nextCoreRank.minPoints - coreRank.minPoints)) *
      100
    : 100

  return {
    coreRank,
    displayRank: staffRank ?? coreRank,
    isStaffRank: Boolean(staffRank),
    nextCoreRank,
    pointsToNextRank,
    prestigeTitle: getPrestigeTitle(metrics),
    progressToNextRank: Math.min(
      nextRankReady ? 100 : 99,
      Math.max(0, progressToNextRank),
    ),
    requirements: nextCoreRank ? nextRankRequirements : requirementStatuses(coreRank, metrics),
    trustScore: metrics.trustScore,
  }
}

export const getRankTitleForPoints = (points: number): string =>
  [...CORE_RANKS]
    .reverse()
    .find((rank) => points >= rank.minPoints)?.title ?? CORE_RANKS[0].title

export const getReviewCounterDeltas = (
  previousStatus: ReviewStatus,
  nextStatus: Extract<ReviewStatus, 'approved' | 'rejected'>,
) => {
  const wasReviewed = previousStatus !== 'pending'
  const wasApproved = previousStatus === 'approved'
  const willBeApproved = nextStatus === 'approved'

  return {
    approvedDelta: Number(willBeApproved) - Number(wasApproved),
    reviewedDelta: 1 - Number(wasReviewed),
  }
}

export const getLeaderboardTitle = (
  context: LeaderboardPeriod | 'school' | 'community',
  rank: number,
): string | null => {
  if (rank !== 1) {
    return null
  }

  if (context === 'week') return 'Word Warrior'
  if (context === 'month') return 'Voice of the Month'
  if (context === 'school') return 'School Champion'
  if (context === 'community') return 'Community Champion'
  return 'Guardian of Kasem'
}
