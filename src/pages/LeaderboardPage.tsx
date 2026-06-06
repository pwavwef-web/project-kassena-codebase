import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UnreadAnnouncementBadge } from '../components/common/UnreadAnnouncementBadge'
import { useAnnouncementNotifications } from '../hooks/useAnnouncementNotifications'
import { useAuth } from '../hooks/useAuth'
import {
  getBadgeTitleForPoints,
  getLeaderboardRank,
  subscribeToLeaderboard,
  subscribeToLeaderboardUser,
} from '../lib/firestore'
import type {
  LeaderboardPeriod,
  LeaderboardProfile,
  RankedLeaderboardProfile,
} from '../types'

type IconName =
  | 'arrowLeft'
  | 'bell'
  | 'check'
  | 'chevronRight'
  | 'shield'
  | 'star'
  | 'trophy'
  | 'users'

const periodOptions: Array<{
  id: LeaderboardPeriod
  label: string
  rankLabel: string
}> = [
  { id: 'week', label: 'This Week', rankLabel: 'this week' },
  { id: 'month', label: 'This Month', rankLabel: 'this month' },
  { id: 'allTime', label: 'All Time', rankLabel: 'all time' },
]

const badgeStyles: Record<string, string> = {
  'New Contributor': 'bg-[#fff8e7] text-[#7a4b10] ring-[#efd9a3]',
  'Language Helper': 'bg-[#fff0e7] text-[#9b3d19] ring-[#efc2a6]',
  'Community Builder': 'bg-[#edf6e9] text-[#14532d] ring-[#c7dec1]',
  'Kasem Champion': 'bg-[#fff5d6] text-[#765107] ring-[#ecc662]',
  'Elder Approved': 'bg-[#e9f4ef] text-[#0b4b2b] ring-[#98c7af]',
}

const topRankStyles: Record<number, string> = {
  1: 'from-[#f8d36a] to-[#d99a16] text-[#4a3100] ring-[#f4c85a]',
  2: 'from-[#f2f4f6] to-[#b9c1c8] text-[#334155] ring-[#cfd6dc]',
  3: 'from-[#efac72] to-[#b85a24] text-white ring-[#d7783a]',
}

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
    case 'arrowLeft':
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...common}>
          <path d="M15.5 17h4l-1.2-1.5a2.5 2.5 0 0 1-.5-1.5v-3a5.8 5.8 0 0 0-11.6 0v3a2.5 2.5 0 0 1-.5 1.5L4.5 17h4" />
          <path d="M9.7 19a2.7 2.7 0 0 0 4.6 0" />
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
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 5 6.2v5.5c0 4.4 2.8 7.4 7 9.3 4.2-1.9 7-4.9 7-9.3V6.2L12 3Z" />
          <path d="m9 12 2 2 4-5" />
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
          <path d="M10 15h4v4h-4z" />
        </svg>
      )
    case 'users':
      return (
        <svg {...common}>
          <path d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
          <path d="M4.5 19a7.5 7.5 0 0 1 15 0" />
          <path d="M17.5 9.5a2.7 2.7 0 0 1 2.8 2.7" />
          <path d="M3.7 12.2a2.7 2.7 0 0 1 2.8-2.7" />
        </svg>
      )
    case 'star':
    default:
      return (
        <svg {...common}>
          <path d="m12 3 2.5 5 5.5.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.5-.8L12 3Z" />
        </svg>
      )
  }
}

const formatNumber = (value: number): string => value.toLocaleString()

const initialsForName = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PK'

const getProfilePoints = (
  profile: LeaderboardProfile,
  period: LeaderboardPeriod,
): number => {
  if (period === 'week') return profile.weeklyPoints
  if (period === 'month') return profile.monthlyPoints
  return profile.totalPoints
}

