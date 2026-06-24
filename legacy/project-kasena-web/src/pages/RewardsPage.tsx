import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AchievementBadgeCard } from '../components/common/AchievementBadge'
import { AppIcon } from '../components/common/AppIcon'
import { LoadingState } from '../components/common/LoadingState'
import { RankBadge, TrustScoreMeter } from '../components/common/RankBadge'
import { UnreadAnnouncementBadge } from '../components/common/UnreadAnnouncementBadge'
import { useAnnouncementNotifications } from '../hooks/useAnnouncementNotifications'
import { useAuth } from '../hooks/useAuth'
import {
  ACHIEVEMENT_PROGRESS_EVENT,
  getAchievementStates,
  readAchievementProgress,
} from '../lib/achievements'
import {
  getLeaderboardRank,
  listRewardBounties,
  listRewardCatalogItems,
  listUserContributions,
  listUserUploads,
  subscribeToLeaderboard,
  subscribeToLeaderboardUser,
} from '../lib/firestore'
import { getRankMetricsFromActivity, getRankState } from '../lib/ranks'
import type {
  Contribution,
  LeaderboardProfile,
  RankedLeaderboardProfile,
  RewardBounty,
  RewardCatalogItem,
  UploadRecord,
} from '../types'

type IconName =
  | 'airtime'
  | 'badge'
  | 'bell'
  | 'book'
  | 'calendar'
  | 'check'
  | 'community'
  | 'data'
  | 'gift'
  | 'leaf'
  | 'medical'
  | 'merch'
  | 'proverb'
  | 'reward'
  | 'shield'
  | 'sentence'
  | 'star'
  | 'upload'

interface ImpactItem {
  label: string
  value: number
  icon: IconName
  tone: string
}

interface ActivityItem {
  id: string
  points: number
  title: string
  detail: string
  timeLabel: string
  icon: IconName
}

const knownIcons: IconName[] = [
  'airtime',
  'badge',
  'bell',
  'book',
  'calendar',
  'check',
  'community',
  'data',
  'gift',
  'leaf',
  'medical',
  'merch',
  'proverb',
  'reward',
  'shield',
  'sentence',
  'star',
  'upload',
]

const rewardToneClasses = [
  'from-[#fff4d8] to-[#fdf8ed] text-kassena-green ring-[#efd28a]',
  'from-[#edf7ed] to-[#f9fcf5] text-kassena-green ring-[#c9dfc7]',
  'from-[#fff0e7] to-[#fff8f1] text-kassena-orange ring-[#efb28f]',
  'from-[#f6edf8] to-[#fffbf8] text-[#69407d] ring-[#dfc6e9]',
]

const normalizeIcon = (icon: string, fallback: IconName): IconName =>
  knownIcons.includes(icon as IconName) ? (icon as IconName) : fallback

