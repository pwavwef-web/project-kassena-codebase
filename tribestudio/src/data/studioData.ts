import { ACHIEVEMENTS, getAchievementAssetSrc } from '../lib/achievements'

export type UserRole =
  | 'user'
  | 'contributor'
  | 'creator'
  | 'validator'
  | 'elder'
  | 'cultural custodian'
  | 'community manager'
  | 'administrator'
  | 'researcher'
  | 'partner'

export type ContentStatus =
  | 'draft'
  | 'submitted'
  | 'pending review'
  | 'approved'
  | 'rejected'
  | 'restricted'
  | 'sensitive'
  | 'archived'

export type ContentTier = 'Open' | 'Restricted' | 'Sensitive'

export interface WorkspaceNavItem {
  label: string
  href: string
}

export interface WorkspaceNavGroup {
  label: string
  items: WorkspaceNavItem[]
}

export interface ContentRecord {
  id: string
  type: string
  title: string
  language: string
  dialect: string
  status: ContentStatus
  tier: ContentTier
  contributor: string
  source: string
  consent: string
  licence: string
  validation: string
  updatedAt: string
}

export interface ReviewTask {
  id: string
  title: string
  type: string
  contributor: string
  dialect: string
  tier: ContentTier
  consentStatus: string
  sensitivityFlag: string
  sourceVerification: string
  submittedText: string
  comparisonText: string
  history: string[]
}

export interface Campaign {
  title: string
  type: string
  progress: number
  deadline: string
  points: number
  eligibility: string
  sponsor: string
}

export interface ChartDatum {
  label: string
  value: number
  note: string
}