const BadgePill = ({ title }: { title: string }) => (
  <span
    className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ${
      badgeStyles[title] ?? badgeStyles['New Contributor']
    }`}
  >
    <Icon name="shield" className="h-3.5 w-3.5 shrink-0" />
    <span className="truncate">{title}</span>
  </span>
)

const Avatar = ({
  name,
  photoURL,
  className = 'h-12 w-12 text-sm',
}: {
  name: string
  photoURL?: string
  className?: string
}) => {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={`${name} avatar`}
        className={`${className} shrink-0 rounded-full object-cover ring-2 ring-[#f2cf74]`}
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${name} avatar`}
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-[#0b4b2b] font-black text-white ring-2 ring-[#f2cf74]`}
    >
      {initialsForName(name)}
    </div>
  )
}

const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-2xl bg-[#eadfca] ${className}`} />
)

const LeaderboardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-48" />
    <Skeleton className="h-16" />
    <Skeleton className="h-72" />
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <Skeleton key={item} className="h-16" />
      ))}
    </div>
  </div>
)

const getRankInsight = ({
  activePoints,
  leaderboard,
  rank,
}: {
  activePoints: number
  leaderboard: RankedLeaderboardProfile[]
  rank: number | null
}) => {
  if (!leaderboard.length) {
    return {
      message: 'Start contributing to set the first milestone',
      progress: 0,
    }
  }

  if (activePoints <= 0) {
    return {
      message: 'Earn your first points to open the race',
      progress: 0,
    }
  }

  if (rank === 1) {
    return {
      message: 'You are leading this leaderboard',
      progress: 100,
    }
  }

  if (rank && rank <= 10) {
    const nextRank = leaderboard.find((entry) => entry.rank === rank - 1)
    const target = (nextRank?.activePoints ?? activePoints) + 1
    const needed = Math.max(0, target - activePoints)

    return {
      message: `${formatNumber(needed)} points to overtake #${rank - 1}`,
      progress: target > 0 ? Math.min(100, (activePoints / target) * 100) : 0,
    }
  }

  const topTen = leaderboard.find((entry) => entry.rank === 10)
  const target = (topTen?.activePoints ?? leaderboard[leaderboard.length - 1]?.activePoints ?? 0) + 1
  const needed = Math.max(0, target - activePoints)

  return {
    message: `${formatNumber(needed)} points to enter Top 10`,
    progress: target > 0 ? Math.min(100, (activePoints / target) * 100) : 0,
  }
}

const Header = ({
  currentUser,
}: {
  currentUser: LeaderboardProfile | null
}) => {
  const navigate = useNavigate()
  const { unreadCount } = useAnnouncementNotifications()

  return (
    <header className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-2 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:gap-3">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#edd7b6] bg-[#fffaf0] text-[#0b4b2b] shadow-[0_10px_24px_rgba(71,44,18,0.08)] transition hover:bg-white sm:h-12 sm:w-12"
        aria-label="Go back"
      >
        <Icon name="arrowLeft" className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="text-[31px] font-black leading-none text-[#073d24] min-[380px]:text-[34px] sm:text-[42px]">
          Leaderboard
        </h1>
        <p className="mt-1 text-[13px] font-semibold leading-tight text-slate-600 min-[380px]:text-sm sm:mt-2 sm:text-lg">
          Top contributors preserving Kasem
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Link
          to="/announcements"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#0b4b2b] sm:h-11 sm:w-11"
          aria-label="Notifications"
        >
          <Icon name="bell" className="h-6 w-6 sm:h-7 sm:w-7" />
          <UnreadAnnouncementBadge
            count={unreadCount}
            className="absolute -right-1 -top-1 ring-[#fffaf0]"
          />
        </Link>
        {currentUser ? (
          <Avatar
            name={currentUser.displayName}
            photoURL={currentUser.photoURL}
            className="h-11 w-11 text-xs sm:h-12 sm:w-12 sm:text-sm"
          />
        ) : (
          <div className="h-11 w-11 rounded-full bg-[#eadfca] sm:h-12 sm:w-12" />
        )}
      </div>
    </header>
  )
}