const Icon = ({
  name,
  className = 'h-5 w-5',
}: {
  name: IconName
  className?: string
}) => {
  if (name) {
    return <AppIcon name={name} className={className} />
  }

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
    case 'airtime':
      return (
        <svg {...common}>
          <path d="M8 2.8h8a2 2 0 0 1 2 2v14.4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4.8a2 2 0 0 1 2-2Z" />
          <path d="M10 6h4" />
          <path d="M11 18h2" />
          <path d="m12 9 1.1 2.1 2.4.3-1.8 1.7.5 2.4-2.2-1.1-2.2 1.1.5-2.4-1.8-1.7 2.4-.3L12 9Z" />
        </svg>
      )
    case 'badge':
      return (
        <svg {...common}>
          <path d="M12 3 5 6.4v5.2c0 4.2 2.8 7.3 7 9.4 4.2-2.1 7-5.2 7-9.4V6.4L12 3Z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...common}>
          <path d="M15.5 17h4l-1.2-1.5a2.5 2.5 0 0 1-.5-1.5v-3a5.8 5.8 0 0 0-11.6 0v3a2.5 2.5 0 0 1-.5 1.5L4.5 17h4" />
          <path d="M9.7 19a2.7 2.7 0 0 0 4.6 0" />
        </svg>
      )
    case 'book':
      return (
        <svg {...common}>
          <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5v-17Z" />
          <path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H20" />
          <path d="M9 6h7" />
          <path d="M9 9h5" />
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
    case 'check':
      return (
        <svg {...common}>
          <path d="m6 12 4 4 8-8" />
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
    case 'data':
      return (
        <svg {...common}>
          <path d="M5 18V14" />
          <path d="M9.7 18V10" />
          <path d="M14.3 18V7" />
          <path d="M19 18V4" />
          <path d="M7.5 7.8a7.8 7.8 0 0 1 9 0" />
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
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M5 19c8 0 13-5.5 14-14-8.5 1-14 6-14 14Z" />
          <path d="M5 19c2.5-4.5 6-7.5 10.5-9" />
        </svg>
      )
    case 'medical':
      return (
        <svg {...common}>
          <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z" />
        </svg>
      )
    case 'merch':
      return (
        <svg {...common}>
          <path d="M7 4h3a2 2 0 0 0 4 0h3l3 4-3 2v10H7V10L4 8l3-4Z" />
          <path d="M10 8h4" />
        </svg>
      )
    case 'proverb':
      return (
        <svg {...common}>
          <path d="M6 7h.01" />
          <path d="M11 7h.01" />
          <path d="M16 7h.01" />
          <path d="M5 4h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-5l-4 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 5 6.2v5.5c0 4.4 2.8 7.4 7 9.3 4.2-1.9 7-4.9 7-9.3V6.2L12 3Z" />
          <path d="M12 8v6" />
          <path d="M9.5 11.2h5" />
        </svg>
      )
    case 'sentence':
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M4 11h13" />
          <path d="M4 16h9" />
          <path d="M17 16h3" />
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
    case 'star':
    default:
      return (
        <svg {...common}>
          <path d="m12 3 2.5 5 5.5.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.5-.8L12 3Z" />
        </svg>
      )
  }
}

const pointsForContribution = (contribution: Contribution) => {
  const hasExamples = Boolean(
    contribution.englishExample || contribution.kasemExample,
  )

  return 50 + (hasExamples ? 10 : 0)
}

const pointsForUpload = () => 100

const getMillis = (value: { toMillis?: () => number } | null | undefined) =>
  value?.toMillis?.() ?? 0

const getActivityTime = (millis: number) => {
  if (!millis) {
    return 'Recently'
  }

  const diff = Date.now() - millis
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < hour) {
    return `${Math.max(1, Math.round(diff / minute))}m ago`
  }

  if (diff < day) {
    return `${Math.round(diff / hour)}h ago`
  }

  return `${Math.round(diff / day)}d ago`
}

const SectionHeader = ({
  title,
  action,
  actionTo,
}: {
  title: string
  action?: string
  actionTo?: string
}) => (
  <div className="mb-2.5 flex items-center justify-between gap-3 sm:mb-3">
    <h2 className="min-w-0 text-base font-black text-[#073d24] sm:text-lg">
      {title}
    </h2>
    {action ? (
      <Link
        to={actionTo ?? '#'}
        onClick={(event) => {
          if (!actionTo) {
            event.preventDefault()
          }
        }}
        className="shrink-0 text-xs font-bold text-[#cf4f23]"
      >
        {action} &gt;
      </Link>
    ) : null}
  </div>
)

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
    className={`rounded-[18px] border border-[#ead9bd] bg-[#fffdf8]/95 p-3 shadow-[0_12px_28px_rgba(71,44,18,0.08)] sm:rounded-[22px] sm:p-4 ${className}`}
  >
    {children}
  </section>
)

const ScrollRow = ({ children }: { children: ReactNode }) => (
  <div className="-mx-3 overflow-x-auto px-3 pb-1 scrollbar-hide sm:-mx-4 sm:px-4">
    <div className="flex min-w-max snap-x gap-3">{children}</div>
  </div>
)

const EmptyMessage = ({ message }: { message: string }) => (
  <div className="rounded-[16px] border border-dashed border-[#e3cfad] bg-[#fff8ed] px-3 py-4 text-center text-xs font-semibold leading-5 text-slate-500 sm:rounded-[18px] sm:px-4 sm:py-5 sm:text-sm">
    {message}
  </div>
)

const Coin = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <span
    className={`inline-flex items-center justify-center ${className}`}
  >
    <Icon name="star" className="h-full w-full" />
  </span>
)

