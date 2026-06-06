import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertMessage } from '../components/common/AlertMessage'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingState } from '../components/common/LoadingState'
import { MediaPreview } from '../components/common/MediaPreview'
import { StatusBadge } from '../components/common/StatusBadge'
import { useAuth } from '../hooks/useAuth'
import { DIALECT_OPTIONS } from '../lib/constants'
import { toDateLabel } from '../lib/date'
import {
  getLeaderboardRank,
  listCommunityLeaderboardProfiles,
  listCommunityRecognitions,
  listContributorLevels,
  listRewardAchievements,
  listRewardBounties,
  listRewardCatalogItems,
  listUserContributions,
  listUserRewardRedemptions,
  listUserUploads,
  subscribeToLeaderboard,
  subscribeToLeaderboardUser,
} from '../lib/firestore'
import { getUserDialects } from '../lib/profile'
import { FavoritesTab } from '../components/profile/FavoritesTab'
import { RecentlyViewedTab } from '../components/profile/RecentlyViewedTab'
import { SearchHistoryTab } from '../components/profile/SearchHistoryTab'
import type {
  AppUser,
  CommunityRecognition,
  Contribution,
  ContributorLevel,
  LeaderboardProfile,
  RankedLeaderboardProfile,
  RewardAchievement,
  RewardBounty,
  RewardCatalogItem,
  RewardRedemption,
  UploadRecord,
} from '../types'

type ProfileForm = Pick<
  AppUser,
  | 'displayName'
  | 'photoURL'
  | 'community'
  | 'dialect'
  | 'dialects'
  | 'phone'
  | 'bio'
  | 'contributionFocus'
>

type TimestampLike = {
  toDate?: () => Date
  toMillis?: () => number
}

type IconName =
  | 'activity'
  | 'admin'
  | 'analytics'
  | 'arrowLeft'
  | 'audio'
  | 'badge'
  | 'book'
  | 'calendar'
  | 'camera'
  | 'check'
  | 'chevronRight'
  | 'community'
  | 'edit'
  | 'gift'
  | 'globe'
  | 'leaf'
  | 'lock'
  | 'medal'
  | 'points'
  | 'proverb'
  | 'reward'
  | 'settings'
  | 'share'
  | 'song'
  | 'spark'
  | 'star'
  | 'streak'
  | 'target'
  | 'timeline'
  | 'trophy'
  | 'upload'
  | 'user'
  | 'words'

interface ImpactMetric {
  label: string
  value: number | string
  icon: IconName
  tone: string
}

interface JourneyEvent {
  id: string
  title: string
  date: Date
  icon: IconName
}

interface ActivityPoint {
  date: Date
  points: number
}

const emptyProfileForm: ProfileForm = {
  displayName: '',
  photoURL: '',
  community: '',
  dialect: '',
  dialects: [],
  phone: '',
  bio: '',
  contributionFocus: '',
}

const countByStatus = <T extends { status: string }>(items: T[]) => ({
  total: items.length,
  pending: items.filter((item) => item.status === 'pending').length,
  approved: items.filter((item) => item.status === 'approved').length,
  rejected: items.filter((item) => item.status === 'rejected').length,
})

const formatNumber = (value: number): string => value.toLocaleString()

const getMillis = (value?: TimestampLike | null): number =>
  value?.toMillis?.() ?? value?.toDate?.().getTime() ?? 0

const getDate = (value?: TimestampLike | null): Date | null => {
  const millis = getMillis(value)
  return millis ? new Date(millis) : null
}

const toShortDateLabel = (value?: TimestampLike | Date | null): string => {
  if (!value) {
    return '-'
  }

  const date = value instanceof Date ? value : getDate(value)
  if (!date) {
    return '-'
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const toMonthYearLabel = (value?: TimestampLike | null): string => {
  const date = getDate(value)
  if (!date) {
    return '-'
  }

  return date.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const dayKey = (date: Date): string => startOfDay(date).toISOString()

const includesAny = (value: string, needles: string[]): boolean => {
  const normalized = value.toLowerCase()
  return needles.some((needle) => normalized.includes(needle))
}

const isProverbContribution = (contribution: Contribution): boolean =>
  includesAny(contribution.category, ['proverb'])

const isSentenceContribution = (contribution: Contribution): boolean =>
  includesAny(contribution.category, ['sentence', 'phrase']) ||
  Boolean(contribution.englishExample || contribution.kasemExample)

const isAudioUpload = (upload: UploadRecord): boolean =>
  upload.contentType.startsWith('audio/') ||
  includesAny(`${upload.category} ${upload.title} ${upload.tags ?? ''}`, [
    'audio',
    'voice',
    'song',
    'recording',
  ])

const pointsForContribution = (contribution: Contribution): number => {
  const hasExamples = Boolean(
    contribution.englishExample || contribution.kasemExample,
  )

  return 50 + (hasExamples ? 10 : 0)
}

const pointsForUpload = (upload: UploadRecord): number =>
  upload.status === 'approved' ? 100 : 0

const getInitials = (name?: string): string =>
  name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PK'

const Icon = ({
  name,
  className = 'h-5 w-5',
}: {
  name: IconName
  className?: string
}) => {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.9,
    viewBox: '0 0 24 24',
  }

  switch (name) {
    case 'activity':
      return (
        <svg {...common}>
          <path d="M4 18h3l2.4-9 4 12 2.3-7H20" />
        </svg>
      )
    case 'admin':
      return (
        <svg {...common}>
          <path d="M12 3 5 6.2v5.5c0 4.4 2.8 7.4 7 9.3 4.2-1.9 7-4.9 7-9.3V6.2L12 3Z" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      )
    case 'analytics':
      return (
        <svg {...common}>
          <path d="M5 19V11" />
          <path d="M12 19V5" />
          <path d="M19 19v-8" />
          <path d="M3 19h18" />
        </svg>
      )
    case 'arrowLeft':
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      )
    case 'audio':
      return (
        <svg {...common}>
          <path d="M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z" />
          <path d="M5 11a7 7 0 0 0 14 0" />
          <path d="M12 18v3" />
        </svg>
      )
    case 'badge':
      return (
        <svg {...common}>
          <path d="M12 3 5 6.4v5.2c0 4.2 2.8 7.3 7 9.4 4.2-2.1 7-5.2 7-9.4V6.4L12 3Z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      )
    case 'book':
      return (
        <svg {...common}>
          <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5v-17Z" />
          <path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H20" />
          <path d="M9 7h7" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...common}>
          <path d="M7 3v3" />
          <path d="M17 3v3" />
          <path d="M4 8h16" />
          <path d="M5 5h14a1 1 0 0 1 1 1v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1Z" />
        </svg>
      )
    case 'camera':
      return (
        <svg {...common}>
          <path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
          <path d="M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      )
    case 'check':
      return (
        <svg {...common}>
          <path d="m6 12 4 4 8-8" />
        </svg>
      )
    case 'chevronRight':
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      )
    case 'community':
      return (
        <svg {...common}>
          <path d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
          <path d="M4.5 19a7.5 7.5 0 0 1 15 0" />
          <path d="M17.5 9.5a2.7 2.7 0 0 1 2.8 2.7" />
          <path d="M3.7 12.2a2.7 2.7 0 0 1 2.8-2.7" />
        </svg>
      )
    case 'edit':
      return (
        <svg {...common}>
          <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
          <path d="m14 7 3 3" />
        </svg>
      )
    case 'gift':
      return (
        <svg {...common}>
          <path d="M20 12v8H4v-8" />
          <path d="M2.5 7h19v5h-19z" />
          <path d="M12 7v13" />
          <path d="M12 7H8.5A2.5 2.5 0 1 1 11 4.5L12 7Z" />
          <path d="M12 7h3.5A2.5 2.5 0 1 0 13 4.5L12 7Z" />
        </svg>
      )
    case 'globe':
      return (
        <svg {...common}>
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          <path d="M3.6 9h16.8" />
          <path d="M3.6 15h16.8" />
          <path d="M12 3a14 14 0 0 1 0 18" />
          <path d="M12 3a14 14 0 0 0 0 18" />
        </svg>
      )
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M5 19c8 0 13-5.5 14-14-8.5 1-14 6-14 14Z" />
          <path d="M5 19c2.5-4.5 6-7.5 10.5-9" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...common}>
          <path d="M7 11V8a5 5 0 0 1 10 0v3" />
          <path d="M6 11h12v9H6z" />
        </svg>
      )
    case 'medal':
      return (
        <svg {...common}>
          <path d="M8 3h8l-2 6h-4L8 3Z" />
          <path d="M12 21a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" />
          <path d="m12 13.5.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3.9-1.8Z" />
        </svg>
      )
    case 'points':
      return (
        <svg {...common}>
          <path d="m12 3 2.5 5 5.5.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.5-.8L12 3Z" />
        </svg>
      )
    case 'proverb':
      return (
        <svg {...common}>
          <path d="M5 4h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-5l-4 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
          <path d="M7 8h.01" />
          <path d="M12 8h.01" />
          <path d="M17 8h.01" />
        </svg>
      )
    case 'reward':
      return (
        <svg {...common}>
          <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
          <path d="M8 6H5a2 2 0 0 0 2 4h1" />
          <path d="M16 6h3a2 2 0 0 1-2 4h-1" />
          <path d="M12 11v4" />
          <path d="M9 19h6" />
          <path d="M10 15h4v4h-4z" />
        </svg>
      )
    case 'settings':
      return (
        <svg {...common}>
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.1 2.1-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1.1 1.6V20h-3v-.1a1.8 1.8 0 0 0-1.1-1.6 1.8 1.8 0 0 0-2 .4l-.1.1-2.1-2.1.1-.1a1.8 1.8 0 0 0 .4-2A1.8 1.8 0 0 0 5.1 13H5v-3h.1a1.8 1.8 0 0 0 1.6-1.1 1.8 1.8 0 0 0-.4-2l-.1-.1 2.1-2.1.1.1a1.8 1.8 0 0 0 2 .4A1.8 1.8 0 0 0 11.5 3h3a1.8 1.8 0 0 0 1.1 1.6 1.8 1.8 0 0 0 2-.4l.1-.1 2.1 2.1-.1.1a1.8 1.8 0 0 0-.4 2A1.8 1.8 0 0 0 20.9 10h.1v3h-.1a1.8 1.8 0 0 0-1.5 2Z" />
        </svg>
      )
    case 'share':
      return (
        <svg {...common}>
          <path d="M18 8a3 3 0 1 0-2.8-4" />
          <path d="M6 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
          <path d="M18 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
          <path d="m8.6 14.8 6.8-4.1" />
          <path d="m8.6 19.2 6.8 4.1" />
        </svg>
      )
    case 'song':
      return (
        <svg {...common}>
          <path d="M9 18V5l10-2v13" />
          <path d="M9 18a3 3 0 1 1-2-2.8" />
          <path d="M19 16a3 3 0 1 1-2-2.8" />
        </svg>
      )
    case 'spark':
      return (
        <svg {...common}>
          <path d="M12 3 10 9l-6 2 6 2 2 6 2-6 6-2-6-2-2-6Z" />
          <path d="M5 4v3" />
          <path d="M3.5 5.5h3" />
          <path d="M19 17v3" />
          <path d="M17.5 18.5h3" />
        </svg>
      )
    case 'streak':
      return (
        <svg {...common}>
          <path d="M13 3s1 4-2 6c-2 1.4-3 3-3 5a4 4 0 0 0 8 0c0-2-1-3.2-2.2-4.4C13 8.8 13 7 14.5 5" />
          <path d="M9.5 18.5a6.5 6.5 0 0 1-1.9-11" />
        </svg>
      )
    case 'target':
      return (
        <svg {...common}>
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
          <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        </svg>
      )
    case 'timeline':
      return (
        <svg {...common}>
          <path d="M7 4v16" />
          <path d="M7 6h10" />
          <path d="M7 12h7" />
          <path d="M7 18h12" />
          <path d="M5 6h4" />
          <path d="M5 12h4" />
          <path d="M5 18h4" />
        </svg>
      )
    case 'trophy':
      return (
        <svg {...common}>
          <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
          <path d="M8 6H5a2 2 0 0 0 2 4h1" />
          <path d="M16 6h3a2 2 0 0 1-2 4h-1" />
          <path d="M12 11v4" />
          <path d="M9 19h6" />
        </svg>
      )
    case 'upload':
      return (
        <svg {...common}>
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 20h14" />
        </svg>
      )
    case 'user':
      return (
        <svg {...common}>
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      )
    case 'words':
    default:
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M4 11h13" />
          <path d="M4 16h9" />
        </svg>
      )
  }
}