const CurrentRankCard = ({
  activePoints,
  currentUser,
  insight,
  isRankLoading,
  periodLabel,
  rank,
}: {
  activePoints: number
  currentUser: LeaderboardProfile
  insight: { message: string; progress: number }
  isRankLoading: boolean
  periodLabel: string
  rank: number | null
}) => (
  <section className="relative overflow-hidden rounded-[28px] bg-[#0b4b2b] p-4 text-white shadow-[0_18px_40px_rgba(10,58,34,0.22)] sm:p-7">
    <div className="absolute bottom-0 right-0 top-0 w-5 bg-[repeating-linear-gradient(135deg,#c96a2d_0_10px,#f1b52d_10px_20px,#14532d_20px_30px,#f5eddc_30px_40px)] opacity-90 sm:w-8" />
    <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(135deg,transparent_0_44%,rgba(255,255,255,0.18)_44%_48%,transparent_48%_100%),repeating-linear-gradient(45deg,rgba(255,255,255,0.08)_0_2px,transparent_2px_18px)]" />

    <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 pr-5 sm:grid-cols-[auto_1fr_auto] sm:gap-5 sm:pr-8">
      <div className="relative w-max">
        <Avatar
          name={currentUser.displayName}
          photoURL={currentUser.photoURL}
          className="h-[78px] w-[78px] text-base sm:h-28 sm:w-28 sm:text-xl"
        />
        <span className="absolute -bottom-1 -right-2 flex h-10 min-w-10 items-center justify-center rounded-full bg-[#0f6538] px-2 text-base font-black text-white ring-4 ring-[#f2cf74] sm:h-11 sm:min-w-11 sm:text-lg">
          {isRankLoading ? '...' : rank ? rank : '--'}
        </span>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-white/90 sm:text-base">
          {rank ? (
            <>
              You are <span className="text-[#f5c84b]">#{rank}</span>{' '}
              {periodLabel}
            </>
          ) : (
            'Your rank is updating'
          )}
        </p>
        <h2 className="mt-1 truncate text-[27px] font-black leading-tight sm:mt-2 sm:text-3xl">
          {currentUser.displayName}
        </h2>
        <div className="mt-2 max-w-full sm:mt-3">
          <BadgePill title={currentUser.badgeTitle} />
        </div>
      </div>

      <div className="col-span-2 grid grid-cols-2 gap-3 sm:col-span-1 sm:min-w-[190px] sm:grid-cols-1">
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 sm:bg-transparent sm:p-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2b83b] text-[#5b3b00] shadow-sm sm:h-11 sm:w-11">
            <Icon name="star" className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <div>
            <p className="text-[22px] font-black leading-none sm:text-2xl">
              {formatNumber(currentUser.totalPoints)}
            </p>
            <p className="mt-1 text-xs font-medium leading-tight text-white/85 sm:text-sm">
              Total
              <span className="hidden min-[380px]:inline"> Points</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 sm:bg-transparent sm:p-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d85b27] text-white shadow-sm sm:h-11 sm:w-11">
            <Icon name="check" className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <div>
            <p className="text-[22px] font-black leading-none sm:text-2xl">
              {formatNumber(currentUser.approvedEntries)}
            </p>
            <p className="mt-1 text-xs font-medium leading-tight text-white/85 sm:text-sm">
              Approved
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="relative mt-4 border-t border-white/20 pt-4 pr-5 sm:mt-6 sm:pr-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold leading-snug text-white sm:text-base">
          {insight.message}
        </p>
        <p className="text-xs font-semibold text-white/80 sm:text-sm">
          {formatNumber(activePoints)} period pts
        </p>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/20 sm:h-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#e16a32] to-[#f2bf3f] transition-all duration-700"
          style={{ width: `${insight.progress}%` }}
        />
      </div>
    </div>
  </section>
)