const Emblem = () => (
  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0b4b2b] shadow-[inset_0_0_0_3px_rgba(251,214,120,0.35),0_10px_20px_rgba(20,83,45,0.16)] ring-[3px] ring-[#f9d77c] sm:h-20 sm:w-20 sm:ring-4">
    <div className="absolute inset-[-6px] rounded-full border border-dashed border-[#e9b943] sm:inset-[-7px]" />
    <Icon name="reward" className="relative z-10 h-full w-full" />
  </div>
)

export const RewardsPage = () => {
  const { appUser } = useAuth()
  const { unreadCount } = useAnnouncementNotifications()
  const navigate = useNavigate()
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [uploads, setUploads] = useState<UploadRecord[]>([])
  const [rewardItems, setRewardItems] = useState<RewardCatalogItem[]>([])
  const [bounties, setBounties] = useState<RewardBounty[]>([])
  const [leaderboard, setLeaderboard] = useState<RankedLeaderboardProfile[]>([])
  const [leaderboardUser, setLeaderboardUser] =
    useState<LeaderboardProfile | null>(null)
  const [userRank, setUserRank] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dataError, setDataError] = useState('')
  const [, setClientProgressVersion] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => undefined
    }

    const handleProgressUpdate = () =>
      setClientProgressVersion((version) => version + 1)

    window.addEventListener(ACHIEVEMENT_PROGRESS_EVENT, handleProgressUpdate)

    return () => {
      window.removeEventListener(
        ACHIEVEMENT_PROGRESS_EVENT,
        handleProgressUpdate,
      )
    }
  }, [])

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      if (!appUser) {
        return
      }

      const [userContributions, userUploads, catalogItems, activeBounties] =
        await Promise.all([
          listUserContributions(appUser.uid),
          listUserUploads(appUser.uid),
          listRewardCatalogItems(),
          listRewardBounties(),
        ])

      if (active) {
        setContributions(userContributions)
        setUploads(userUploads)
        setRewardItems(catalogItems)
        setBounties(activeBounties)
        setIsLoading(false)
      }
    }

    hydrate().catch(() => {
      if (active) {
        setDataError('Rewards data could not be loaded from Firebase.')
        setIsLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [appUser])

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
      () => setDataError('Your points profile could not be loaded from Firebase.'),
    )

    return () => {
      unsubscribeLeaderboard()
      unsubscribeUser()
    }
  }, [appUser])

  const calculatedStats = useMemo(() => {
    const approvedContributions = contributions.filter(
      (item) => item.status === 'approved',
    )
    const approvedUploads = uploads.filter((item) => item.status === 'approved')
    const sentencesAdded = approvedContributions.filter(
      (item) =>
        item.category.toLowerCase().includes('sentence') ||
        Boolean(item.englishExample || item.kasemExample),
    ).length
    const proverbsAdded = approvedContributions.filter((item) =>
      item.category.toLowerCase().includes('proverb'),
    ).length
    const wordsAdded = Math.max(
      0,
      approvedContributions.length - sentencesAdded - proverbsAdded,
    )
    const points =
      approvedContributions.reduce(
        (total, contribution) => total + pointsForContribution(contribution),
        0,
      ) + approvedUploads.reduce((total) => total + pointsForUpload(), 0)

    return {
      approvedEntries: approvedContributions.length + approvedUploads.length,
      approvedContributions: approvedContributions.length,
      points,
      proverbsAdded,
      sentencesAdded,
      uploads: uploads.length,
      wordsAdded,
    }
  }, [contributions, uploads])

  const currentPoints =
    leaderboardUser?.totalPoints ??
    appUser?.totalPoints ??
    calculatedStats.points
  const approvedEntries =
    leaderboardUser?.approvedEntries ??
    appUser?.approvedEntries ??
    calculatedStats.approvedEntries
  const rankMetrics = useMemo(
    () =>
      getRankMetricsFromActivity({
        contributions,
        points: currentPoints,
        uploads,
        user: appUser,
      }),
    [appUser, contributions, currentPoints, uploads],
  )
  const rankState = useMemo(() => getRankState(rankMetrics), [rankMetrics])
  const nextRewardCost = rewardItems
    .map((item) => item.cost)
    .filter((cost) => cost > currentPoints)
    .sort((first, second) => first - second)[0]
  const pointsRemaining = nextRewardCost
    ? Math.max(0, nextRewardCost - currentPoints)
    : 0
  const rewardProgress = nextRewardCost
    ? Math.min(100, (currentPoints / nextRewardCost) * 100)
    : 100
  const initials =
    appUser?.displayName
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'PK'

  useEffect(() => {
    let active = true

    if (!appUser) {
      return () => {
        active = false
      }
    }

    getLeaderboardRank('allTime', currentPoints)
      .then((rank) => {
        if (active) {
          setUserRank(rank)
        }
      })
      .catch(() => {
        if (active) {
          setUserRank(null)
        }
      })

    return () => {
      active = false
    }
  }, [appUser, currentPoints])

  const impact: ImpactItem[] = [
    {
      label: 'Approved Entries',
      value: approvedEntries,
      icon: 'check',
      tone: 'bg-[#edf7ed] text-kassena-green ring-[#c9dfc7]',
    },
    {
      label: 'Words Added',
      value: calculatedStats.wordsAdded,
      icon: 'book',
      tone: 'bg-[#fff5df] text-[#9a6b08] ring-[#f0d49a]',
    },
    {
      label: 'Sentences Added',
      value: calculatedStats.sentencesAdded,
      icon: 'sentence',
      tone: 'bg-[#fff0e7] text-kassena-orange ring-[#f0c2aa]',
    },
    {
      label: 'Proverbs Added',
      value: calculatedStats.proverbsAdded,
      icon: 'proverb',
      tone: 'bg-[#f4ecfb] text-[#6b4584] ring-[#ddcaea]',
    },
  ]

  const activityItems = useMemo<ActivityItem[]>(() => {
    const contributionActivity = contributions
      .filter((item) => item.status === 'approved')
      .map((item) => {
        const millis =
          getMillis(item.reviewedAt) ||
          getMillis(item.updatedAt) ||
          getMillis(item.createdAt)

        return {
          id: `contribution-${item.id}`,
          points: pointsForContribution(item),
          title: 'Translation Approved',
          detail: item.englishText || item.category || 'Dictionary entry',
          timeLabel: getActivityTime(millis),
          icon: 'check' as IconName,
          sortTime: millis,
        }
      })
    const uploadActivity = uploads
      .filter((item) => item.status === 'approved')
      .map((item) => {
        const millis =
          getMillis(item.reviewedAt) ||
          getMillis(item.updatedAt) ||
          getMillis(item.createdAt)

        return {
          id: `upload-${item.id}`,
          points: pointsForUpload(),
          title: 'Archive Upload Approved',
          detail: item.title || item.category || 'Language material',
          timeLabel: getActivityTime(millis),
          icon: 'upload' as IconName,
          sortTime: millis,
        }
      })

    return [...contributionActivity, ...uploadActivity]
      .sort((first, second) => second.sortTime - first.sortTime)
      .slice(0, 4)
  }, [contributions, uploads])

  const clientProgress = readAchievementProgress(appUser?.uid)
  const achievementStates = useMemo(
    () =>
      getAchievementStates({
        clientProgress,
        contributions,
        currentRank: userRank,
        uploads,
        user: appUser,
      }),
    [appUser, clientProgress, contributions, uploads, userRank],
  )

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/dashboard')
  }

  if (!appUser || isLoading) {
    return <LoadingState message="Loading rewards..." />
  }

  return (
    <section className="relative mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-[#fff8ea] pb-32 text-[#143829] shadow-[0_24px_70px_rgba(55,35,15,0.12)] md:max-w-6xl md:rounded-[32px] md:pb-10">
      <div className="relative rounded-b-[24px] bg-[#0b4b2b] px-3 pb-14 pt-4 text-white shadow-[0_18px_40px_rgba(10,58,34,0.22)] sm:px-6 sm:pb-20 sm:pt-7 sm:rounded-b-[28px]">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,transparent_0_42%,rgba(255,255,255,0.16)_42%_46%,transparent_46%_100%),repeating-linear-gradient(45deg,rgba(255,255,255,0.08)_0_2px,transparent_2px_18px)]" />
        <div className="relative flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="hidden items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 md:inline-flex"
          >
            <span aria-hidden="true">&lt;</span>
            Back
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {appUser.photoURL ? (
              <img
                src={appUser.photoURL}
                alt=""
                className="h-12 w-12 shrink-0 rounded-full object-cover ring-[3px] ring-[#f1bf55] sm:h-[68px] sm:w-[68px]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f7d681] text-sm font-black text-[#0b4b2b] ring-[3px] ring-[#f1bf55] sm:h-[68px] sm:w-[68px] sm:text-base">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl font-black leading-none tracking-normal sm:text-[40px]">
                Rewards
              </h1>
              <p className="mt-1 truncate text-xs font-semibold text-white/88 sm:text-base">
                Thank you for preserving Kasem
              </p>
            </div>
          </div>
          <Link
            to="/announcements"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white sm:h-11 sm:w-11"
            aria-label="Notifications"
          >
            <Icon name="bell" className="h-10 w-10 sm:h-11 sm:w-11" />
            <UnreadAnnouncementBadge
              count={unreadCount}
              className="absolute -right-1 -top-1 ring-[#0b4b2b]"
            />
          </Link>
        </div>
      </div>

      <div className="-mt-10 space-y-3 px-3 sm:-mt-14 sm:space-y-4 sm:px-4 md:px-7">
        {dataError ? (
          <div className="relative z-20 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {dataError}
          </div>
        ) : null}

        <Panel className="relative z-10">
          <div className="grid grid-cols-[62px_minmax(0,1fr)] gap-3 sm:grid-cols-[82px_minmax(0,1fr)] lg:grid-cols-[110px_1fr_230px] lg:items-center">
            <div className="pt-1 sm:pt-2">
              <Emblem />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#0b4b2b] sm:text-xs sm:tracking-[0.13em]">
                Your contribution points
              </p>
              <div className="mt-1 flex min-w-0 items-end gap-1">
                <span className="min-w-0 truncate text-[36px] font-black leading-none text-[#0b4b2b] sm:text-[58px]">
                  {currentPoints.toLocaleString()}
                </span>
                <span className="pb-1 text-sm font-black text-[#0b4b2b] sm:text-base">
                  pts
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 sm:mt-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#eadcc4] sm:h-2.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2d9749] to-[#0b4b2b]"
                    style={{ width: `${rewardProgress}%` }}
                  />
                </div>
                <Coin className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <p className="mt-1.5 text-xs font-semibold text-slate-600 sm:mt-2 sm:text-sm">
                {nextRewardCost ? (
                  <>
                    <span className="font-black text-[#cf4f23]">
                      {pointsRemaining.toLocaleString()}
                    </span>{' '}
                    pts to next reward
                  </>
                ) : (
                  'No next reward tier configured'
                )}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <RankBadge state={rankState} compact />
                <span className="rounded-full bg-[#edf6e9] px-3 py-1 text-xs font-black text-[#14532d]">
                  Trust {rankState.trustScore}%
                </span>
              </div>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-2 lg:col-span-1 lg:grid-cols-1">
              <a
                href="#marketplace"
                className="flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#d45d28] to-[#cf4f23] px-3 py-2.5 text-xs font-black text-white shadow-[0_10px_18px_rgba(207,79,35,0.22)] sm:rounded-[16px] sm:py-3 sm:text-sm"
              >
                <Icon name="gift" className="h-5 w-5" />
                Redeem
              </a>
              <a
                href="#activity"
                className="flex min-h-11 items-center justify-center gap-2 rounded-[14px] border border-[#e6cda7] bg-white px-3 py-2.5 text-xs font-black text-[#0b4b2b] sm:rounded-[16px] sm:py-3 sm:text-sm"
              >
                <Icon name="calendar" className="h-5 w-5" />
                History
              </a>
            </div>
          </div>
        </Panel>

        <Panel id="marketplace">
          <SectionHeader title="Rewards Marketplace" />
          {rewardItems.length ? (
            <ScrollRow>
              {rewardItems.map((reward, index) => (
                <article
                  key={reward.id}
                  className={`w-[136px] shrink-0 snap-start rounded-[18px] border bg-gradient-to-b ${
                    rewardToneClasses[index % rewardToneClasses.length]
                  } p-3 text-center shadow-sm sm:w-[156px]`}
                >
                  <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center sm:h-[82px] sm:w-[82px]">
                    <Icon
                      name={normalizeIcon(reward.icon, 'gift')}
                      className="h-full w-full"
                    />
                  </div>
                  <h3 className="mt-3 text-base font-black leading-5 text-[#101f1a]">
                    {reward.title}
                  </h3>
                  <p className="mt-1 min-h-8 text-xs font-medium leading-4 text-[#101f1a]">
                    {reward.subtitle}
                  </p>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-black text-[#24352e]">
                    <Coin className="h-4 w-4" />
                    {reward.cost.toLocaleString()} pts
                  </p>
                  <button
                    type="button"
                    className="mt-3 w-full rounded-xl bg-[#0b4b2b] py-2.5 text-sm font-black text-white shadow-[0_8px_18px_rgba(11,75,43,0.2)]"
                  >
                    Redeem
                  </button>
                </article>
              ))}
            </ScrollRow>
          ) : (
            <EmptyMessage message="No rewards have been configured in Firebase yet." />
          )}
        </Panel>

        <Panel>
          <SectionHeader title="Achievements" action="View all" actionTo="/achievements" />
          {achievementStates.length ? (
            <ScrollRow>
              {achievementStates.map((state) => (
                <AchievementBadgeCard
                  key={state.id}
                  className="w-[138px] shrink-0 snap-start"
                  compact
                  state={state}
                />
              ))}
            </ScrollRow>
          ) : (
            <EmptyMessage message="Achievement badges are being prepared." />
          )}
        </Panel>

        <Panel className="relative overflow-hidden">
          <div className="absolute bottom-0 left-0 top-0 w-4 bg-[repeating-linear-gradient(135deg,#d35f2f_0_9px,#efb63b_9px_18px,#0b4b2b_18px_27px)] sm:w-6 sm:bg-[repeating-linear-gradient(135deg,#d35f2f_0_10px,#efb63b_10px_20px,#0b4b2b_20px_30px)]" />
          <div className="pl-4 sm:pl-5">
            <SectionHeader title="Your Impact" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {impact.map((item) => (
                <article
                  key={item.label}
                  className={`flex min-h-[76px] items-center gap-2.5 rounded-[14px] p-3 ring-1 sm:rounded-[16px] ${item.tone}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/65 sm:h-10 sm:w-10">
                    <Icon name={item.icon} className="h-full w-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black leading-tight text-[#101f1a] sm:text-xl">
                      {item.value}
                    </p>
                    <p className="text-[11px] font-semibold leading-4 text-[#101f1a] sm:text-xs">
                      {item.label}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionHeader title="Active Bounties" />
          {bounties.length ? (
            <ScrollRow>
              {bounties.map((bounty) => {
                const target = Math.max(bounty.targetContributions, 1)
                const progress = Math.min(
                  100,
                  (bounty.currentContributions / target) * 100,
                )

                return (
                  <article
                    key={bounty.id}
                    className="grid w-[330px] max-w-[calc(100vw-2rem)] shrink-0 snap-start grid-cols-[82px_minmax(0,1fr)] overflow-hidden rounded-[20px] border border-[#e5cda8] bg-[#fffdf8] shadow-sm sm:w-[420px]"
                  >
                    <div className="flex items-center justify-center bg-[#0b4b2b] p-3 text-[#f6cd62]">
                      <div className="flex h-14 w-14 items-center justify-center rounded-[16px] border border-[#f6cd62]">
                        <Icon
                          name={normalizeIcon(bounty.icon, 'medical')}
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                    <div className="min-w-0 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-black text-[#0b4b2b]">
                            {bounty.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs leading-4 text-slate-600">
                            {bounty.description}
                          </p>
                        </div>
                        {bounty.deadlineLabel ? (
                          <span className="shrink-0 rounded-full bg-[#5d9137] px-2 py-1 text-[10px] font-black text-white">
                            {bounty.deadlineLabel}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-xs font-black text-[#0b4b2b]">
                        +{bounty.pointsPerContribution} pts per approval
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#ebddc6]">
                        <div
                          className="h-full rounded-full bg-[#2d9749]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-[11px] font-medium text-slate-600">
                          {bounty.currentContributions} / {target}
                        </p>
                        <p className="truncate text-right text-[11px] font-bold text-[#101f1a]">
                          {bounty.sponsorName}
                        </p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </ScrollRow>
          ) : (
            <EmptyMessage message="No active reward bounties have been configured in Firebase yet." />
          )}
        </Panel>

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
          <Panel>
            <SectionHeader title="Leaderboard" />
            {leaderboard.length ? (
              <div className="space-y-2.5 sm:space-y-3">
                {leaderboard.slice(0, 3).map((entry) => (
                  <div
                    key={entry.uid}
                    className="grid grid-cols-[26px_34px_minmax(0,1fr)_auto] items-center gap-2 sm:grid-cols-[28px_36px_minmax(0,1fr)_auto]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f2b31b] text-[11px] font-black text-white shadow-sm sm:h-7 sm:w-7 sm:text-xs">
                      {entry.rank}
                    </span>
                    {entry.photoURL ? (
                      <img
                        src={entry.photoURL}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-[#f2cf74] sm:h-9 sm:w-9"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b4b2b] text-[10px] font-black text-white ring-2 ring-[#f2cf74] sm:h-9 sm:w-9">
                        {entry.displayName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <p className="truncate text-xs font-black text-[#143829] sm:text-sm">
                      {entry.displayName}
                    </p>
                    <p className="text-xs font-black text-[#101f1a]">
                      {entry.activePoints.toLocaleString()} pts
                    </p>
                  </div>
                ))}
                <div className="grid grid-cols-[34px_34px_minmax(0,1fr)_auto] items-center gap-2 rounded-[14px] bg-[#eff3df] px-3 py-2 sm:grid-cols-[36px_36px_minmax(0,1fr)_auto]">
                  <span className="flex h-7 items-center justify-center rounded-full bg-[#0b4b2b] px-2 text-xs font-black text-white">
                    {userRank ?? '-'}
                  </span>
                  {appUser.photoURL ? (
                    <img
                      src={appUser.photoURL}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-white sm:h-9 sm:w-9"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1c870] text-[10px] font-black text-[#0b4b2b] ring-2 ring-white sm:h-9 sm:w-9">
                      {initials}
                    </div>
                  )}
                  <p className="truncate text-xs font-black text-[#143829] sm:text-sm">
                    You
                  </p>
                  <p className="text-xs font-black text-[#101f1a]">
                    {currentPoints.toLocaleString()} pts
                  </p>
                </div>
                <div className="rounded-[16px] border border-[#efd9b0] bg-[#fff4dd] p-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-[#143829]">
                      Next Rank
                    </span>
                    <span className="font-medium text-slate-500">
                      {rankState.nextCoreRank
                        ? rankState.requirements.every(
                            (requirement) => requirement.met,
                          )
                          ? `${rankState.pointsToNextRank.toLocaleString()} pts to ${rankState.nextCoreRank.title}`
                          : `Requirements pending for ${rankState.nextCoreRank.title}`
                        : 'Top core rank reached'}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e6d6b8]">
                    <div
                      className="h-full rounded-full bg-[#2d9749]"
                      style={{ width: `${rankState.progressToNextRank}%` }}
                    />
                  </div>
                  <TrustScoreMeter
                    value={rankState.trustScore}
                    className="mt-3 rounded-[14px] bg-white/70 p-3"
                  />
                </div>
              </div>
            ) : (
              <EmptyMessage message="No leaderboard profiles are available in Firebase yet." />
            )}
          </Panel>

          <Panel id="activity">
            <SectionHeader title="Recent Activity" />
            {activityItems.length ? (
              <div className="space-y-2.5 sm:space-y-3">
                {activityItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[32px_minmax(0,1fr)_auto] gap-2 sm:grid-cols-[34px_minmax(0,1fr)_auto]"
                  >
                    <div className="relative flex justify-center">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-white sm:h-9 sm:w-9 ${
                          index === 0
                            ? 'bg-[#2d9749]'
                            : index === 1
                              ? 'bg-[#d45d28]'
                              : index === 2
                                ? 'bg-[#d99418]'
                            : 'bg-[#8660a1]'
                        }`}
                      >
                        <Icon name={item.icon} className="h-full w-full" />
                      </span>
                      {index < activityItems.length - 1 ? (
                        <span className="absolute top-8 h-6 border-l border-dashed border-[#b79f7b] sm:top-9" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black text-[#0b4b2b] sm:text-sm">
                        +{item.points} pts
                      </p>
                      <p className="truncate text-xs font-semibold text-slate-600">
                        {item.title}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                    <p className="pt-1 text-[10px] font-medium text-slate-500 sm:text-[11px]">
                      {item.timeLabel}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyMessage message="No approved reward activity yet." />
            )}
            <Link
              to="/contributions"
              className="mt-3 flex items-center justify-center rounded-[14px] bg-[#0b4b2b] px-4 py-3 text-sm font-black text-white sm:mt-4 sm:rounded-[16px]"
            >
              Earn more points
            </Link>
          </Panel>
        </div>
      </div>
    </section>
  )
}