export const navGroups: WorkspaceNavGroup[] = [
  {
    label: 'Access',
    items: [
      { label: 'Auth', href: '/auth' },
      { label: 'Onboarding', href: '/onboarding' },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Create', href: '/create' },
      { label: 'Content', href: '/content' },
      { label: 'Languages', href: '/languages' },
      { label: 'Reviews', href: '/reviews' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { label: 'Campaigns', href: '/campaigns' },
      { label: 'Rewards', href: '/rewards' },
      { label: 'Achievements', href: '/achievements' },
      { label: 'Analytics', href: '/analytics' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Profile', href: '/profile' },
      { label: 'Settings', href: '/settings' },
      { label: 'Admin', href: '/admin' },
    ],
  },
]

export const roles: UserRole[] = [
  'user',
  'contributor',
  'creator',
  'validator',
  'elder',
  'cultural custodian',
  'community manager',
  'administrator',
  'researcher',
  'partner',
]

export const dashboardStats = [
  { label: 'Drafts', value: '12', note: 'fixture content drafts' },
  { label: 'Pending reviews', value: '7', note: 'validator queue' },
  { label: 'Points', value: '840', note: 'no payout integration' },
  { label: 'Active campaigns', value: '3', note: 'sample campaigns' },
]

export const recentActivity = [
  'Demo Contributor saved a proverb draft',
  'Sample Validator requested source verification',
  'Review queue flagged one sensitive oral-history placeholder',
  'Language campaign reached 64 percent demo progress',
]

export const notifications = [
  'Contributor Auth and Firestore are the live MVP path when configured.',
  'AI-training permission must be explicit before export.',
  'Sensitive content requires custodian escalation.',
]

export const createTypes = [
  'dictionary word',
  'sentence pair',
  'proverb',
  'story',
  'cultural note',
  'oral history',
  'lesson',
  'image collection',
  'audio concept',
  'artisan profile',
]

export const contentRecords: ContentRecord[] = [
  {
    id: 'draft-word-001',
    type: 'dictionary word',
    title: 'water - koom',
    language: 'Kasem',
    dialect: 'Demo dialect note',
    status: 'draft',
    tier: 'Open',
    contributor: 'Demo Contributor',
    source: 'Unverified Demo Data',
    consent: 'Contributor consent only',
    licence: 'Educational demo licence',
    validation: 'Not submitted',
    updatedAt: '2026-06-24',
  },
  {
    id: 'story-002',
    type: 'story',
    title: 'Placeholder Story',
    language: 'Kasem',
    dialect: 'Needs confirmation',
    status: 'pending review',
    tier: 'Restricted',
    contributor: 'Demo Contributor',
    source: 'Example Community',
    consent: 'Source consent required',
    licence: 'Review before use',
    validation: 'Sample Validator assigned',
    updatedAt: '2026-06-24',
  },
  {
    id: 'oral-003',
    type: 'oral history',
    title: 'Elder-sourced placeholder',
    language: 'Kasem',
    dialect: 'Not public',
    status: 'sensitive',
    tier: 'Sensitive',
    contributor: 'Demo Contributor',
    source: 'Source withheld in demo',
    consent: 'Custodian review required',
    licence: 'No AI or commercial use',
    validation: 'Escalated',
    updatedAt: '2026-06-24',
  },
  {
    id: 'lesson-004',
    type: 'lesson',
    title: 'Beginner greetings',
    language: 'Kasem',
    dialect: 'Demo dialect note',
    status: 'approved',
    tier: 'Open',
    contributor: 'Demo Contributor',
    source: 'Unverified Demo Data',
    consent: 'Contributor consent',
    licence: 'Educational demo licence',
    validation: 'Sample Validator approved',
    updatedAt: '2026-06-24',
  },
]

export const reviewQueue: ReviewTask[] = [
  {
    id: 'review-001',
    title: 'Placeholder Story',
    type: 'story',
    contributor: 'Demo Contributor',
    dialect: 'Needs confirmation',
    tier: 'Restricted',
    consentStatus: 'Source consent pending',
    sensitivityFlag: 'Restricted cultural context',
    sourceVerification: 'Needs named source before publication',
    submittedText: 'Public summary only. No sacred or private details included.',
    comparisonText: 'Semantic meaning and context require validator notes.',
    history: ['Submitted', 'Duplicate check passed', 'Consent check requested'],
  },
  {
    id: 'review-002',
    title: 'Beginner greeting phrase',
    type: 'sentence pair',
    contributor: 'Demo Contributor',
    dialect: 'Kasem demo dialect note',
    tier: 'Open',
    consentStatus: 'Contributor consent recorded',
    sensitivityFlag: 'None',
    sourceVerification: 'Unverified Demo Data',
    submittedText: 'English greeting paired with Kasem placeholder text.',
    comparisonText: 'Check spelling, tone and everyday usage before approval.',
    history: ['Submitted', 'Assigned to Sample Validator'],
  },
]

export const campaigns: Campaign[] = [
  {
    title: 'Kasem beginner phrase drive',
    type: 'Language campaign',
    progress: 64,
    deadline: '2026-08-31',
    points: 120,
    eligibility: 'Contributors with consent acknowledgement',
    sponsor: 'No sponsor - demo badge',
  },
  {
    title: 'Public story metadata sprint',
    type: 'Story drive',
    progress: 38,
    deadline: '2026-09-15',
    points: 180,
    eligibility: 'Creators and validators',
    sponsor: 'Placeholder sponsor badge',
  },
  {
    title: 'Dialect coverage review',
    type: 'Sponsored bounty placeholder',
    progress: 22,
    deadline: '2026-10-01',
    points: 240,
    eligibility: 'Validators only',
    sponsor: 'No real payout',
  },
]

export const rewardBadges = [
  ...ACHIEVEMENTS.map((achievement) => ({
    label: achievement.title,
    image: getAchievementAssetSrc(achievement.id),
    note: achievement.unlockCondition,
  })),
]

export const analyticsCharts: Record<string, ChartDatum[]> = {
  contributions: [
    { label: 'Words', value: 72, note: 'demo count' },
    { label: 'Stories', value: 28, note: 'demo count' },
    { label: 'Audio', value: 15, note: 'placeholder' },
  ],
  approvalRate: [
    { label: 'Approved', value: 58, note: 'demo percent' },
    { label: 'Revision', value: 27, note: 'demo percent' },
    { label: 'Rejected', value: 15, note: 'demo percent' },
  ],
  rejectionReasons: [
    { label: 'Missing source', value: 42, note: 'demo percent' },
    { label: 'Dialect conflict', value: 31, note: 'demo percent' },
    { label: 'Consent gap', value: 27, note: 'demo percent' },
  ],
  dialectCoverage: [
    { label: 'Central', value: 45, note: 'placeholder' },
    { label: 'Western', value: 32, note: 'placeholder' },
    { label: 'Unconfirmed', value: 23, note: 'needs review' },
  ],
  reviewTurnaround: [
    { label: 'Under 2 days', value: 35, note: 'demo' },
    { label: '3-7 days', value: 50, note: 'demo' },
    { label: 'Over 7 days', value: 15, note: 'demo' },
  ],
  contributorRetention: [
    { label: 'Week 1', value: 80, note: 'demo' },
    { label: 'Week 4', value: 52, note: 'demo' },
    { label: 'Week 8', value: 36, note: 'demo' },
  ],
  campaignProgress: campaigns.map((campaign) => ({
    label: campaign.title,
    value: campaign.progress,
    note: campaign.type,
  })),
}

export const adminAreas = [
  'users',
  'roles',
  'communities',
  'languages',
  'content',
  'campaigns',
  'reviews',
  'reports',
  'feature flags',
  'audit logs',
  'system health',
]