const PeriodTabs = ({
  selectedPeriod,
  onChange,
}: {
  selectedPeriod: LeaderboardPeriod
  onChange: (period: LeaderboardPeriod) => void
}) => (
  <div
    role="tablist"
    aria-label="Leaderboard time period"
    className="grid grid-cols-3 rounded-[22px] border border-[#ead7b7] bg-[#fffdf8] p-1 shadow-[0_12px_30px_rgba(71,44,18,0.08)]"
  >
    {periodOptions.map((option) => {
      const isSelected = selectedPeriod === option.id
      return (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={isSelected}
          onClick={() => onChange(option.id)}
          className={`min-h-12 rounded-[18px] px-2 text-sm font-black transition sm:text-base ${
            isSelected
              ? 'bg-[#d85b27] text-white shadow-[0_10px_20px_rgba(216,91,39,0.22)]'
              : 'text-[#0b4b2b] hover:bg-[#fff4e4]'
          }`}
        >
          {option.label}
        </button>
      )
    })}
  </div>
)

const PodiumPlace = ({
  entry,
  isCurrentUser,
}: {
  entry: RankedLeaderboardProfile
  isCurrentUser: boolean
}) => {
  const rankTone = topRankStyles[entry.rank] ?? topRankStyles[3]
  const barHeight =
    entry.rank === 1 ? 'h-28 sm:h-36' : entry.rank === 2 ? 'h-20 sm:h-28' : 'h-16 sm:h-24'

  return (
    <article
      className={`flex min-w-0 flex-col items-center justify-end rounded-[20px] px-2 pt-4 ${
        isCurrentUser ? 'ring-2 ring-[#14532d]' : ''
      }`}
    >
      <span
        className={`mb-2 flex h-9 min-w-9 items-center justify-center rounded-full bg-gradient-to-br ${rankTone} px-2 text-base font-black shadow-md ring-2`}
      >
        {entry.rank}
      </span>
      <Avatar
        name={entry.displayName}
        photoURL={entry.photoURL}
        className={`${
          entry.rank === 1 ? 'h-20 w-20 text-lg' : 'h-16 w-16 text-base'
        }`}
      />
      <h3 className="mt-3 w-full truncate text-center text-sm font-black text-[#13271d] sm:text-base">
        {entry.displayName}
      </h3>
      <div className="mt-2 max-w-full">
        <BadgePill title={entry.badgeTitle} />
      </div>
      <p className="mt-3 text-center text-lg font-black text-[#d85b27]">
        {formatNumber(entry.activePoints)}{' '}
        <span className="text-sm font-semibold text-slate-600">pts</span>
      </p>
      <div
        className={`mt-3 flex w-full max-w-[170px] items-center justify-center rounded-t-[18px] bg-gradient-to-b ${rankTone} ${barHeight} shadow-[inset_0_10px_24px_rgba(255,255,255,0.24)]`}
      >
        <Icon name="trophy" className="h-8 w-8 opacity-35" />
      </div>
    </article>
  )
}

