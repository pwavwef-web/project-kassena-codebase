import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LoadingState } from '../components/common/LoadingState'
import { useAuth } from '../hooks/useAuth'
import { listUserContributions, listUserUploads } from '../lib/firestore'
import type { Contribution, UploadRecord } from '../types'

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

interface RewardItem {
  title: string
  subtitle: string
  cost: number
  icon: IconName
  tone: string
}

interface AchievementItem {
  title: string
  status: string
  icon: IconName
  tone: string
  progress?: number
}

interface ImpactItem {
  label: string
  value: number
  icon: IconName
  tone: string
}

interface BountyItem {
  title: string
  description: string
  points: number
  current: number
  target: number
  deadline: string
  sponsor: string
  progress: number
}

const rewards: RewardItem[] = [
  {
    title: 'Airtime',
    subtitle: 'All networks',
    cost: 1000,
    icon: 'airtime',
    tone: 'from-[#fff4d8] to-[#fdf8ed] text-kassena-green ring-[#efd28a]',
  },
  {
    title: 'Mobile Data',
    subtitle: '1GB bundle',
    cost: 1500,
    icon: 'data',
    tone: 'from-[#edf7ed] to-[#f9fcf5] text-kassena-green ring-[#c9dfc7]',
  },
  {
    title: 'Community',
    subtitle: 'Recognition',
    cost: 2000,
    icon: 'community',
    tone: 'from-[#fff0e7] to-[#fff8f1] text-kassena-orange ring-[#efb28f]',
  },
  {
    title: 'Kasena Merch',
    subtitle: 'Coming soon',
    cost: 3500,
    icon: 'merch',
    tone: 'from-[#f6edf8] to-[#fffbf8] text-[#69407d] ring-[#dfc6e9]',
  },
]

const bounties: BountyItem[] = [
  {
    title: 'Translate Medical Terms',
    description: 'Help build medical vocabulary in Kasem',
    points: 25,
    current: 68,
    target: 150,
    deadline: 'Ends in 12 days',
    sponsor: 'Kasena Health Initiative',
    progress: 45,
  },
  {
    title: 'Market Day Proverbs',
    description: 'Collect proverbs used in trade and greetings',
    points: 18,
    current: 41,
    target: 120,
    deadline: 'Ends in 20 days',
    sponsor: 'Community Archive',
    progress: 34,
  },
]

const leaderboard = [
  { rank: 1, name: 'Zugnaan', points: 5980, color: 'bg-[#f2b31b]' },
  { rank: 2, name: 'Akosua', points: 4210, color: 'bg-slate-300' },
  { rank: 3, name: 'Bawuli', points: 3750, color: 'bg-[#c96a2d]' },
]

const activity: Array<[string, string, string, IconName]> = [
  ['+10 pts', 'Translation Approved', '2h ago', 'check' as IconName],
  ['+15 pts', 'Bounty Completed', '5h ago', 'gift' as IconName],
  ['+20 pts', 'Cultural Note Accepted', 'Yesterday', 'book' as IconName],
  ['+5 pts', 'Community Upvote', '2 days ago', 'community' as IconName],
]

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

  return (
    10 +
    (contribution.status === 'approved' ? 40 : 0) +
    (hasExamples ? 10 : 0)
  )
}

const pointsForUpload = (upload: UploadRecord) =>
  upload.status === 'approved' ? 100 : 10