const Panel = ({
  children,
  className = '',
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) => (
  <section
    id={id}
    className={`rounded-[22px] border border-[#ead9bd] bg-white/95 p-4 shadow-[0_14px_34px_rgba(71,44,18,0.08)] sm:p-5 ${className}`}
  >
    {children}
  </section>
)

const SectionHeader = ({
  title,
  icon,
  action,
}: {
  title: string
  icon: IconName
  action?: ReactNode
}) => (
  <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
    <h2 className="flex min-w-0 items-center gap-2 text-base font-black text-[#073d24] sm:text-lg">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf6e9] text-kassena-green ring-1 ring-[#cfe2c9]">
        <Icon name={icon} className="h-4.5 w-4.5" />
      </span>
      <span className="truncate">{title}</span>
    </h2>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
)

const ProgressBar = ({
  value,
  className = '',
}: {
  value: number
  className?: string
}) => (
  <div
    className={`h-2.5 overflow-hidden rounded-full bg-[#eadcc4] ${className}`}
  >
    <div
      className="h-full rounded-full bg-gradient-to-r from-[#2d9749] via-[#caa54a] to-[#c96a2d] transition-all duration-700"
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
)

const EmptyPanelMessage = ({ message }: { message: string }) => (
  <div className="rounded-[18px] border border-dashed border-[#e3cfad] bg-[#fff8ed] px-4 py-5 text-sm font-semibold text-slate-500">
    {message}
  </div>
)

const Avatar = ({
  photoURL,
  name,
  className = 'h-20 w-20 text-xl',
}: {
  photoURL?: string
  name?: string
  className?: string
}) => {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt=""
        className={`${className} rounded-full object-cover`}
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <div
      className={`${className} flex items-center justify-center rounded-full bg-kassena-green font-black text-white`}
    >
      {getInitials(name)}
    </div>
  )
}

const MetricTile = ({ item }: { item: ImpactMetric }) => (
  <article className={`min-w-0 rounded-[18px] border p-3 ${item.tone}`}>
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70">
        <Icon name={item.icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-2xl font-black leading-none text-[#101f1a]">
          {item.value}
        </p>
        <p className="mt-1 text-xs font-bold leading-tight text-[#24352e]">
          {item.label}
        </p>
      </div>
    </div>
  </article>
)

const getContributionDate = (contribution: Contribution): Date | null =>
  getDate(contribution.reviewedAt) ||
  getDate(contribution.updatedAt) ||
  getDate(contribution.createdAt)

const getUploadDate = (upload: UploadRecord): Date | null =>
  getDate(upload.reviewedAt) ||
  getDate(upload.updatedAt) ||
  getDate(upload.createdAt)

const getActivityDates = (
  contributions: Contribution[],
  uploads: UploadRecord[],
): Date[] =>
  [
    ...contributions.map((item) => getDate(item.createdAt)).filter(Boolean),
    ...uploads.map((item) => getDate(item.createdAt)).filter(Boolean),
  ] as Date[]

const buildHeatmapDays = (activityDates: Date[]) => {
  const counts = new Map<string, number>()
  activityDates.forEach((date) => {
    const key = dayKey(date)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })

  const today = startOfDay(new Date())
  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (34 - index))
    const key = dayKey(date)

    return {
      key,
      date,
      count: counts.get(key) ?? 0,
    }
  })
}

