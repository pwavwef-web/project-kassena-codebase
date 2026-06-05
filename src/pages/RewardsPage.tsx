import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LoadingState } from '../components/common/LoadingState'
import { useAuth } from '../hooks/useAuth'
import {
  getLeaderboardRank,
  listRewardAchievements,
  listRewardBounties,
  listRewardCatalogItems,
  listUserContributions,
  listUserUploads,
  subscribeToLeaderboard,
  subscribeToLeaderboardUser,
} from '../lib/firestore'
import type {
  Contribution,
  LeaderboardProfile,
  RankedLeaderboardProfile,
  RewardAchievement,
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

const badgeToneClasses = [
  'from-[#2d8b45] to-[#0b4b2b]',
  'from-[#bc682c] to-[#7a3417]',
  'from-[#e2a51d] to-[#a76000]',
  'from-[#8f56a8] to-[#4b2866]',
  'from-[#4e789f] to-[#203c5f]',
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
  <div className="mb-3 flex items-center justify-between gap-3">
    <h2 className="min-w-0 text-lg font-black text-[#073d24]">{title}</h2>
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
    className={`rounded-[22px] border border-[#ead9bd] bg-[#fffdf8]/95 p-4 shadow-[0_14px_34px_rgba(71,44,18,0.09)] ${className}`}
  >
    {children}
  </section>
)

const ScrollRow = ({ children }: { children: ReactNode }) => (
  <div className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-hide">
    <div className="flex min-w-max snap-x gap-3">{children}</div>
  </div>
)

const EmptyMessage = ({ message }: { message: string }) => (
  <div className="rounded-[18px] border border-dashed border-[#e3cfad] bg-[#fff8ed] px-4 py-5 text-center text-sm font-semibold text-slate-500">
    {message}
  </div>
)

const Coin = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full bg-[#d99418] text-white ring-2 ring-[#f7d987] ${className}`}
  >
    <Icon name="star" className="h-3 w-3" />
  </span>
)

const Emblem = () => (
  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0b4b2b] shadow-[inset_0_0_0_3px_rgba(251,214,120,0.35),0_10px_20px_rgba(20,83,45,0.16)] ring-4 ring-[#f9d77c] sm:h-20 sm:w-20">
    <div className="absolute inset-[-7px] rounded-full border border-dashed border-[#e9b943]" />
    <svg className="h-10 w-10 text-[#f3bd3c] sm:h-12 sm:w-12" fill="none" viewBox="0 0 80 80">
      <path
        d="M40 12v56M24 20c11 11 21 18 32 40M56 20C45 31 35 38 24 60M24 28c0-8 10-8 16 0 6-8 16-8 16 0 0 10-16 17-16 17S24 38 24 28Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
    </svg>
  </div>
)

export const RewardsPage = () => {
  const { appUser } = useAuth()
  const navigate = useNavigate()
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [uploads, setUploads] = useState<UploadRecord[]>([])
  const [rewardItems, setRewardItems] = useState<RewardCatalogItem[]>([])
  const [achievementDefs, setAchievementDefs] = useState<RewardAchievement[]>([])
  const [bounties, setBounties] = useState<RewardBounty[]>([])
  const [leaderboard, setLeaderboard] = useState<RankedLeaderboardProfile[]>([])
  const [leaderboardUser, setLeaderboardUser] =
    useState<LeaderboardProfile | null>(null)
  const [userRank, setUserRank] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dataError, setDataError] = useState('')

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      if (!appUser) {
        return
      }

      const [
        userContributions,
        userUploads,
        catalogItems,
        achievements,
        activeBounties,
      ] = await Promise.all([
        listUserContributions(appUser.uid),
        listUserUploads(appUser.uid),
        listRewardCatalogItems(),
        listRewardAchievements(),
        listRewardBounties(),
      ])

      if (active) {
        setContributions(userContributions)
        setUploads(userUploads)
        setRewardItems(catalogItems)
        setAchievementDefs(achievements)
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
  const nextRankTarget = Math.max(currentPoints + pointsRemaining, 1)
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

  const getAchievementValue = (achievement: RewardAchievement) => {
    switch (achievement.requirementType) {
      case 'firstContribution':
        return contributions.length > 0 ? 1 : 0
      case 'approvedEntries':
      case 'elderApproved':
        return approvedEntries
      case 'uploads':
        return calculatedStats.uploads
      case 'totalPoints':
      default:
        return currentPoints
    }
  }

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
    <section className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#fff8ea] pb-28 text-[#143829] shadow-[0_24px_70px_rgba(55,35,15,0.16)] md:max-w-6xl md:rounded-[32px]">
      <div className="relative rounded-b-[28px] bg-[#0b4b2b] px-4 pb-20 pt-5 text-white shadow-[0_18px_40px_rgba(10,58,34,0.25)] sm:px-6 sm:pt-7">
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
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-[3px] ring-[#f1bf55] sm:h-[68px] sm:w-[68px]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f7d681] text-base font-black text-[#0b4b2b] ring-[3px] ring-[#f1bf55] sm:h-[68px] sm:w-[68px]">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-3xl font-black leading-none tracking-normal sm:text-[40px]">
                Rewards
              </h1>
              <p className="mt-1 truncate text-sm font-medium text-white/88 sm:text-base">
                Thank you for preserving Kasem
              </p>
            </div>
          </div>
          <button
            type="button"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
            aria-label="Notifications"
          >
            <Icon name="bell" className="h-7 w-7" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-kassena-orange ring-2 ring-[#0b4b2b]" />
          </button>
        </div>
      </div>

      <div className="-mt-14 space-y-4 px-3 sm:px-4 md:px-7">
        {dataError ? (
          <div className="relative z-20 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {dataError}
          </div>
        ) : null}

        <Panel className="relative z-10">
          <div className="grid grid-cols-[74px_minmax(0,1fr)] gap-3 lg:grid-cols-[110px_1fr_230px] lg:items-center">
            <div className="pt-2">
              <Emblem />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#0b4b2b] sm:text-xs">
                Your contribution points
              </p>
              <div className="mt-1 flex min-w-0 items-end gap-1">
                <span className="min-w-0 truncate text-[42px] font-black leading-none text-[#0b4b2b] sm:text-[58px]">
                  {currentPoints.toLocaleString()}
                </span>
                <span className="pb-1 text-base font-black text-[#0b4b2b]">
                  pts
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#eadcc4]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2d9749] to-[#0b4b2b]"
                    style={{ width: `${rewardProgress}%` }}
                  />
                </div>
                <Coin className="h-7 w-7" />
              </div>
              <p className="mt-2 text-sm font-medium text-slate-600">
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
            </div>

            <div className="col-span-2 grid gap-2 min-[390px]:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
              <a
                href="#marketplace"
                className="flex items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#d45d28] to-[#cf4f23] px-3 py-3 text-sm font-black text-white shadow-[0_10px_18px_rgba(207,79,35,0.22)]"
              >
                <Icon name="gift" className="h-5 w-5" />
                Redeem Rewards
              </a>
              <a
                href="#activity"
                className="flex items-center justify-center gap-2 rounded-[16px] border border-[#e6cda7] bg-white px-3 py-3 text-sm font-black text-[#0b4b2b]"
              >
                <Icon name="calendar" className="h-5 w-5" />
                Points History
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
                  <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-b from-[#f6cd62] to-[#0b4b2b] text-white shadow-[inset_0_-12px_20px_rgba(0,0,0,0.18)] sm:h-[82px] sm:w-[82px]">
                    <Icon
                      name={normalizeIcon(reward.icon, 'gift')}
                      className="h-9 w-9"
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
          <SectionHeader title="Achievements" />
          {achievementDefs.length ? (
            <ScrollRow>
              {achievementDefs.map((achievement, index) => {
                const target = Math.max(achievement.target, 1)
                const value = getAchievementValue(achievement)
                const progress = Math.min(100, (value / target) * 100)
                const earned = value >= target

                return (
                  <article
                    key={achievement.id}
                    className="w-[124px] shrink-0 snap-start rounded-[18px] border border-[#ead7b7] bg-gradient-to-b from-white to-[#fff8eb] p-3 text-center shadow-[0_10px_24px_rgba(71,44,18,0.08)]"
                  >
                    <div
                      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${
                        badgeToneClasses[index % badgeToneClasses.length]
                      } text-white shadow-[inset_0_-8px_14px_rgba(0,0,0,0.16),0_10px_18px_rgba(72,44,18,0.16)] ring-4 ring-[#f3dfbb]`}
                    >
                      <Icon
                        name={normalizeIcon(achievement.icon, 'badge')}
                        className="h-8 w-8"
                      />
                    </div>
                    <h3 className="mt-3 min-h-10 text-xs font-black leading-4 text-[#143829]">
                      {achievement.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {earned ? 'Earned' : `${Math.round(progress)}%`}
                    </p>
                    {!earned ? (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e4dccd]">
                        <div
                          className="h-full rounded-full bg-[#8a4aa4]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </ScrollRow>
          ) : (
            <EmptyMessage message="No achievement badges have been configured in Firebase yet." />
          )}
        </Panel>

        <Panel className="relative overflow-hidden">
          <div className="absolute bottom-0 left-0 top-0 w-6 bg-[repeating-linear-gradient(135deg,#d35f2f_0_10px,#efb63b_10px_20px,#0b4b2b_20px_30px)]" />
          <div className="pl-5">
            <SectionHeader title="Your Impact" />
            <ScrollRow>
              {impact.map((item) => (
                <article
                  key={item.label}
                  className={`flex w-[148px] shrink-0 snap-start items-center gap-2.5 rounded-[16px] p-3 ring-1 ${item.tone}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/65">
                    <Icon name={item.icon} className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-black text-[#101f1a]">
                      {item.value}
                    </p>
                    <p className="text-xs font-semibold leading-4 text-[#101f1a]">
                      {item.label}
                    </p>
                  </div>
                </article>
              ))}
            </ScrollRow>
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
                          className="h-8 w-8"
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

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <SectionHeader title="Leaderboard" />
            {leaderboard.length ? (
              <div className="space-y-3">
                {leaderboard.slice(0, 3).map((entry) => (
                  <div
                    key={entry.uid}
                    className="grid grid-cols-[28px_36px_minmax(0,1fr)_auto] items-center gap-2"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f2b31b] text-xs font-black text-white shadow-sm">
                      {entry.rank}
                    </span>
                    {entry.photoURL ? (
                      <img
                        src={entry.photoURL}
                        alt=""
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-[#f2cf74]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b4b2b] text-[10px] font-black text-white ring-2 ring-[#f2cf74]">
                        {entry.displayName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <p className="truncate text-sm font-black text-[#143829]">
                      {entry.displayName}
                    </p>
                    <p className="text-xs font-black text-[#101f1a]">
                      {entry.activePoints.toLocaleString()} pts
                    </p>
                  </div>
                ))}
                <div className="grid grid-cols-[36px_36px_minmax(0,1fr)_auto] items-center gap-2 rounded-[14px] bg-[#eff3df] px-3 py-2">
                  <span className="flex h-7 items-center justify-center rounded-full bg-[#0b4b2b] px-2 text-xs font-black text-white">
                    {userRank ?? '-'}
                  </span>
                  {appUser.photoURL ? (
                    <img
                      src={appUser.photoURL}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1c870] text-[10px] font-black text-[#0b4b2b] ring-2 ring-white">
                      {initials}
                    </div>
                  )}
                  <p className="truncate text-sm font-black text-[#143829]">
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
                      {pointsRemaining.toLocaleString()} pts to go
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e6d6b8]">
                    <div
                      className="h-full rounded-full bg-[#2d9749]"
                      style={{
                        width: `${Math.min(
                          100,
                          (currentPoints / nextRankTarget) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <EmptyMessage message="No leaderboard profiles are available in Firebase yet." />
            )}
          </Panel>

          <Panel id="activity">
            <SectionHeader title="Recent Activity" />
            {activityItems.length ? (
              <div className="space-y-3">
                {activityItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[34px_minmax(0,1fr)_auto] gap-2"
                  >
                    <div className="relative flex justify-center">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${
                          index === 0
                            ? 'bg-[#2d9749]'
                            : index === 1
                              ? 'bg-[#d45d28]'
                              : index === 2
                                ? 'bg-[#d99418]'
                                : 'bg-[#8660a1]'
                        }`}
                      >
                        <Icon name={item.icon} className="h-5 w-5" />
                      </span>
                      {index < activityItems.length - 1 ? (
                        <span className="absolute top-9 h-6 border-l border-dashed border-[#b79f7b]" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#0b4b2b]">
                        +{item.points} pts
                      </p>
                      <p className="truncate text-xs font-semibold text-slate-600">
                        {item.title}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                    <p className="pt-1 text-[11px] font-medium text-slate-500">
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
              className="mt-4 flex items-center justify-center rounded-[16px] bg-[#0b4b2b] px-4 py-3 text-sm font-black text-white"
            >
              Earn more points
            </Link>
          </Panel>
        </div>
      </div>
    </section>
  )
}