const TopThreePodium = ({
  currentUid,
  entries,
}: {
  currentUid?: string
  entries: RankedLeaderboardProfile[]
}) => {
  const ordered = [entries[1], entries[0], entries[2]].filter(
    Boolean,
  ) as RankedLeaderboardProfile[]
  const gridClass =
    ordered.length === 1
      ? 'mx-auto max-w-[220px] grid-cols-1'
      : ordered.length === 2
        ? 'mx-auto max-w-[460px] grid-cols-2'
        : 'grid-cols-3'

  return (
    <section className="overflow-hidden rounded-[26px] border border-[#ead7b7] bg-[#fffdf8] shadow-[0_16px_40px_rgba(71,44,18,0.08)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#efdfc4] px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#557333]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dce9c9]">
            <span className="h-2 w-2 rounded-full bg-[#7fa451]" />
          </span>
          Live updates from community
        </div>
        <p className="text-sm font-semibold text-[#7a5737]">
          Top 50 contributors
        </p>
      </div>

      <div className="relative px-3 pt-5">
        <div className="absolute inset-x-0 bottom-0 h-16 bg-[repeating-linear-gradient(135deg,#0b4b2b_0_12px,#d85b27_12px_24px,#f2bf3f_24px_36px,#fff7e6_36px_48px)] opacity-80" />
        <div className={`relative grid items-end gap-1 sm:gap-4 ${gridClass}`}>
          {ordered.map((entry) => (
            <PodiumPlace
              key={entry.uid}
              entry={entry}
              isCurrentUser={entry.uid === currentUid}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const LeaderboardRow = ({
  entry,
  isCurrentUser,
}: {
  entry: RankedLeaderboardProfile
  isCurrentUser: boolean
}) => (
  <article
    className={`grid grid-cols-[48px_1fr_auto] items-center gap-3 border-b border-[#efdfc4] px-3 py-3 last:border-b-0 sm:grid-cols-[64px_minmax(0,1fr)_120px_110px_180px] sm:px-5 ${
      isCurrentUser ? 'rounded-[18px] border border-[#9eb985] bg-[#eff5e9] shadow-[0_12px_24px_rgba(20,83,45,0.1)]' : ''
    }`}
  >
    <span
      className={`flex h-10 min-w-10 items-center justify-center rounded-full text-sm font-black ${
        isCurrentUser ? 'bg-[#0b4b2b] text-white' : 'bg-[#fff4e4] text-[#0b4b2b]'
      }`}
    >
      {entry.rank}
    </span>

    <div className="flex min-w-0 items-center gap-3">
      <Avatar
        name={entry.displayName}
        photoURL={entry.photoURL}
        className="h-11 w-11 text-xs"
      />
      <div className="min-w-0">
        <h3 className="truncate text-base font-black text-[#13271d]">
          {entry.displayName}
        </h3>
        <p className="text-xs font-semibold text-slate-500 sm:hidden">
          {formatNumber(entry.approvedEntries)} approved
        </p>
      </div>
    </div>

    <p className="text-right text-base font-black text-[#0b4b2b]">
      {formatNumber(entry.activePoints)}
      <span className="ml-1 text-xs font-semibold text-slate-500">pts</span>
    </p>

    <p className="hidden text-center text-sm font-bold text-slate-700 sm:block">
      {formatNumber(entry.approvedEntries)}
    </p>
    <div className="hidden justify-end sm:flex">
      <BadgePill title={entry.badgeTitle} />
    </div>
  </article>
)

const PinnedRankCard = ({
  activePoints,
  currentUser,
  pointsToTopFifty,
  rank,
}: {
  activePoints: number
  currentUser: LeaderboardProfile
  pointsToTopFifty: number
  rank: number
}) => (
  <section className="overflow-hidden rounded-[26px] bg-[#0b4b2b] p-4 text-white shadow-[0_18px_40px_rgba(10,58,34,0.22)] sm:p-5">
    <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
      <div className="relative w-max">
        <Avatar
          name={currentUser.displayName}
          photoURL={currentUser.photoURL}
          className="h-20 w-20 text-lg"
        />
        <span className="absolute -bottom-1 -right-2 flex h-10 min-w-10 items-center justify-center rounded-full bg-[#0f6538] px-2 text-base font-black ring-2 ring-[#f2cf74]">
          {rank}
        </span>
      </div>

      <div>
        <p className="text-sm font-semibold text-white/80">Outside Top 50?</p>
        <h2 className="text-2xl font-black leading-tight">
          Your Rank:{' '}
          <span className="text-[#f2bf3f]">#{formatNumber(rank)}</span>
        </h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <span className="flex items-center gap-2 text-sm font-bold">
            <Icon name="star" className="h-5 w-5 text-[#f2bf3f]" />
            {formatNumber(activePoints)} period pts
          </span>
          <span className="flex items-center gap-2 text-sm font-bold">
            <Icon name="check" className="h-5 w-5 text-[#f08a4b]" />
            {formatNumber(currentUser.approvedEntries)} approved
          </span>
        </div>
      </div>

      <div className="rounded-[18px] border border-white/15 bg-white/10 p-4">
        <p className="text-base font-black">Keep contributing</p>
        <p className="mt-1 text-sm font-medium text-white/85">
          You are {formatNumber(pointsToTopFifty)} points away from entering Top
          50.
        </p>
      </div>
    </div>
  </section>
)

export const LeaderboardPage = () => {
  const { appUser } = useAuth()
  const [selectedPeriod, setSelectedPeriod] =
    useState<LeaderboardPeriod>('month')
  const [leaderboard, setLeaderboard] = useState<RankedLeaderboardProfile[]>([])
  const [currentProfile, setCurrentProfile] =
    useState<LeaderboardProfile | null>(null)
  const [currentRank, setCurrentRank] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRankLoading, setIsRankLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)
  const [leaderboardVersion, setLeaderboardVersion] = useState(0)

  const fallbackProfile = useMemo<LeaderboardProfile | null>(() => {
    if (!appUser) return null

    const totalPoints = appUser.totalPoints ?? 0

    return {
      uid: appUser.uid,
      displayName: appUser.displayName || 'Kasem Contributor',
      photoURL: appUser.photoURL || '',
      totalPoints,
      weeklyPoints: appUser.weeklyPoints ?? 0,
      monthlyPoints: appUser.monthlyPoints ?? 0,
      approvedEntries: appUser.approvedEntries ?? 0,
      badgeTitle:
        appUser.badgeTitle || getBadgeTitleForPoints(appUser.totalPoints ?? 0),
      lastContributionAt: null,
      createdAt: appUser.createdAt,
    }
  }, [appUser])

  const currentUser = currentProfile ?? fallbackProfile
  const selectedOption =
    periodOptions.find((option) => option.id === selectedPeriod) ??
    periodOptions[1]
  const activePoints = currentUser
    ? getProfilePoints(currentUser, selectedPeriod)
    : 0
  const currentEntry = currentUser
    ? leaderboard.find((entry) => entry.uid === currentUser.uid)
    : undefined
  const isCurrentUserInTopFifty = Boolean(currentEntry)
  const topThree = leaderboard.slice(0, 3)
  const listEntries = leaderboard.slice(3)
  const insight = getRankInsight({
    activePoints,
    leaderboard,
    rank: currentRank,
  })
  const topFiftyTarget =
    leaderboard.length >= 50
      ? (leaderboard[49]?.activePoints ?? 0) + 1
      : leaderboard.length
        ? (leaderboard[leaderboard.length - 1]?.activePoints ?? 0) + 1
        : 0
  const pointsToTopFifty = Math.max(0, topFiftyTarget - activePoints)

  useEffect(() => {
    setIsLoading(true)
    setErrorMessage(null)

    const unsubscribe = subscribeToLeaderboard(
      selectedPeriod,
      (profiles) => {
        setLeaderboard(profiles)
        setLeaderboardVersion((version) => version + 1)
        setIsLoading(false)
      },
      (error) => {
        console.error('Leaderboard listener failed:', error)
        setErrorMessage('Unable to load leaderboard. Please try again.')
        setIsLoading(false)
      },
    )

    return unsubscribe
  }, [retryKey, selectedPeriod])

  useEffect(() => {
    if (!appUser?.uid) {
      return () => undefined
    }

    const unsubscribe = subscribeToLeaderboardUser(
      appUser.uid,
      setCurrentProfile,
      (error) => {
        console.error('Current leaderboard user listener failed:', error)
      },
    )

    return unsubscribe
  }, [appUser?.uid])

  useEffect(() => {
    let active = true

    if (!currentUser) {
      setCurrentRank(null)
      setIsRankLoading(false)
      return () => {
        active = false
      }
    }

    if (currentEntry) {
      setCurrentRank(currentEntry.rank)
      setIsRankLoading(false)
      return () => {
        active = false
      }
    }

    setIsRankLoading(true)

    getLeaderboardRank(selectedPeriod, activePoints)
      .then((rank) => {
        if (active) {
          setCurrentRank(rank)
        }
      })
      .catch((error) => {
        console.error('Leaderboard rank count failed:', error)
        if (active) {
          setCurrentRank(null)
        }
      })
      .finally(() => {
        if (active) {
          setIsRankLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [
    activePoints,
    currentEntry,
    currentUser,
    leaderboardVersion,
    selectedPeriod,
  ])

  return (
    <section className="mx-auto min-h-screen max-w-[980px] space-y-4 bg-[#fffaf0] pb-28 text-[#13271d] sm:space-y-6 md:rounded-[32px] md:px-2 md:py-2">
      <Header currentUser={currentUser} />

      {isLoading ? (
        <LeaderboardSkeleton />
      ) : errorMessage ? (
        <section className="rounded-[24px] border border-[#efc2a6] bg-[#fff7ef] p-6 text-center shadow-[0_16px_40px_rgba(71,44,18,0.08)]">
          <Icon
            name="trophy"
            className="mx-auto h-10 w-10 text-[#d85b27]"
          />
          <p className="mt-3 text-lg font-black text-[#0b4b2b]">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={() => setRetryKey((key) => key + 1)}
            className="mt-5 rounded-full bg-[#0b4b2b] px-5 py-3 text-sm font-black text-white shadow-[0_12px_24px_rgba(11,75,43,0.18)]"
          >
            Try again
          </button>
        </section>
      ) : currentUser ? (
        <>
          <CurrentRankCard
            activePoints={activePoints}
            currentUser={currentUser}
            insight={insight}
            isRankLoading={isRankLoading}
            periodLabel={selectedOption.rankLabel}
            rank={currentRank}
          />

          <PeriodTabs
            selectedPeriod={selectedPeriod}
            onChange={setSelectedPeriod}
          />

          {leaderboard.length ? (
            <>
              <TopThreePodium
                currentUid={currentUser.uid}
                entries={topThree}
              />

              <section className="overflow-hidden rounded-[26px] border border-[#ead7b7] bg-[#fffdf8] shadow-[0_16px_40px_rgba(71,44,18,0.08)]">
                <div className="hidden grid-cols-[64px_minmax(0,1fr)_120px_110px_180px] px-5 py-3 text-xs font-black uppercase text-slate-500 sm:grid">
                  <span>Rank</span>
                  <span>Contributor</span>
                  <span className="text-right">Points</span>
                  <span className="text-center">Approved</span>
                  <span className="text-right">Badge</span>
                </div>

                {listEntries.length ? (
                  listEntries.map((entry) => (
                    <LeaderboardRow
                      key={entry.uid}
                      entry={entry}
                      isCurrentUser={entry.uid === currentUser.uid}
                    />
                  ))
                ) : (
                  <div className="p-6 text-center text-sm font-semibold text-slate-600">
                    The podium is the full leaderboard for now.
                  </div>
                )}
              </section>

              {currentRank && !isCurrentUserInTopFifty ? (
                <PinnedRankCard
                  activePoints={activePoints}
                  currentUser={currentUser}
                  pointsToTopFifty={pointsToTopFifty}
                  rank={currentRank}
                />
              ) : null}
            </>
          ) : (
            <section className="rounded-[24px] border border-dashed border-[#d85b27] bg-[#fff7e6] p-8 text-center shadow-[0_16px_40px_rgba(71,44,18,0.08)]">
              <Icon
                name="users"
                className="mx-auto h-11 w-11 text-[#0b4b2b]"
              />
              <p className="mt-4 text-lg font-black text-[#0b4b2b]">
                No contributors yet. Be the first to preserve Kasem today.
              </p>
            </section>
          )}
        </>
      ) : null}
    </section>
  )
}