const getStreakSummary = (activityDates: Date[]) => {
  const activeDays = Array.from(new Set(activityDates.map(dayKey))).sort()
  const activeSet = new Set(activeDays)
  const today = startOfDay(new Date())
  let currentStreak = 0

  for (let offset = 0; offset < 366; offset += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)

    if (!activeSet.has(dayKey(date))) {
      break
    }

    currentStreak += 1
  }

  let longestStreak = 0
  let runningStreak = 0
  let previousDate: Date | null = null

  activeDays.forEach((key) => {
    const date = new Date(key)
    if (!previousDate) {
      runningStreak = 1
    } else {
      const diffDays = Math.round(
        (date.getTime() - previousDate.getTime()) / 86400000,
      )
      runningStreak = diffDays === 1 ? runningStreak + 1 : 1
    }

    longestStreak = Math.max(longestStreak, runningStreak)
    previousDate = date
  })

  return {
    activeDays: activeDays.length,
    currentStreak,
    longestStreak,
  }
}

const getProfileCompletion = (user: AppUser, uploads: UploadRecord[]) => {
  const userDialects = getUserDialects(user)
  const items = [
    { label: 'Profile photo', complete: Boolean(user.photoURL) },
    { label: 'Bio', complete: Boolean(user.bio?.trim()) },
    { label: 'Community', complete: Boolean(user.community?.trim()) },
    { label: 'Dialect', complete: userDialects.length > 0 },
    {
      label: 'Contribution interests',
      complete: Boolean(user.contributionFocus?.trim()),
    },
    { label: 'Audio sample', complete: uploads.some(isAudioUpload) },
  ]
  const completed = items.filter((item) => item.complete).length

  return {
    items,
    percent: Math.round((completed / items.length) * 100),
  }
}

const getAchievementValue = ({
  achievement,
  approvedEntries,
  currentPoints,
  totalUploads,
  totalContributions,
}: {
  achievement: RewardAchievement
  approvedEntries: number
  currentPoints: number
  totalUploads: number
  totalContributions: number
}) => {
  switch (achievement.requirementType) {
    case 'firstContribution':
      return totalContributions + totalUploads > 0 ? 1 : 0
    case 'approvedEntries':
    case 'elderApproved':
      return approvedEntries
    case 'uploads':
      return totalUploads
    case 'totalPoints':
    default:
      return currentPoints
  }
}

const optionalFirebaseRead = async <T,>(
  loader: Promise<T>,
  fallback: T,
): Promise<T> => loader.catch(() => fallback)

const getChartRows = (activityPoints: ActivityPoint[]) => {
  const monthFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
  })
  const currentYear = new Date().getFullYear()
  const rows = new Map<
    string,
    {
      label: string
      contributions: number
      points: number
    }
  >()

  activityPoints.forEach((item) => {
    const key = `${item.date.getFullYear()}-${item.date.getMonth()}`
    const existing = rows.get(key) ?? {
      label:
        item.date.getFullYear() === currentYear
          ? monthFormatter.format(item.date)
          : `${monthFormatter.format(item.date)} ${item.date.getFullYear()}`,
      contributions: 0,
      points: 0,
    }

    existing.contributions += 1
    existing.points += item.points
    rows.set(key, existing)
  })

  return Array.from(rows.values()).slice(-6)
}