const SectionHeader = ({
  title,
  action = 'View all',
}: {
  title: string
  action?: string
}) => (
  <div className="mb-4 flex items-center justify-between gap-4">
    <h2 className="text-xl font-black text-[#073d24]">{title}</h2>
    <button
      type="button"
      className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[#cf4f23]"
    >
      {action}
      <span aria-hidden="true">›</span>
    </button>
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
    className={`rounded-[24px] border border-[#ead9bd] bg-[#fffdf8]/95 p-5 shadow-[0_16px_40px_rgba(71,44,18,0.09)] ${className}`}
  >
    {children}
  </section>
)

const Coin = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full bg-[#d99418] text-white ring-2 ring-[#f7d987] ${className}`}
  >
    <Icon name="star" className="h-3 w-3" />
  </span>
)

const Emblem = () => (
  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#0b4b2b] shadow-[inset_0_0_0_4px_rgba(251,214,120,0.35),0_14px_28px_rgba(20,83,45,0.18)] ring-4 ring-[#f9d77c]">
    <div className="absolute inset-[-10px] rounded-full border border-dashed border-[#e9b943]" />
    <svg className="h-14 w-14 text-[#f3bd3c]" fill="none" viewBox="0 0 80 80">
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

const BadgeMedal = ({ item }: { item: AchievementItem }) => (
  <article className="w-[138px] shrink-0 snap-start rounded-[18px] border border-[#ead7b7] bg-gradient-to-b from-white to-[#fff8eb] p-4 text-center shadow-[0_10px_24px_rgba(71,44,18,0.08)]">
    <div
      className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${item.tone} text-white shadow-[inset_0_-8px_14px_rgba(0,0,0,0.16),0_10px_18px_rgba(72,44,18,0.16)] ring-4 ring-[#f3dfbb]`}
    >
      <Icon name={item.icon} className="h-9 w-9" />
    </div>
    <h3 className="mt-4 min-h-10 text-sm font-black leading-5 text-[#143829]">
      {item.title}
    </h3>
    <p className="mt-1 text-xs text-slate-500">{item.status}</p>
    {typeof item.progress === 'number' ? (
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e4dccd]">
        <div
          className="h-full rounded-full bg-[#8a4aa4]"
          style={{ width: `${item.progress}%` }}
        />
      </div>
    ) : null}
  </article>
)

export const RewardsPage = () => {
  const { appUser } = useAuth()
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [uploads, setUploads] = useState<UploadRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      if (!appUser) {
        return
      }

      const [userContributions, userUploads] = await Promise.all([
        listUserContributions(appUser.uid),
        listUserUploads(appUser.uid),
      ])

      if (active) {
        setContributions(userContributions)
        setUploads(userUploads)
        setIsLoading(false)
      }
    }

    hydrate().catch(() => {
      if (active) {
        setIsLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [appUser])

  const stats = useMemo(() => {
    const approvedContributions = contributions.filter(
      (item) => item.status === 'approved',
    )
    const approvedUploads = uploads.filter((item) => item.status === 'approved')
    const approvedEntries = approvedContributions.length + approvedUploads.length
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
      contributions.reduce(
        (total, contribution) => total + pointsForContribution(contribution),
        0,
      ) + uploads.reduce((total, upload) => total + pointsForUpload(upload), 0)

    return {
      approvedEntries,
      approvedContributions: approvedContributions.length,
      points,
      proverbsAdded,
      sentencesAdded,
      wordsAdded,
    }
  }, [contributions, uploads])

  if (!appUser || isLoading) {
    return <LoadingState message="Loading rewards..." />
  }

  const initials =
    appUser.displayName
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'PK'
  const nextReward = [1000, 1500, 2000, 3500, 5000].find(
    (threshold) => threshold > stats.points,
  ) ?? 5000
  const pointsRemaining = Math.max(0, nextReward - stats.points)
  const progress = Math.min(100, (stats.points / nextReward) * 100)
  const achievements: AchievementItem[] = [
    {
      title: 'First Contribution',
      status: contributions.length > 0 ? 'Earned' : 'Locked',
      icon: 'leaf',
      tone: 'from-[#2d8b45] to-[#0b4b2b]',
    },
    {
      title: '10 Approved Entries',
      status: stats.approvedContributions >= 10 ? 'Earned' : 'In progress',
      icon: 'star',
      tone: 'from-[#bc682c] to-[#7a3417]',
    },
    {
      title: 'Community Builder',
      status: uploads.length > 0 ? 'Earned' : 'Locked',
      icon: 'community',
      tone: 'from-[#e2a51d] to-[#a76000]',
    },
    {
      title: 'Language Champion',
      status: '80% Complete',
      icon: 'shield',
      tone: 'from-[#8f56a8] to-[#4b2866]',
      progress: 80,
    },
    {
      title: 'Elder Approved',
      status: stats.approvedEntries > 0 ? 'Earned' : 'Locked',
      icon: 'badge',
      tone: 'from-[#4e789f] to-[#203c5f]',
    },
  ]
  const impact: ImpactItem[] = [
    {
      label: 'Approved Entries',
      value: stats.approvedEntries,
      icon: 'check',
      tone: 'bg-[#edf7ed] text-kassena-green ring-[#c9dfc7]',
    },
    {
      label: 'Words Added',
      value: stats.wordsAdded,
      icon: 'book',
      tone: 'bg-[#fff5df] text-[#9a6b08] ring-[#f0d49a]',
    },
    {
      label: 'Sentences Added',
      value: stats.sentencesAdded,
      icon: 'sentence',
      tone: 'bg-[#fff0e7] text-kassena-orange ring-[#f0c2aa]',
    },
    {
      label: 'Proverbs Added',
      value: stats.proverbsAdded,
      icon: 'proverb',
      tone: 'bg-[#f4ecfb] text-[#6b4584] ring-[#ddcaea]',
    },
  ]

  return (
    <section className="relative mx-auto min-h-screen max-w-[520px] overflow-hidden bg-[#fff8ea] pb-28 text-[#143829] shadow-[0_24px_70px_rgba(55,35,15,0.18)] md:max-w-6xl md:rounded-[32px]">
      <div className="relative rounded-b-[32px] bg-[#0b4b2b] px-7 pb-24 pt-7 text-white shadow-[0_18px_40px_rgba(10,58,34,0.25)]">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,transparent_0_42%,rgba(255,255,255,0.16)_42%_46%,transparent_46%_100%),repeating-linear-gradient(45deg,rgba(255,255,255,0.08)_0_2px,transparent_2px_18px)]" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            {appUser.photoURL ? (
              <img
                src={appUser.photoURL}
                alt=""
                className="h-[72px] w-[72px] shrink-0 rounded-full object-cover ring-4 ring-[#f1bf55]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#f7d681] text-lg font-black text-[#0b4b2b] ring-4 ring-[#f1bf55]">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-[40px] font-black leading-none tracking-normal">
                Rewards
              </h1>
              <p className="mt-2 truncate text-base font-medium text-white/88">
                Thank you for preserving Kasem
                <span className="ml-2 text-[#f7c84b]">◆</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
            aria-label="Notifications"
          >
            <Icon name="bell" className="h-8 w-8" />
            <span className="absolute right-2 top-2 h-3 w-3 rounded-full bg-kassena-orange ring-2 ring-[#0b4b2b]" />
          </button>
        </div>
      </div>

      <div className="-mt-[74px] space-y-4 px-4 md:px-7">
        <Panel className="relative z-10">
          <div className="grid gap-5 sm:grid-cols-[140px_1fr] lg:grid-cols-[170px_1fr_260px] lg:items-center">
            <div className="flex justify-center sm:justify-start">
              <Emblem />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0b4b2b]">
                Your contribution points
              </p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-[52px] font-black leading-none text-[#0b4b2b] sm:text-[64px]">
                  {stats.points.toLocaleString()}
                </span>
                <span className="pb-2 text-xl font-black text-[#0b4b2b]">
                  pts
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#eadcc4]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2d9749] to-[#0b4b2b]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <Coin className="h-8 w-8" />
              </div>
              <p className="mt-2 text-base font-medium text-slate-600">
                <span className="font-black text-[#cf4f23]">
                  {pointsRemaining.toLocaleString()}
                </span>{' '}
                pts to next reward
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href="#marketplace"
                className="flex items-center justify-center gap-3 rounded-[18px] bg-gradient-to-r from-[#d45d28] to-[#cf4f23] px-4 py-4 text-base font-black text-white shadow-[0_14px_24px_rgba(207,79,35,0.28)]"
              >
                <Icon name="gift" className="h-6 w-6" />
                Redeem Rewards
              </a>
              <a
                href="#activity"
                className="flex items-center justify-center gap-3 rounded-[18px] border border-[#e6cda7] bg-white px-4 py-4 text-base font-black text-[#0b4b2b]"
              >
                <Icon name="calendar" className="h-6 w-6" />
                View Points History
              </a>
            </div>
          </div>
        </Panel>

        <Panel id="marketplace" className="pt-5">
          <SectionHeader title="Rewards Marketplace" />
          <div className="-mx-5 overflow-x-auto px-5 pb-1 scrollbar-hide">
            <div className="flex min-w-max snap-x gap-4">
              {rewards.map((reward) => (
                <article
                  key={reward.title}
                  className={`w-[164px] shrink-0 snap-start rounded-[18px] border bg-gradient-to-b ${reward.tone} p-4 text-center shadow-sm`}
                >
                  <div className="mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-full bg-gradient-to-b from-[#f6cd62] to-[#0b4b2b] text-white shadow-[inset_0_-12px_20px_rgba(0,0,0,0.18)]">
                    <Icon name={reward.icon} className="h-11 w-11" />
                  </div>
                  <h3 className="mt-4 text-lg font-black leading-5 text-[#101f1a]">
                    {reward.title}
                  </h3>
                  <p className="mt-1 min-h-5 text-sm font-medium text-[#101f1a]">
                    {reward.subtitle}
                  </p>
                  <p className="mt-4 flex items-center justify-center gap-2 text-lg font-black text-[#24352e]">
                    <Coin />
                    {reward.cost.toLocaleString()} pts
                  </p>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-xl bg-[#0b4b2b] py-3 text-base font-black text-white shadow-[0_8px_18px_rgba(11,75,43,0.2)]"
                  >
                    Redeem
                  </button>
                </article>
              ))}
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionHeader title="Achievements" />
          <div className="-mx-5 overflow-x-auto px-5 pb-1 scrollbar-hide">
            <div className="flex min-w-max snap-x gap-4">
              {achievements.map((achievement) => (
                <BadgeMedal key={achievement.title} item={achievement} />
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="relative overflow-hidden">
          <div className="absolute bottom-0 left-0 top-0 w-8 bg-[repeating-linear-gradient(135deg,#d35f2f_0_12px,#efb63b_12px_24px,#0b4b2b_24px_36px)]" />
          <div className="pl-6">
            <SectionHeader title="Your Impact" action="See full impact" />
            <div className="-mx-5 overflow-x-auto px-5 pb-1 scrollbar-hide">
              <div className="flex min-w-max snap-x gap-4">
                {impact.map((item) => (
                  <article
                    key={item.label}
                    className={`flex w-[174px] shrink-0 snap-start items-center gap-3 rounded-[18px] p-4 ring-1 ${item.tone}`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/65">
                      <Icon name={item.icon} className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#101f1a]">
                        {item.value}
                      </p>
                      <p className="text-sm font-semibold leading-4 text-[#101f1a]">
                        {item.label}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionHeader title="Active Bounties" />
          <div className="-mx-5 overflow-x-auto px-5 pb-1 scrollbar-hide">
            <div className="flex min-w-max snap-x gap-4">
              {bounties.map((bounty) => (
                <article
                  key={bounty.title}
                  className="grid w-[342px] shrink-0 snap-start grid-cols-[96px_1fr] overflow-hidden rounded-[20px] border border-[#e5cda8] bg-[#fffdf8] shadow-sm sm:w-[520px] sm:grid-cols-[130px_1fr]"
                >
                  <div className="flex items-center justify-center bg-[#0b4b2b] p-4 text-[#f6cd62]">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-[#f6cd62] sm:h-20 sm:w-20">
                      <Icon name="medical" className="h-10 w-10" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black leading-6 text-[#0b4b2b]">
                          {bounty.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {bounty.description}
                        </p>
                      </div>
                      <span className="flex items-center gap-2 rounded-full bg-[#5d9137] px-3 py-2 text-xs font-black text-white">
                        <Icon name="calendar" className="h-4 w-4" />
                        {bounty.deadline}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-black text-[#0b4b2b]">
                      +{bounty.points} pts{' '}
                      <span className="font-semibold text-[#101f1a]">
                        per approved contribution
                      </span>
                    </p>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#ebddc6]">
                      <div
                        className="h-full rounded-full bg-[#2d9749]"
                        style={{ width: `${bounty.progress}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <p className="text-xs font-medium text-slate-600">
                        {bounty.current} / {bounty.target} contributions
                      </p>
                      <p className="max-w-[130px] text-right text-xs font-semibold text-[#101f1a]">
                        Sponsored by{' '}
                        <span className="font-black">{bounty.sponsor}</span>
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Panel>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <SectionHeader title="Leaderboard" action="View full" />
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className="grid grid-cols-[36px_40px_1fr_auto] items-center gap-3"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${entry.color} text-sm font-black text-white shadow-sm`}
                  >
                    {entry.rank}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b4b2b] text-xs font-black text-white ring-2 ring-[#f2cf74]">
                    {entry.name.slice(0, 2).toUpperCase()}
                  </div>
                  <p className="truncate text-base font-black text-[#143829]">
                    {entry.name}
                  </p>
                  <p className="text-sm font-black text-[#101f1a]">
                    {entry.points.toLocaleString()} pts
                  </p>
                </div>
              ))}
              <div className="grid grid-cols-[36px_40px_1fr_auto] items-center gap-3 rounded-[14px] bg-[#eff3df] px-3 py-2">
                <span className="flex h-7 w-9 items-center justify-center rounded-full bg-[#0b4b2b] text-xs font-black text-white">
                  12
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1c870] text-xs font-black text-[#0b4b2b] ring-2 ring-white">
                  {initials}
                </div>
                <p className="truncate text-base font-black text-[#143829]">
                  You
                </p>
                <p className="text-sm font-black text-[#101f1a]">
                  {stats.points.toLocaleString()} pts
                </p>
              </div>
              <div className="rounded-[16px] border border-[#efd9b0] bg-[#fff4dd] p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-[#143829]">
                    Next Rank: Top 10
                  </span>
                  <span className="font-medium text-slate-500">
                    {pointsRemaining.toLocaleString()} pts to go
                  </span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#e6d6b8]">
                  <div
                    className="h-full rounded-full bg-[#2d9749]"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
              </div>
            </div>
          </Panel>

          <Panel id="activity">
            <SectionHeader title="Recent Activity" />
            <div className="space-y-4">
              {activity.map(([points, title, time, icon], index) => (
                <div key={title} className="grid grid-cols-[40px_72px_1fr_auto] gap-3">
                  <div className="relative flex justify-center">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${
                        index === 0
                          ? 'bg-[#2d9749]'
                          : index === 1
                            ? 'bg-[#d45d28]'
                            : index === 2
                              ? 'bg-[#d99418]'
                              : 'bg-[#8660a1]'
                      }`}
                    >
                      <Icon name={icon} className="h-5 w-5" />
                    </span>
                    {index < activity.length - 1 ? (
                      <span className="absolute top-10 h-6 border-l border-dashed border-[#b79f7b]" />
                    ) : null}
                  </div>
                  <p className="pt-2 text-sm font-black text-[#0b4b2b]">
                    {points}
                  </p>
                  <p className="pt-2 text-sm font-medium text-slate-600">
                    {title}
                  </p>
                  <p className="pt-2 text-xs font-medium text-slate-500">
                    {time}
                  </p>
                </div>
              ))}
            </div>
            <Link
              to="/contributions"
              className="mt-5 flex items-center justify-center rounded-[16px] bg-[#0b4b2b] px-4 py-3 text-sm font-black text-white"
            >
              Earn more points
            </Link>
          </Panel>
        </div>
      </div>
    </section>
  )
}