export const ProfilePage = () => {
  const { appUser, logout, updateUserProfile } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [dataError, setDataError] = useState('')
  const [shareFeedback, setShareFeedback] = useState('')
  const [form, setForm] = useState<ProfileForm>(emptyProfileForm)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [uploads, setUploads] = useState<UploadRecord[]>([])
  const [levels, setLevels] = useState<ContributorLevel[]>([])
  const [achievements, setAchievements] = useState<RewardAchievement[]>([])
  const [bounties, setBounties] = useState<RewardBounty[]>([])
  const [rewardItems, setRewardItems] = useState<RewardCatalogItem[]>([])
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([])
  const [recognitions, setRecognitions] = useState<CommunityRecognition[]>([])
  const [leaderboard, setLeaderboard] = useState<RankedLeaderboardProfile[]>([])
  const [regionalLeaderboard, setRegionalLeaderboard] = useState<
    RankedLeaderboardProfile[]
  >([])
  const [leaderboardUser, setLeaderboardUser] =
    useState<LeaderboardProfile | null>(null)
  const [currentRank, setCurrentRank] = useState<number | null>(null)
  const [dictionaryTab, setDictionaryTab] = useState<'favorites' | 'recent' | 'history'>('favorites')
  const appUserId = appUser?.uid ?? ''
  const appUserCommunity = appUser?.community ?? ''

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      if (!appUserId) {
        return
      }

      setIsLoading(true)
      setDataError('')

      const [
        userContributions,
        userUploads,
        contributorLevels,
        rewardAchievements,
        activeBounties,
        catalogItems,
        userRedemptions,
        communityRecognitions,
        regionalProfiles,
      ] = await Promise.all([
        listUserContributions(appUserId),
        listUserUploads(appUserId),
        optionalFirebaseRead(listContributorLevels(), []),
        optionalFirebaseRead(listRewardAchievements(), []),
        optionalFirebaseRead(listRewardBounties(), []),
        optionalFirebaseRead(listRewardCatalogItems(), []),
        optionalFirebaseRead(listUserRewardRedemptions(appUserId), []),
        optionalFirebaseRead(listCommunityRecognitions(appUserId), []),
        optionalFirebaseRead(
          listCommunityLeaderboardProfiles(appUserCommunity),
          [],
        ),
      ])

      if (active) {
        setContributions(userContributions)
        setUploads(userUploads)
        setLevels(contributorLevels)
        setAchievements(rewardAchievements)
        setBounties(activeBounties)
        setRewardItems(catalogItems)
        setRedemptions(userRedemptions)
        setRecognitions(communityRecognitions)
        setRegionalLeaderboard(regionalProfiles)
        setIsLoading(false)
      }
    }

    hydrate().catch(() => {
      if (active) {
        setDataError('Profile data could not be loaded from Firebase.')
        setIsLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [appUserCommunity, appUserId])

  useEffect(() => {
    if (!appUser) {
      return () => undefined
    }

    const unsubscribeLeaderboard = subscribeToLeaderboard(
      'allTime',
      setLeaderboard,
      () => setDataError('Leaderboard data could not be loaded from Firebase.'),
    )
    const unsubscribeUser = subscribeToLeaderboardUser(
      appUser.uid,
      setLeaderboardUser,
      () =>
        setDataError('Your points profile could not be loaded from Firebase.'),
    )

    return () => {
      unsubscribeLeaderboard()
      unsubscribeUser()
    }
  }, [appUser])

  const contributionStats = useMemo(
    () => countByStatus(contributions),
    [contributions],
  )
  const uploadStats = useMemo(() => countByStatus(uploads), [uploads])

  const calculatedStats = useMemo(() => {
    const approvedContributions = contributions.filter(
      (item) => item.status === 'approved',
    )
    const approvedUploads = uploads.filter((item) => item.status === 'approved')
    const reviewedCount =
      contributions.filter((item) => item.status !== 'pending').length +
      uploads.filter((item) => item.status !== 'pending').length
    const approvedEntries =
      approvedContributions.length + approvedUploads.length
    const approvalRate = reviewedCount
      ? Math.round((approvedEntries / reviewedCount) * 100)
      : 0
    const proverbsAdded = approvedContributions.filter(
      isProverbContribution,
    ).length
    const sentencesAdded = approvedContributions.filter(
      isSentenceContribution,
    ).length
    const wordsAdded = Math.max(
      0,
      approvedContributions.length - proverbsAdded - sentencesAdded,
    )
    const audioUploads = approvedUploads.filter(isAudioUpload).length
    const earnedPoints =
      approvedContributions.reduce(
        (total, contribution) => total + pointsForContribution(contribution),
        0,
      ) +
      approvedUploads.reduce(
        (total, upload) => total + pointsForUpload(upload),
        0,
      )

    return {
      approvedContributions,
      approvedEntries,
      approvedUploads,
      approvalRate,
      audioUploads,
      earnedPoints,
      proverbsAdded,
      reviewedCount,
      sentencesAdded,
      wordsAdded,
    }
  }, [contributions, uploads])

  const currentPoints =
    leaderboardUser?.totalPoints ??
    appUser?.totalPoints ??
    calculatedStats.earnedPoints
  const approvedEntries =
    leaderboardUser?.approvedEntries ??
    appUser?.approvedEntries ??
    calculatedStats.approvedEntries

  useEffect(() => {
    let active = true

    if (!appUserId) {
      return () => {
        active = false
      }
    }

    getLeaderboardRank('allTime', currentPoints)
      .then((rank) => {
        if (active) {
          setCurrentRank(rank)
        }
      })
      .catch(() => {
        if (active) {
          setCurrentRank(null)
        }
      })

    return () => {
      active = false
    }
  }, [appUserId, currentPoints])

  const sortedLevels = useMemo(
    () =>
      [...levels].sort((first, second) => first.minPoints - second.minPoints),
    [levels],
  )
  const currentLevel =
    [...sortedLevels]
      .reverse()
      .find((level) => currentPoints >= level.minPoints) ?? null
  const nextLevel =
    sortedLevels.find((level) => level.minPoints > currentPoints) ?? null
  const levelTitle =
    currentLevel?.title ||
    leaderboardUser?.badgeTitle ||
    appUser?.badgeTitle ||
    'Contributor'
  const levelStart = currentLevel?.minPoints ?? 0
  const levelTarget =
    nextLevel?.minPoints ??
    currentLevel?.maxPoints ??
    Math.max(currentPoints, 1)
  const levelProgress = nextLevel
    ? ((currentPoints - levelStart) / Math.max(1, levelTarget - levelStart)) *
      100
    : 100
  const pointsToNextLevel = nextLevel
    ? Math.max(0, nextLevel.minPoints - currentPoints)
    : 0

  const activityDates = useMemo(
    () => getActivityDates(contributions, uploads),
    [contributions, uploads],
  )
  const heatmapDays = useMemo(
    () => buildHeatmapDays(activityDates),
    [activityDates],
  )
  const streakSummary = useMemo(
    () => getStreakSummary(activityDates),
    [activityDates],
  )

  const activityPoints = useMemo<ActivityPoint[]>(() => {
    const contributionPoints = calculatedStats.approvedContributions
      .map((contribution) => {
        const date = getContributionDate(contribution)
        return date
          ? {
              date,
              points: pointsForContribution(contribution),
            }
          : null
      })
      .filter(Boolean) as ActivityPoint[]
    const uploadPoints = calculatedStats.approvedUploads
      .map((upload) => {
        const date = getUploadDate(upload)
        return date
          ? {
              date,
              points: pointsForUpload(upload),
            }
          : null
      })
      .filter(Boolean) as ActivityPoint[]

    return [...contributionPoints, ...uploadPoints].sort(
      (first, second) => first.date.getTime() - second.date.getTime(),
    )
  }, [calculatedStats.approvedContributions, calculatedStats.approvedUploads])

  const chartRows = useMemo(
    () => getChartRows(activityPoints),
    [activityPoints],
  )
  const maxChartContributions = Math.max(
    1,
    ...chartRows.map((row) => row.contributions),
  )
  const maxChartPoints = Math.max(1, ...chartRows.map((row) => row.points))

  const categoryRows = useMemo(() => {
    const counts = new Map<string, number>()
    contributions.forEach((contribution) => {
      const label = contribution.category || 'Uncategorized'
      counts.set(label, (counts.get(label) ?? 0) + 1)
    })
    uploads.forEach((upload) => {
      const label = upload.category || 'Uncategorized'
      counts.set(label, (counts.get(label) ?? 0) + 1)
    })

    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((first, second) => second.count - first.count)
      .slice(0, 5)
  }, [contributions, uploads])
  const maxCategoryCount = Math.max(1, ...categoryRows.map((row) => row.count))

  const journeyEvents = useMemo<JourneyEvent[]>(() => {
    const events: JourneyEvent[] = []
    const joinedAt = getDate(appUser?.createdAt)

    if (joinedAt) {
      events.push({
        id: 'joined',
        title: 'Joined TribeStudio',
        date: joinedAt,
        icon: 'leaf',
      })
    }

    const firstContribution = [...contributions]
      .filter((item) => getDate(item.createdAt))
      .sort(
        (first, second) =>
          getMillis(first.createdAt) - getMillis(second.createdAt),
      )[0]

    if (firstContribution) {
      events.push({
        id: 'first-contribution',
        title: 'Submitted first contribution',
        date: getDate(firstContribution.createdAt) as Date,
        icon: 'words',
      })
    }

    const firstAudio = uploads
      .filter((upload) => isAudioUpload(upload) && getDate(upload.createdAt))
      .sort(
        (first, second) =>
          getMillis(first.createdAt) - getMillis(second.createdAt),
      )[0]

    if (firstAudio) {
      events.push({
        id: 'first-audio',
        title: 'Uploaded first audio',
        date: getDate(firstAudio.createdAt) as Date,
        icon: 'audio',
      })
    }

    let runningPoints = 0
    const reachedLevelIds = new Set<string>()

    activityPoints.forEach((item) => {
      runningPoints += item.points
      sortedLevels.forEach((level) => {
        if (
          level.minPoints > 0 &&
          runningPoints >= level.minPoints &&
          !reachedLevelIds.has(level.id)
        ) {
          reachedLevelIds.add(level.id)
          events.push({
            id: `level-${level.id}`,
            title: `Reached ${level.title}`,
            date: item.date,
            icon: 'badge',
          })
        }
      })
    })

    return events
      .sort((first, second) => first.date.getTime() - second.date.getTime())
      .slice(-6)
  }, [activityPoints, appUser?.createdAt, contributions, sortedLevels, uploads])

  const culturalStats = useMemo(() => {
    const submittedText = [
      ...contributions.map(
        (item) => `${item.category} ${item.notes} ${item.englishText}`,
      ),
      ...uploads.map(
        (item) => `${item.category} ${item.title} ${item.tags ?? ''}`,
      ),
    ]

    return {
      stories: submittedText.filter((item) =>
        includesAny(item, ['story', 'folklore', 'oral history']),
      ).length,
      proverbs: contributions.filter(isProverbContribution).length,
      songs: submittedText.filter((item) =>
        includesAny(item, ['song', 'music', 'chant']),
      ).length,
      notes: submittedText.filter((item) =>
        includesAny(item, ['culture', 'custom', 'tradition', 'note']),
      ).length,
    }
  }, [contributions, uploads])

  const redeemedPoints = redemptions.reduce(
    (total, redemption) => total + redemption.cost,
    0,
  )
  const lifetimePoints = currentPoints + redeemedPoints
  const nextReward = rewardItems
    .filter((item) => item.cost > currentPoints)
    .sort((first, second) => first.cost - second.cost)[0]
  const nextRewardProgress = nextReward
    ? (currentPoints / Math.max(1, nextReward.cost)) * 100
    : rewardItems.length
      ? 100
      : 0

  const currentRegionRank =
    regionalLeaderboard.find((entry) => entry.uid === appUser?.uid)?.rank ??
    (regionalLeaderboard.length
      ? regionalLeaderboard.filter((entry) => entry.totalPoints > currentPoints)
          .length + 1
      : null)
  const nextRankProfile = currentRank
    ? leaderboard.find((entry) => entry.rank === currentRank - 1)
    : undefined
  const pointsBehindNextRank = nextRankProfile
    ? Math.max(0, nextRankProfile.activePoints - currentPoints + 1)
    : 0
  const topTenProfile = leaderboard.find((entry) => entry.rank === 10)
  const pointsToTopTen =
    currentRank && currentRank <= 10
      ? 0
      : topTenProfile
        ? Math.max(0, topTenProfile.activePoints - currentPoints + 1)
        : null

  const achievementStates = achievements.map((achievement) => {
    const target = Math.max(achievement.target, 1)
    const value = getAchievementValue({
      achievement,
      approvedEntries,
      currentPoints,
      totalContributions: contributions.length,
      totalUploads: uploads.length,
    })

    return {
      achievement,
      earned: value >= target,
      progress: Math.min(100, (value / target) * 100),
      value,
      target,
    }
  })
  const unlockedAchievements = achievementStates.filter(
    (item) => item.earned,
  ).length

  const profileCompletion = appUser
    ? getProfileCompletion(appUser, uploads)
    : { items: [], percent: 0 }

  const weekContributionCount = heatmapDays
    .slice(-7)
    .reduce((total, day) => total + day.count, 0)
  const monthContributionCount = heatmapDays.reduce(
    (total, day) =>
      day.date.getMonth() === new Date().getMonth() &&
      day.date.getFullYear() === new Date().getFullYear()
        ? total + day.count
        : total,
    0,
  )

  const impactMetrics: ImpactMetric[] = [
    {
      label: 'Words Added',
      value: calculatedStats.wordsAdded,
      icon: 'book',
      tone: 'border-[#d7e6d4] bg-[#f3faf0] text-kassena-green',
    },
    {
      label: 'Sentences Added',
      value: calculatedStats.sentencesAdded,
      icon: 'words',
      tone: 'border-[#efd4bd] bg-[#fff5ee] text-kassena-orange',
    },
    {
      label: 'Proverbs Added',
      value: calculatedStats.proverbsAdded,
      icon: 'proverb',
      tone: 'border-[#dfd2ea] bg-[#fbf5ff] text-[#71428d]',
    },
    {
      label: 'Audio Uploads',
      value: calculatedStats.audioUploads,
      icon: 'audio',
      tone: 'border-[#d8e8d1] bg-[#f7fbf3] text-[#257236]',
    },
    {
      label: 'Approval Rate',
      value: `${calculatedStats.approvalRate}%`,
      icon: 'check',
      tone: 'border-[#e8dfc5] bg-[#fffbed] text-[#71530c]',
    },
    {
      label: 'Approved Entries',
      value: approvedEntries,
      icon: 'badge',
      tone: 'border-[#efd2bd] bg-[#fff7ef] text-[#a14318]',
    },
  ]

  if (!appUser) {
    return <LoadingState message="Loading profile..." />
  }

  const userDialects = getUserDialects(appUser)

  const toggleDialect = (dialect: string) => {
    setForm((current) => {
      const currentDialects = current.dialects ?? []
      const nextDialects = currentDialects.includes(dialect)
        ? currentDialects.filter((item) => item !== dialect)
        : [...currentDialects, dialect]

      return {
        ...current,
        dialect: nextDialects[0] ?? '',
        dialects: nextDialects,
      }
    })
  }

  const openEditor = () => {
    setFeedback(null)
    if (!isEditing) {
      setForm({
        displayName: appUser.displayName ?? '',
        photoURL: appUser.photoURL ?? '',
        community: appUser.community ?? '',
        dialect: getUserDialects(appUser)[0] ?? '',
        dialects: getUserDialects(appUser),
        phone: appUser.phone ?? '',
        bio: appUser.bio ?? '',
        contributionFocus: appUser.contributionFocus ?? '',
      })
    }
    setIsEditing((current) => !current)
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setFeedback(null)

    try {
      await updateUserProfile(form)
      setFeedback({ type: 'success', message: 'Profile updated.' })
      setIsEditing(false)
    } catch {
      setFeedback({
        type: 'error',
        message: 'Unable to update profile right now.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const shareText = `${appUser.displayName} has contributed ${formatNumber(
    calculatedStats.wordsAdded,
  )} words, earned ${formatNumber(currentPoints)} points, and helped preserve the Kasem language with TribeStudio.`

  const handleShare = async () => {
    setShareFeedback('')

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'TribeStudio contributor impact',
          text: shareText,
        })
        setShareFeedback('Share card ready.')
        return
      }

      await navigator.clipboard?.writeText(shareText)
      setShareFeedback('Share text copied.')
    } catch {
      setShareFeedback('Share could not be opened.')
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/dashboard')
  }

  return (
    <section className="mx-auto max-w-[1120px] space-y-4 pb-24 text-[#13271d] sm:space-y-5 md:pb-8">
      <header className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[52px_minmax(0,1fr)_auto]">
        <button
          type="button"
          onClick={handleBack}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-[#edd7b6] bg-white text-[#0b4b2b] shadow-[0_10px_24px_rgba(71,44,18,0.08)] sm:h-12 sm:w-12"
          aria-label="Go back"
        >
          <Icon name="arrowLeft" className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-3xl font-black leading-tight text-[#073d24] sm:text-4xl">
            My Profile
          </h1>
          <p className="truncate text-sm font-semibold text-slate-600 sm:text-base">
            Your journey in preserving Kasem
          </p>
        </div>

        <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1 sm:justify-end">
          {appUser.role === 'admin' ? (
            <Link
              to="/admin"
              className="inline-flex min-h-11 items-center gap-2 rounded-[16px] bg-kassena-green px-4 py-2 text-sm font-black text-white shadow-[0_10px_24px_rgba(20,83,45,0.2)]"
            >
              <Icon name="admin" className="h-4.5 w-4.5" />
              Admin Panel
            </Link>
          ) : null}
          <button
            type="button"
            onClick={logout}
            className="inline-flex min-h-11 items-center justify-center rounded-[16px] border border-[#ead9bd] bg-white px-4 py-2 text-sm font-black text-kassena-green"
          >
            Logout
          </button>
        </div>
      </header>

      {dataError ? <AlertMessage type="error" message={dataError} /> : null}

      <section className="relative overflow-hidden rounded-[28px] bg-[#0b4b2b] p-4 text-white shadow-[0_20px_48px_rgba(10,58,34,0.24)] sm:p-6">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,transparent_0_42%,rgba(255,255,255,0.16)_42%_46%,transparent_46%_100%),repeating-linear-gradient(45deg,rgba(255,255,255,0.08)_0_2px,transparent_2px_18px)]" />
        <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center">
            <div className="relative mx-auto w-max sm:mx-0">
              <div className="rounded-full bg-[#f8d56f] p-1.5 shadow-[0_12px_28px_rgba(0,0,0,0.22)]">
                <Avatar
                  photoURL={appUser.photoURL}
                  name={appUser.displayName}
                  className="h-24 w-24 text-2xl sm:h-28 sm:w-28"
                />
              </div>
              <button
                type="button"
                onClick={openEditor}
                className="absolute -bottom-1 -right-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#0d6b3c] text-white ring-4 ring-[#f8d56f]"
                aria-label="Edit profile photo"
              >
                <Icon name="camera" className="h-5 w-5" />
              </button>
            </div>

            <div className="min-w-0 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-[#f5c84b]/50 bg-white/10 px-3 py-1 text-xs font-black uppercase text-[#f9dc78]">
                  <Icon name="admin" className="h-3.5 w-3.5" />
                  <span className="truncate">{appUser.role}</span>
                </span>
                {appUser.community ? (
                  <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                    <Icon name="community" className="h-3.5 w-3.5" />
                    <span className="truncate">{appUser.community}</span>
                  </span>
                ) : null}
              </div>

              <h2 className="mt-3 truncate text-3xl font-black leading-tight sm:text-4xl">
                {appUser.displayName}
              </h2>
              <p className="mt-1 text-lg font-black text-[#f5c84b]">
                {levelTitle}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 min-[520px]:grid-cols-4">
                <div className="rounded-[16px] bg-white/10 p-3">
                  <p className="text-2xl font-black">
                    {formatNumber(currentPoints)}
                  </p>
                  <p className="text-xs font-semibold text-white/82">Points</p>
                </div>
                <div className="rounded-[16px] bg-white/10 p-3">
                  <p className="text-2xl font-black">
                    {currentRank ? `#${formatNumber(currentRank)}` : '-'}
                  </p>
                  <p className="text-xs font-semibold text-white/82">Rank</p>
                </div>
                <div className="rounded-[16px] bg-white/10 p-3">
                  <p className="text-base font-black leading-tight">
                    {toMonthYearLabel(appUser.createdAt)}
                  </p>
                  <p className="text-xs font-semibold text-white/82">
                    Member Since
                  </p>
                </div>
                <div className="rounded-[16px] bg-white/10 p-3">
                  <p className="truncate text-base font-black leading-tight">
                    {appUser.community || '-'}
                  </p>
                  <p className="text-xs font-semibold text-white/82">
                    Community
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#f8d56f] text-[#0b4b2b]">
                <Icon name="medal" className="h-8 w-8" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white/82">
                  Level Progress
                </p>
                <h3 className="mt-1 truncate text-2xl font-black">
                  {levelTitle}
                </h3>
                <p className="mt-1 text-sm font-semibold text-white/86">
                  {formatNumber(currentPoints)} /{' '}
                  {nextLevel
                    ? formatNumber(nextLevel.minPoints)
                    : formatNumber(levelTarget)}{' '}
                  XP
                </p>
              </div>
            </div>
            <ProgressBar value={levelProgress} className="mt-4 bg-white/20" />
            <div className="mt-3 flex items-center justify-between gap-3 text-sm font-semibold text-white/88">
              <span>
                {nextLevel
                  ? `${formatNumber(pointsToNextLevel)} XP to ${nextLevel.title}`
                  : 'Top configured level reached'}
              </span>
              <Icon name="chevronRight" className="h-5 w-5 shrink-0" />
            </div>
            {!levels.length && !isLoading ? (
              <p className="mt-3 text-xs font-semibold text-white/70">
                Contributor levels are ready to display once configured in
                Firebase.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={openEditor}
          className="flex min-h-14 items-center justify-center gap-2 rounded-[18px] border border-[#ead9bd] bg-white px-4 py-3 text-sm font-black text-kassena-green shadow-[0_10px_24px_rgba(71,44,18,0.08)]"
        >
          <Icon name="edit" className="h-5 w-5" />
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex min-h-14 items-center justify-center gap-2 rounded-[18px] border border-[#efd4bd] bg-white px-4 py-3 text-sm font-black text-kassena-orange shadow-[0_10px_24px_rgba(71,44,18,0.08)]"
        >
          <Icon name="share" className="h-5 w-5" />
          Share Profile
        </button>
        <a
          href="#achievements"
          className="flex min-h-14 items-center justify-center gap-2 rounded-[18px] border border-[#ead9bd] bg-white px-4 py-3 text-sm font-black text-[#9a6b08] shadow-[0_10px_24px_rgba(71,44,18,0.08)]"
        >
          <Icon name="badge" className="h-5 w-5" />
          My Badges
        </a>
        <button
          type="button"
          onClick={openEditor}
          className="flex min-h-14 items-center justify-center gap-2 rounded-[18px] border border-[#ead9bd] bg-white px-4 py-3 text-sm font-black text-[#71428d] shadow-[0_10px_24px_rgba(71,44,18,0.08)]"
        >
          <Icon name="settings" className="h-5 w-5" />
          Settings
        </button>
      </div>

      {shareFeedback ? (
        <AlertMessage type="success" message={shareFeedback} />
      ) : null}

      {feedback ? (
        <AlertMessage type={feedback.type} message={feedback.message} />
      ) : null}

      {isEditing ? (
        <Panel>
          <SectionHeader title="Edit Profile" icon="edit" />
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span>Name</span>
                <input
                  value={form.displayName}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      displayName: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span>Photo URL</span>
                <input
                  value={form.photoURL}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      photoURL: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-1 text-sm">
                <span>Community</span>
                <input
                  value={form.community}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      community: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span>Phone</span>
                <input
                  value={form.phone}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                />
              </label>
            </div>
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-slate-900">
                Dialects or regions you know
              </legend>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {DIALECT_OPTIONS.map((dialect) => (
                  <label
                    key={dialect}
                    className="flex items-center gap-2 rounded-lg border border-kassena-cream px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={(form.dialects ?? []).includes(dialect)}
                      onChange={() => toggleDialect(dialect)}
                    />
                    <span>{dialect}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="space-y-1 text-sm">
              <span>Contribution focus</span>
              <input
                value={form.contributionFocus}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contributionFocus: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-kassena-cream px-3 py-2"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Bio or contribution notes</span>
              <textarea
                value={form.bio}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, bio: event.target.value }))
                }
                className="min-h-28 w-full rounded-lg border border-kassena-cream px-3 py-2"
              />
            </label>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-kassena-orange px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save profile'}
            </button>
          </form>
        </Panel>
      ) : (
        <Panel>
          <SectionHeader title="Profile Details" icon="user" />
          <dl className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">Community</dt>
              <dd>{appUser.community || 'Not set'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Dialects/regions</dt>
              <dd>
                {userDialects.length ? userDialects.join(', ') : 'Not set'}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Phone</dt>
              <dd>{appUser.phone || 'Not set'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">
                Contribution focus
              </dt>
              <dd>{appUser.contributionFocus || 'Not set'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Last sign-in</dt>
              <dd>{toDateLabel(appUser.lastLoginAt)}</dd>
            </div>
            {appUser.bio ? (
              <div className="md:col-span-2">
                <dt className="font-semibold text-slate-900">Bio</dt>
                <dd>{appUser.bio}</dd>
              </div>
            ) : null}
          </dl>
        </Panel>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ['Submitted', contributionStats.total + uploadStats.total],
          ['Pending', contributionStats.pending + uploadStats.pending],
          ['Approved', contributionStats.approved + uploadStats.approved],
          ['Rejected', contributionStats.rejected + uploadStats.rejected],
          ['Points', currentPoints],
        ].map(([label, value]) => (
          <article key={label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-kassena-green">{value}</p>
          </article>
        ))}
      </div>

      {/* Dictionary Tabs */}
      <Panel>
        <SectionHeader title="My Dictionary" icon="book" />
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 mb-4">
          <button
            type="button"
            onClick={() => setDictionaryTab('favorites')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              dictionaryTab === 'favorites'
                ? 'bg-white text-kassena-green shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Favorites
          </button>
          <button
            type="button"
            onClick={() => setDictionaryTab('recent')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              dictionaryTab === 'recent'
                ? 'bg-white text-kassena-green shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Recently Viewed
          </button>
          <button
            type="button"
            onClick={() => setDictionaryTab('history')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              dictionaryTab === 'history'
                ? 'bg-white text-kassena-green shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Search History
          </button>
        </div>
        {dictionaryTab === 'favorites' && <FavoritesTab />}
        {dictionaryTab === 'recent' && <RecentlyViewedTab />}
        {dictionaryTab === 'history' && <SearchHistoryTab />}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <SectionHeader title="Impact Summary" icon="analytics" />
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="grid gap-3 min-[420px]:grid-cols-2 xl:grid-cols-3">
              {impactMetrics.map((item) => (
                <MetricTile key={item.label} item={item} />
              ))}
            </div>
          )}
        </Panel>

        <div className="grid gap-4">
          <Panel>
            <SectionHeader title="Contribution Streak" icon="streak" />
            <div className="grid grid-cols-[90px_minmax(0,1fr)] items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-[10px] border-[#f4bd45] bg-[#fff7e7] text-kassena-orange">
                <Icon name="streak" className="h-8 w-8" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-3xl font-black text-[#101f1a]">
                    {streakSummary.currentStreak}
                  </p>
                  <p className="text-xs font-semibold text-slate-600">
                    Current Streak
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-black text-[#101f1a]">
                    {streakSummary.longestStreak}
                  </p>
                  <p className="text-xs font-semibold text-slate-600">
                    Longest Streak
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-600">
              {formatNumber(streakSummary.activeDays)} active days recorded
            </p>
          </Panel>

          <Panel>
            <SectionHeader
              title="Rewards Snapshot"
              icon="gift"
              action={
                <Link
                  to="/rewards"
                  className="text-xs font-black text-kassena-green"
                >
                  View all
                </Link>
              }
            />
            <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {[
                ['Current Points', currentPoints],
                ['Lifetime Points', lifetimePoints],
                ['Redeemed Rewards', redemptions.length],
                ['Available Rewards', rewardItems.length],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[16px] border border-[#ead9bd] bg-[#fffaf2] p-3"
                >
                  <p className="text-xl font-black text-kassena-green">
                    {typeof value === 'number' ? formatNumber(value) : value}
                  </p>
                  <p className="text-xs font-semibold text-slate-600">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            {nextReward ? (
              <div className="mt-4">
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-600">
                  <span className="truncate">{nextReward.title}</span>
                  <span>{formatNumber(nextReward.cost)} pts</span>
                </div>
                <ProgressBar value={nextRewardProgress} className="mt-2" />
              </div>
            ) : null}
          </Panel>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel id="achievements">
          <SectionHeader
            title="Achievements"
            icon="badge"
            action={
              <p className="text-xs font-black text-slate-600">
                {unlockedAchievements} / {achievements.length} Unlocked
              </p>
            }
          />
          {isLoading ? (
            <LoadingState />
          ) : achievementStates.length ? (
            <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 sm:grid-cols-4 xl:grid-cols-5">
              {achievementStates.map(({ achievement, earned, progress }) => (
                <article
                  key={achievement.id}
                  className={`relative min-w-0 rounded-[18px] border p-3 text-center ${
                    earned
                      ? 'border-[#e2bd5a] bg-[#fff8e7]'
                      : 'border-[#d9d9d9] bg-[#f7f7f7] text-slate-500'
                  }`}
                >
                  <div
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                      earned
                        ? 'bg-[#d99418] text-white ring-4 ring-[#f6dc92]'
                        : 'bg-slate-200 text-slate-500 ring-4 ring-slate-100'
                    }`}
                  >
                    <Icon
                      name={earned ? 'medal' : 'lock'}
                      className="h-7 w-7"
                    />
                  </div>
                  <h3 className="mt-3 text-xs font-black leading-4 text-[#13271d]">
                    {achievement.title}
                  </h3>
                  <p className="mt-1 text-[11px] font-semibold">
                    {earned ? 'Unlocked' : `${Math.round(progress)}%`}
                  </p>
                  {!earned ? (
                    <ProgressBar value={progress} className="mt-2 h-1.5" />
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <EmptyPanelMessage message="Achievement badges have not been configured in Firebase yet." />
          )}
        </Panel>

        <Panel>
          <SectionHeader
            title="Leaderboard Status"
            icon="trophy"
            action={
              <Link
                to="/leaderboard"
                className="text-xs font-black text-kassena-green"
              >
                View Leaderboard
              </Link>
            }
          />
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 border-b border-[#efdfc4] pb-3">
              <span className="flex min-w-0 items-center gap-2 font-bold">
                <Icon name="globe" className="h-5 w-5 text-kassena-green" />
                National Rank
              </span>
              <span className="font-black text-kassena-green">
                {currentRank ? `#${formatNumber(currentRank)}` : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-[#efdfc4] pb-3">
              <span className="flex min-w-0 items-center gap-2 font-bold">
                <Icon name="community" className="h-5 w-5 text-kassena-gold" />
                {appUser.community || 'Regional'} Rank
              </span>
              <span className="font-black text-kassena-green">
                {currentRegionRank
                  ? `#${formatNumber(currentRegionRank)}`
                  : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-[#efdfc4] pb-3">
              <span className="flex min-w-0 items-center gap-2 font-bold">
                <Icon name="target" className="h-5 w-5 text-kassena-orange" />
                Points Behind Next Rank
              </span>
              <span className="font-black text-kassena-green">
                {pointsBehindNextRank
                  ? `${formatNumber(pointsBehindNextRank)} pts`
                  : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 font-bold">
                <Icon name="reward" className="h-5 w-5 text-[#257236]" />
                Points to Top 10
              </span>
              <span className="font-black text-kassena-green">
                {pointsToTopTen === null
                  ? '-'
                  : `${formatNumber(pointsToTopTen)} pts`}
              </span>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.8fr]">
        <Panel>
          <SectionHeader
            title="Contribution Activity"
            icon="activity"
            action={
              <p className="text-xs font-black text-slate-600">
                {monthContributionCount} this month
              </p>
            }
          />
          <div className="grid grid-cols-7 gap-1.5">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <p
                key={`${day}-${index}`}
                className="text-center text-[11px] font-bold text-slate-500"
              >
                {day}
              </p>
            ))}
            {heatmapDays.map((day) => {
              const tone =
                day.count === 0
                  ? 'bg-[#e8f1dd]'
                  : day.count === 1
                    ? 'bg-[#b8dbab]'
                    : day.count === 2
                      ? 'bg-[#6cb66d]'
                      : 'bg-[#146b38]'

              return (
                <span
                  key={day.key}
                  title={`${day.count} contributions on ${toShortDateLabel(day.date)}`}
                  className={`aspect-square rounded-[5px] ${tone}`}
                />
              )
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-600">
            <span>{weekContributionCount} this week</span>
            <span>{activityDates.length} total activity days</span>
          </div>
        </Panel>

        <Panel>
          <SectionHeader title="Contribution Journey" icon="timeline" />
          {journeyEvents.length ? (
            <div className="space-y-0">
              {journeyEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="grid grid-cols-[28px_minmax(0,1fr)_auto] gap-3"
                >
                  <div className="relative flex justify-center">
                    <span className="z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#5c9b35] text-white ring-4 ring-[#edf6e9]">
                      <Icon name={event.icon} className="h-3.5 w-3.5" />
                    </span>
                    {index < journeyEvents.length - 1 ? (
                      <span className="absolute top-7 h-full border-l-2 border-[#9bc37f]" />
                    ) : null}
                  </div>
                  <p className="min-w-0 pb-4 text-sm font-bold text-[#13271d]">
                    {event.title}
                  </p>
                  <p className="pb-4 text-right text-xs font-semibold text-slate-500">
                    {toShortDateLabel(event.date)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPanelMessage message="Your journey timeline will appear after your first Firebase-backed activity." />
          )}
        </Panel>

        <Panel>
          <SectionHeader title="Cultural Contributions" icon="leaf" />
          <div className="space-y-3">
            {[
              ['Stories Submitted', culturalStats.stories, 'book' as IconName],
              [
                'Proverbs Submitted',
                culturalStats.proverbs,
                'proverb' as IconName,
              ],
              ['Songs Uploaded', culturalStats.songs, 'song' as IconName],
              ['Cultural Notes Added', culturalStats.notes, 'leaf' as IconName],
            ].map(([label, value, icon]) => (
              <div
                key={label as string}
                className="flex items-center justify-between gap-3 border-b border-[#efdfc4] pb-3 last:border-b-0 last:pb-0"
              >
                <span className="flex min-w-0 items-center gap-2 text-sm font-bold">
                  <Icon
                    name={icon as IconName}
                    className="h-5 w-5 text-kassena-orange"
                  />
                  <span className="truncate">{label}</span>
                </span>
                <span className="font-black text-[#13271d]">{value}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1fr_1fr]">
        <Panel>
          <SectionHeader
            title="Recommended for You"
            icon="target"
            action={
              <Link
                to="/rewards"
                className="text-xs font-black text-kassena-green"
              >
                View all
              </Link>
            }
          />
          {bounties.length ? (
            <div className="space-y-3">
              {bounties.slice(0, 3).map((bounty) => {
                const progress =
                  (bounty.currentContributions /
                    Math.max(1, bounty.targetContributions)) *
                  100

                return (
                  <Link
                    key={bounty.id}
                    to="/rewards"
                    className="grid grid-cols-[54px_minmax(0,1fr)_28px] items-center gap-3 rounded-[18px] border border-[#ead9bd] bg-[#fffaf2] p-3"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#edf6e9] text-kassena-green">
                      <Icon name="target" className="h-6 w-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black text-[#13271d]">
                        {bounty.title}
                      </span>
                      <span className="mt-1 block text-xs font-bold text-kassena-green">
                        +{formatNumber(bounty.pointsPerContribution)} bonus
                        points
                      </span>
                      <ProgressBar value={progress} className="mt-2 h-1.5" />
                    </span>
                    <Icon
                      name="chevronRight"
                      className="h-5 w-5 text-kassena-green"
                    />
                  </Link>
                )
              })}
            </div>
          ) : (
            <EmptyPanelMessage message="Suggested bounties will appear here after reward campaigns are configured in Firebase." />
          )}
        </Panel>

        <Panel>
          <SectionHeader title="Profile Completeness" icon="check" />
          <div className="grid grid-cols-[90px_minmax(0,1fr)] items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-[10px] border-[#159447] bg-[#f3faf0]">
              <span className="text-xl font-black text-kassena-green">
                {profileCompletion.percent}%
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-lg font-black text-kassena-green">
                {profileCompletion.percent >= 85 ? 'Great job' : 'Keep going'}
              </p>
              <ProgressBar value={profileCompletion.percent} className="mt-2" />
              <div className="mt-3 flex flex-wrap gap-2">
                {profileCompletion.items.map((item) => (
                  <span
                    key={item.label}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      item.complete
                        ? 'bg-[#edf6e9] text-kassena-green'
                        : 'bg-[#fff4e4] text-[#9a5a18]'
                    }`}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionHeader title="Share Your Impact" icon="share" />
          <div className="grid grid-cols-[minmax(0,1fr)_92px] items-center gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-6 text-slate-600">
                Create your contributor card and share your achievements.
              </p>
              <button
                type="button"
                onClick={handleShare}
                className="mt-4 rounded-full bg-kassena-orange px-5 py-3 text-sm font-black text-white shadow-[0_10px_24px_rgba(201,106,45,0.22)]"
              >
                Create Card
              </button>
            </div>
            <div className="overflow-hidden rounded-[18px] bg-[#0b4b2b] p-2 text-white shadow-[0_12px_24px_rgba(10,58,34,0.22)]">
              <Avatar
                photoURL={appUser.photoURL}
                name={appUser.displayName}
                className="mx-auto h-14 w-14 text-sm ring-2 ring-[#f8d56f]"
              />
              <p className="mt-2 truncate text-center text-xs font-black">
                {appUser.displayName}
              </p>
              <p className="truncate text-center text-[11px] font-bold text-[#f8d56f]">
                {levelTitle}
              </p>
              <p className="mt-1 text-center text-sm font-black">
                {formatNumber(currentPoints)} pts
              </p>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <SectionHeader title="Personal Analytics" icon="analytics" />
          {chartRows.length ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-black text-[#13271d]">
                  Contributions Over Time
                </h3>
                <div className="mt-3 space-y-2">
                  {chartRows.map((row) => (
                    <div
                      key={`contributions-${row.label}`}
                      className="grid grid-cols-[48px_minmax(0,1fr)_34px] items-center gap-3 text-xs"
                    >
                      <span className="font-bold text-slate-600">
                        {row.label}
                      </span>
                      <ProgressBar
                        value={
                          (row.contributions / maxChartContributions) * 100
                        }
                        className="h-2"
                      />
                      <span className="text-right font-black">
                        {row.contributions}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-[#13271d]">
                  Points Earned
                </h3>
                <div className="mt-3 space-y-2">
                  {chartRows.map((row) => (
                    <div
                      key={`points-${row.label}`}
                      className="grid grid-cols-[48px_minmax(0,1fr)_58px] items-center gap-3 text-xs"
                    >
                      <span className="font-bold text-slate-600">
                        {row.label}
                      </span>
                      <ProgressBar
                        value={(row.points / maxChartPoints) * 100}
                        className="h-2"
                      />
                      <span className="text-right font-black">
                        {formatNumber(row.points)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 min-[520px]:grid-cols-2">
                <div className="rounded-[18px] border border-[#ead9bd] bg-[#fffaf2] p-3">
                  <p className="text-sm font-black text-[#13271d]">
                    Approval Trends
                  </p>
                  <p className="mt-2 text-3xl font-black text-kassena-green">
                    {calculatedStats.approvalRate}%
                  </p>
                  <p className="text-xs font-semibold text-slate-600">
                    {formatNumber(calculatedStats.reviewedCount)} reviewed items
                  </p>
                </div>
                <div className="rounded-[18px] border border-[#ead9bd] bg-[#fffaf2] p-3">
                  <p className="text-sm font-black text-[#13271d]">
                    Most Contributed Topics
                  </p>
                  <p className="mt-2 truncate text-lg font-black text-kassena-green">
                    {categoryRows[0]?.label ?? '-'}
                  </p>
                  <p className="text-xs font-semibold text-slate-600">
                    {categoryRows[0]?.count ?? 0} submissions
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyPanelMessage message="Analytics will appear after approved Firebase activity is recorded." />
          )}
        </Panel>

        <Panel>
          <SectionHeader title="Contribution Categories" icon="book" />
          {categoryRows.length ? (
            <div className="space-y-3">
              {categoryRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[minmax(0,1fr)_38px] items-center gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2 text-xs font-bold">
                      <span className="truncate text-slate-700">
                        {row.label}
                      </span>
                    </div>
                    <ProgressBar
                      value={(row.count / maxCategoryCount) * 100}
                      className="mt-2 h-2"
                    />
                  </div>
                  <span className="text-right text-sm font-black">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPanelMessage message="No contribution categories found yet." />
          )}
        </Panel>
      </div>

      <Panel>
        <SectionHeader title="Community Recognition" icon="medal" />
        {recognitions.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {recognitions.map((recognition) => (
              <article
                key={recognition.id}
                className="rounded-[18px] border border-[#ead9bd] bg-[#fffaf2] p-4"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf6e9] text-kassena-green">
                  <Icon name="medal" className="h-6 w-6" />
                </span>
                <h3 className="mt-3 text-base font-black text-[#13271d]">
                  {recognition.title}
                </h3>
                {recognition.description ? (
                  <p className="mt-1 text-sm text-slate-600">
                    {recognition.description}
                  </p>
                ) : null}
                <p className="mt-3 text-xs font-bold text-slate-500">
                  {recognition.scope
                    ? `${recognition.scope} - ${toShortDateLabel(
                        recognition.awardedAt,
                      )}`
                    : toShortDateLabel(recognition.awardedAt)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyPanelMessage message="Community recognitions will appear here after they are awarded in Firebase." />
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionHeader title="Contribution History" icon="words" />
          {isLoading ? (
            <LoadingState />
          ) : contributions.length ? (
            <div className="space-y-3">
              {contributions.slice(0, 5).map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border border-kassena-cream p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-kassena-green">
                      {item.englishText} / {item.kasemText}
                    </p>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.category} - {toDateLabel(item.createdAt)}
                  </p>
                  {item.alternateKasemTerms ? (
                    <p className="mt-2 text-sm text-slate-600">
                      Other Kasem forms: {item.alternateKasemTerms}
                    </p>
                  ) : null}
                  {item.reviewNotes ? (
                    <p className="mt-2 text-sm text-slate-600">
                      {item.reviewNotes}
                    </p>
                  ) : null}
                  {item.attachedFiles?.length ? (
                    <div className="mt-3 space-y-3">
                      {item.attachedFiles.map((file) => (
                        <MediaPreview
                          key={file.storagePath || file.url || file.name}
                          compact
                          file={{
                            name: file.name,
                            url: file.url,
                            contentType: file.contentType,
                          }}
                          title={`${item.englishText} attachment`}
                        />
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState message="You have not submitted a language contribution yet." />
          )}
        </Panel>

        <Panel>
          <SectionHeader
            title="Upload History"
            icon="upload"
            action={
              <p className="text-xs font-black text-slate-600">
                {uploadStats.approved}/{uploadStats.total} approved
              </p>
            }
          />
          {isLoading ? (
            <LoadingState />
          ) : uploads.length ? (
            <div className="space-y-3">
              {uploads.slice(0, 5).map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border border-kassena-cream p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-kassena-green">
                      {item.title}
                    </p>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {[
                      item.category,
                      item.consentStatus,
                      item.culturalSensitivity,
                    ]
                      .filter(Boolean)
                      .join(' - ')}
                  </p>
                  {item.reviewNotes ? (
                    <p className="mt-2 text-sm text-slate-600">
                      {item.reviewNotes}
                    </p>
                  ) : null}
                  <MediaPreview
                    className="mt-3"
                    compact
                    file={{
                      name: item.fileName,
                      url: item.fileUrl,
                      contentType: item.contentType,
                    }}
                    title={item.title}
                  />
                </article>
              ))}
            </div>
          ) : (
            <EmptyState message="You have not uploaded media or documents yet." />
          )}
        </Panel>
      </div>
    </section>
  )
}
