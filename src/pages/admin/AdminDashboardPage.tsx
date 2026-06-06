import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingState } from '../../components/common/LoadingState'
import { useAuth } from '../../hooks/useAuth'
import { DATA_COLLECTION_TARGET } from '../../lib/constants'
import { toDateLabel } from '../../lib/date'
import {
  subscribeToAdminDashboard,
  subscribeToAdminUsers,
  subscribeToLeaderboard,
  subscribeToRecentAuditLogs,
  getDictionaryAnalytics,
} from '../../lib/firestore'
import type {
  AdminUserSummary,
  AuditLogRecord,
  Contribution,
  DashboardMetrics,
  RankedLeaderboardProfile,
} from '../../types'

type Tone = 'blue' | 'gold' | 'green' | 'orange' | 'red' | 'slate'
type DashboardIconName =
  | 'alert'
  | 'book'
  | 'check'
  | 'clipboard'
  | 'file'
  | 'home'
  | 'person'
  | 'shield'
  | 'upload'
  | 'users'

const defaultMetrics: DashboardMetrics = {
  totalUsers: 0,
  activeContributors: 0,
  activeValidators: 0,
  totalContributions: 0,
  pendingContributions: 0,
  approvedContributions: 0,
  rejectedContributions: 0,
  totalUploads: 0,
  pendingUploads: 0,
  approvedUploads: 0,
  approvedDictionaryEntries: 0,
}

const numberFormatter = new Intl.NumberFormat('en-US')

const toneStyles: Record<
  Tone,
  {
    border: string
    button: string
    icon: string
    subtle: string
    text: string
  }
> = {
  blue: {
    border: 'border-blue-200',
    button: 'border-blue-300 text-blue-700 hover:bg-blue-50',
    icon: 'bg-blue-100 text-blue-700',
    subtle: 'bg-blue-50',
    text: 'text-blue-700',
  },
  gold: {
    border: 'border-amber-200',
    button: 'border-amber-300 text-amber-700 hover:bg-amber-50',
    icon: 'bg-amber-100 text-amber-700',
    subtle: 'bg-amber-50',
    text: 'text-amber-700',
  },
  green: {
    border: 'border-emerald-200',
    button: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50',
    icon: 'bg-emerald-100 text-emerald-700',
    subtle: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  orange: {
    border: 'border-orange-200',
    button: 'border-orange-300 text-orange-700 hover:bg-orange-50',
    icon: 'bg-orange-100 text-orange-700',
    subtle: 'bg-orange-50',
    text: 'text-orange-700',
  },
  red: {
    border: 'border-red-200',
    button: 'border-red-300 text-red-700 hover:bg-red-50',
    icon: 'bg-red-100 text-red-700',
    subtle: 'bg-red-50',
    text: 'text-red-700',
  },
  slate: {
    border: 'border-slate-200',
    button: 'border-slate-300 text-slate-700 hover:bg-slate-50',
    icon: 'bg-slate-100 text-slate-700',
    subtle: 'bg-slate-50',
    text: 'text-slate-700',
  },
}

const formatNumber = (value: number) => numberFormatter.format(Math.max(0, value))

const getInitials = (name?: string) =>
  (name || 'Unknown')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const DashboardIcon = ({
  name,
  className = 'h-5 w-5',
}: {
  name: DashboardIconName
  className?: string
}) => {
  const commonProps = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2,
    viewBox: '0 0 24 24',
  }

  const paths: Record<DashboardIconName, ReactNode> = {
    alert: (
      <>
        <path d="m12 3 10 18H2z" />
        <path d="M12 9v5" />
        <path d="M12 17h.01" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    clipboard: (
      <>
        <path d="M9 5h6" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
        <path d="M8 3h8l1 2h2v16H5V5h2z" />
      </>
    ),
    file: (
      <>
        <path d="M6 2h9l5 5v15H6z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v11h14V10" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
    person: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    upload: (
      <>
        <path d="M12 3v12" />
        <path d="m7 8 5-5 5 5" />
        <path d="M5 21h14" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  }

  return <svg {...commonProps}>{paths[name]}</svg>
}

export const AdminDashboardPage = () => {
  const { appUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics)
  const [recent, setRecent] = useState<Contribution[]>([])
  const [topContributors, setTopContributors] = useState<
    RankedLeaderboardProfile[]
  >([])
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUserSummary[]>([])
  const [dictAnalytics, setDictAnalytics] = useState<{
    totalSearches: number
    totalViews: number
    totalFavorites: number
    totalCorrections: number
    mostViewedWords: Array<{ entryId: string; englishText: string; kasemText: string; viewCount: number }>
    mostFavoritedWords: Array<{ entryId: string; englishText: string; kasemText: string; favCount: number }>
  } | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToAdminDashboard(
      (payload) => {
        setMetrics(payload.metrics)
        setRecent(payload.recent)
        setLoadError('')
        setIsLoading(false)
      },
      (error) => {
        console.error(error)
        setLoadError('Dashboard data could not be refreshed.')
        setIsLoading(false)
      },
    )

    return unsubscribe
  }, [])

  useEffect(
    () =>
      subscribeToLeaderboard(
        'month',
        (profiles) => setTopContributors(profiles.slice(0, 8)),
        () => setTopContributors([]),
      ),
    [],
  )

  useEffect(
    () =>
      subscribeToRecentAuditLogs(
        (logs) => setAuditLogs(logs),
        () => setAuditLogs([]),
      ),
    [],
  )

  useEffect(
    () =>
      subscribeToAdminUsers(
        (users) => setAdminUsers(users),
        () => setAdminUsers([]),
      ),
    [],
  )

  useEffect(() => {
    getDictionaryAnalytics()
      .then(setDictAnalytics)
      .catch(() => {})
  }, [])

  const statCards = [
    {
      label: 'Total Users',
      value: metrics.totalUsers,
      icon: 'users' as DashboardIconName,
      tone: 'green' as Tone,
    },
    {
      label: 'Contributors',
      value: metrics.activeContributors,
      icon: 'person' as DashboardIconName,
      tone: 'green' as Tone,
    },
    {
      label: 'Validators',
      value: metrics.activeValidators,
      icon: 'shield' as DashboardIconName,
      tone: 'green' as Tone,
    },
    {
      label: 'Total Contributions',
      value: metrics.totalContributions,
      icon: 'clipboard' as DashboardIconName,
      tone: 'blue' as Tone,
    },
    {
      label: 'Pending Contributions',
      value: metrics.pendingContributions,
      icon: 'alert' as DashboardIconName,
      tone: metrics.pendingContributions ? ('orange' as Tone) : ('slate' as Tone),
    },
    {
      label: 'Approved Contributions',
      value: metrics.approvedContributions,
      icon: 'check' as DashboardIconName,
      tone: 'green' as Tone,
    },
    {
      label: 'Rejected Contributions',
      value: metrics.rejectedContributions,
      icon: 'file' as DashboardIconName,
      tone: metrics.rejectedContributions ? ('red' as Tone) : ('slate' as Tone),
    },
    {
      label: 'Total Uploads',
      value: metrics.totalUploads,
      icon: 'upload' as DashboardIconName,
      tone: 'blue' as Tone,
    },
    {
      label: 'Pending Uploads',
      value: metrics.pendingUploads,
      icon: 'alert' as DashboardIconName,
      tone: metrics.pendingUploads ? ('orange' as Tone) : ('slate' as Tone),
    },
    {
      label: 'Published Uploads',
      value: metrics.approvedUploads,
      icon: 'upload' as DashboardIconName,
      tone: 'green' as Tone,
    },
    {
      label: 'Verified Dictionary Entries',
      value: metrics.approvedDictionaryEntries,
      icon: 'book' as DashboardIconName,
      tone: 'gold' as Tone,
    },
  ]

  const attentionCards = [
    {
      title: 'Contributions Need Review',
      value: metrics.pendingContributions,
      action: 'Review Contributions',
      to: '/admin/submissions',
      icon: 'clipboard' as DashboardIconName,
      tone: 'orange' as Tone,
    },
    {
      title: 'Uploads Need Review',
      value: metrics.pendingUploads,
      action: 'Review Uploads',
      to: '/admin/uploads',
      icon: 'upload' as DashboardIconName,
      tone: 'orange' as Tone,
    },
  ].filter((item) => item.value > 0)

  const adminTeam = useMemo(
    () =>
      adminUsers.filter(
        (user) => user.role === 'admin' || user.role === 'validator',
      ),
    [adminUsers],
  )

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <LoadingState />
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden px-4 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <Link
              to="/"
              className="mb-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d8cbb8] bg-white px-3 text-sm font-bold text-kassena-green shadow-sm transition hover:bg-kassena-cream/60"
            >
              <DashboardIcon name="home" className="h-4 w-4" />
              Back home
            </Link>
            <h1 className="text-2xl font-bold text-[#13231a] sm:text-3xl">
              Language Operations Center
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Live admin view of TribeStudio data
            </p>
            {loadError ? (
              <p className="mt-2 text-sm font-semibold text-red-700">
                {loadError}
              </p>
            ) : null}
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[#eadcc7] bg-white px-3 py-2 shadow-sm">
            <Avatar name={appUser?.displayName} src={appUser?.photoURL} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#13231a]">
                {appUser?.displayName || 'Admin user'}
              </p>
              <p className="text-xs capitalize text-slate-500">
                {appUser?.role ? `${appUser.role} account` : 'Signed in'}
              </p>
            </div>
          </div>
        </header>

        <HorizontalRail label="Key admin metrics">
          {statCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </HorizontalRail>

        <section className="rounded-lg border border-[#eadcc7] bg-white p-4 shadow-[0_10px_32px_rgba(88,55,22,0.08)]">
          <h2 className="text-base font-bold text-[#13231a]">Needs Attention</h2>
          {attentionCards.length ? (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {attentionCards.map((card) => (
                <AttentionCard key={card.title} {...card} />
              ))}
            </div>
          ) : (
            <EmptyPanel message="No contribution or upload queues need review right now." />
          )}
        </section>

        <HorizontalRail label="Admin quick actions">
          {[
            {
              label: 'Review Contributions',
              to: '/admin/submissions',
              icon: 'clipboard' as DashboardIconName,
              tone: 'green' as Tone,
            },
            {
              label: 'Review Uploads',
              to: '/admin/uploads',
              icon: 'upload' as DashboardIconName,
              tone: 'blue' as Tone,
            },
            {
              label: 'Dictionary',
              to: '/admin/dictionary',
              icon: 'book' as DashboardIconName,
              tone: 'gold' as Tone,
            },
            {
              label: 'Manage Users',
              to: '/admin/users',
              icon: 'users' as DashboardIconName,
              tone: 'slate' as Tone,
            },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className={`flex min-h-14 w-56 shrink-0 items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-bold shadow-sm transition ${toneStyles[action.tone].button}`}
            >
              <DashboardIcon name={action.icon} className="h-5 w-5 shrink-0" />
              <span className="leading-tight">{action.label}</span>
            </Link>
          ))}
        </HorizontalRail>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,.72fr)]">
          <LanguageCorpusGrowth approved={metrics.approvedDictionaryEntries} />
          <PipelinePanel metrics={metrics} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]">
          <RecentActivityPanel recent={recent} />
          <TopContributorsPanel contributors={topContributors} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <AdminTeamPanel users={adminTeam} />
          <AuditLogsPanel logs={auditLogs} />
        </div>

        {dictAnalytics && (
          <section className="rounded-lg border border-[#eadcc7] bg-white p-4 shadow-[0_10px_32px_rgba(88,55,22,0.08)]">
            <h2 className="text-base font-bold text-[#13231a]">Dictionary Analytics</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-2xl font-bold text-blue-700">{formatNumber(dictAnalytics.totalSearches)}</p>
                <p className="text-xs font-semibold text-blue-600">Total Searches</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-2xl font-bold text-green-700">{formatNumber(dictAnalytics.totalViews)}</p>
                <p className="text-xs font-semibold text-green-600">Word Views</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-3">
                <p className="text-2xl font-bold text-amber-700">{formatNumber(dictAnalytics.totalFavorites)}</p>
                <p className="text-xs font-semibold text-amber-600">Favorites</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <p className="text-2xl font-bold text-purple-700">{formatNumber(dictAnalytics.totalCorrections)}</p>
                <p className="text-xs font-semibold text-purple-600">Corrections</p>
              </div>
            </div>
            {dictAnalytics.mostViewedWords.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-bold text-[#13231a]">Most Viewed Words</h3>
                <div className="mt-2 space-y-2">
                  {dictAnalytics.mostViewedWords.slice(0, 5).map((word) => (
                    <div key={word.entryId} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                      <span className="text-sm font-semibold text-kassena-green">{word.kasemText} ({word.englishText})</span>
                      <span className="text-xs font-bold text-slate-600">{word.viewCount} views</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {dictAnalytics.mostFavoritedWords.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-bold text-[#13231a]">Most Favorited Words</h3>
                <div className="mt-2 space-y-2">
                  {dictAnalytics.mostFavoritedWords.slice(0, 5).map((word) => (
                    <div key={word.entryId} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                      <span className="text-sm font-semibold text-kassena-green">{word.kasemText} ({word.englishText})</span>
                      <span className="text-xs font-bold text-slate-600">{word.favCount} favorites</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <footer className="pb-4 text-center text-xs text-slate-500">
          TribeStudio Admin Dashboard
        </footer>
      </div>
    </div>
  )
}

const HorizontalRail = ({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) => (
  <section aria-label={label} className="min-w-0 overflow-x-auto pb-2">
    <div className="flex w-max gap-3 pr-4">{children}</div>
  </section>
)

const MetricCard = ({
  icon,
  label,
  tone,
  value,
}: {
  icon: DashboardIconName
  label: string
  tone: Tone
  value: number
}) => (
  <article className="w-64 shrink-0 rounded-lg border border-[#eadcc7] bg-white p-4 shadow-[0_10px_28px_rgba(88,55,22,0.08)]">
    <div className="flex items-center gap-4">
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${toneStyles[tone].icon}`}
      >
        <DashboardIcon name={icon} className="h-7 w-7" />
      </span>
      <div className="min-w-0">
        <p className="line-clamp-2 text-xs font-semibold text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold leading-none text-[#13231a]">
          {formatNumber(value)}
        </p>
      </div>
    </div>
  </article>
)

const AttentionCard = ({
  action,
  icon,
  title,
  to,
  tone,
  value,
}: {
  action: string
  icon: DashboardIconName
  title: string
  to: string
  tone: Tone
  value: number
}) => (
  <article
    className={`rounded-lg border p-4 ${toneStyles[tone].border} ${toneStyles[tone].subtle}`}
  >
    <div className="flex items-start gap-4">
      <DashboardIcon
        name={icon}
        className={`mt-1 h-8 w-8 shrink-0 ${toneStyles[tone].text}`}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#13231a]">
          <span className="text-xl">{formatNumber(value)}</span> {title}
        </p>
        <p className="mt-1 text-xs text-slate-600">Live queue count</p>
      </div>
    </div>
    <Link
      to={to}
      className={`mt-3 flex min-h-10 items-center justify-between rounded-lg border bg-white/80 px-3 text-xs font-bold transition ${toneStyles[tone].button}`}
    >
      <span>{action}</span>
      <span aria-hidden="true">-&gt;</span>
    </Link>
  </article>
)

const LanguageCorpusGrowth = ({ approved }: { approved: number }) => {
  const percentage = Math.min(100, (approved / DATA_COLLECTION_TARGET) * 100)
  const visiblePercentage = approved > 0 ? Math.max(1.5, percentage) : 0
  const milestones = [100, 500, 1000, 5000, 10000, DATA_COLLECTION_TARGET]
  const nextMilestone =
    milestones.find((milestone) => milestone > approved) ?? DATA_COLLECTION_TARGET
  const remaining = Math.max(0, nextMilestone - approved)

  return (
    <section className="min-w-0 rounded-lg border border-[#eadcc7] bg-white p-4 shadow-[0_10px_32px_rgba(88,55,22,0.08)]">
      <h2 className="flex items-center gap-2 text-base font-bold text-[#13231a]">
        <DashboardIcon name="book" className="h-4 w-4 text-kassena-green" />
        Language Corpus Growth
      </h2>
      <p className="mt-4 text-sm text-slate-700">
        <span className="text-2xl font-bold text-[#13231a]">
          {formatNumber(approved)}
        </span>{' '}
        / {formatNumber(DATA_COLLECTION_TARGET)} verified entries
      </p>
      <div className="mt-4 h-5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-kassena-green"
          style={{ width: `${visiblePercentage}%` }}
        />
      </div>
      <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs font-bold text-slate-600">
        <span>Next milestone: {formatNumber(nextMilestone)} entries</span>
        <span className="text-kassena-green">
          {formatNumber(remaining)} remaining
        </span>
      </div>
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="flex min-w-[34rem] justify-between gap-4">
          {milestones.map((milestone) => (
            <div key={milestone} className="text-center">
              <span
                className={`mx-auto block h-3 w-3 rounded-full ${
                  approved >= milestone ? 'bg-kassena-green' : 'bg-slate-300'
                }`}
              />
              <span className="mt-2 block text-[11px] text-slate-600">
                {formatNumber(milestone)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
        {percentage.toFixed(2)}%
      </span>
    </section>
  )
}

const PipelinePanel = ({ metrics }: { metrics: DashboardMetrics }) => {
  const stages = [
    {
      label: 'Submitted',
      value: metrics.totalContributions,
      tone: 'blue' as Tone,
    },
    {
      label: 'Pending review',
      value: metrics.pendingContributions,
      tone: 'orange' as Tone,
    },
    {
      label: 'Approved',
      value: metrics.approvedContributions,
      tone: 'green' as Tone,
    },
    {
      label: 'Rejected',
      value: metrics.rejectedContributions,
      tone: 'red' as Tone,
    },
    {
      label: 'Published dictionary entries',
      value: metrics.approvedDictionaryEntries,
      tone: 'gold' as Tone,
    },
  ]
  const maxValue = Math.max(...stages.map((stage) => stage.value), 1)

  return (
    <section className="min-w-0 rounded-lg border border-[#eadcc7] bg-white p-4 shadow-[0_10px_32px_rgba(88,55,22,0.08)]">
      <h2 className="text-base font-bold text-[#13231a]">
        Contribution Pipeline
      </h2>
      <div className="mt-4 space-y-3">
        {stages.map((stage) => (
          <div key={stage.label} className="grid grid-cols-[8.5rem_1fr_4rem] items-center gap-3">
            <span className="text-xs font-bold text-slate-700">{stage.label}</span>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${toneStyles[stage.tone].icon}`}
                style={{
                  width: `${Math.max(4, (stage.value / maxValue) * 100)}%`,
                }}
              />
            </div>
            <span className={`text-right text-sm font-bold ${toneStyles[stage.tone].text}`}>
              {formatNumber(stage.value)}
            </span>
          </div>
        ))}
      </div>
      <Link
        to="/admin/submissions"
        className="mt-4 inline-flex text-xs font-bold text-kassena-green hover:text-kassena-orange"
      >
        View contribution records -&gt;
      </Link>
    </section>
  )
}

const RecentActivityPanel = ({ recent }: { recent: Contribution[] }) => (
  <section className="min-w-0 rounded-lg border border-[#eadcc7] bg-white p-4 shadow-[0_10px_32px_rgba(88,55,22,0.08)]">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-base font-bold text-[#13231a]">Recent Contributions</h2>
      <Link
        to="/admin/submissions"
        className="text-xs font-bold text-kassena-green hover:text-kassena-orange"
      >
        View All
      </Link>
    </div>
    <div className="mt-3 overflow-x-auto">
      <div className="min-w-[36rem] divide-y divide-[#eadcc7]">
        {recent.length ? (
          recent.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3">
              <Avatar name={item.contributorName} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-800">
                  <span className="font-semibold">
                    {item.contributorName || 'Unknown contributor'}
                  </span>{' '}
                  {activityVerb(item.status)} {item.englishText || 'entry'}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {item.kasemText || item.category || item.dialect || 'No entry details'}
                </p>
              </div>
              <span className="w-44 shrink-0 text-right text-xs text-slate-500">
                {toDateLabel(item.createdAt)}
              </span>
            </div>
          ))
        ) : (
          <EmptyPanel message="No recent contributions found." />
        )}
      </div>
    </div>
  </section>
)

const TopContributorsPanel = ({
  contributors,
}: {
  contributors: RankedLeaderboardProfile[]
}) => (
  <section className="min-w-0 rounded-lg border border-[#eadcc7] bg-white p-4 shadow-[0_10px_32px_rgba(88,55,22,0.08)]">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-base font-bold text-[#13231a]">
        Top Contributors This Month
      </h2>
      <Link
        to="/leaderboard"
        className="text-xs font-bold text-kassena-green hover:text-kassena-orange"
      >
        View Leaderboard
      </Link>
    </div>
    <div className="mt-3 overflow-x-auto">
      <div className="min-w-[30rem] divide-y divide-[#eadcc7]">
        {contributors.length ? (
          contributors.map((row) => (
            <div key={row.uid} className="flex items-center gap-3 py-3">
              <RankBadge rank={row.rank} />
              <Avatar name={row.displayName} src={row.photoURL} />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">
                {row.displayName}
              </span>
              <span className="shrink-0 text-sm font-bold text-[#13231a]">
                {formatNumber(row.activePoints)} pts
              </span>
            </div>
          ))
        ) : (
          <EmptyPanel message="No leaderboard data found." />
        )}
      </div>
    </div>
  </section>
)

const AdminTeamPanel = ({ users }: { users: AdminUserSummary[] }) => (
  <section className="min-w-0 rounded-lg border border-[#eadcc7] bg-white p-4 shadow-[0_10px_32px_rgba(88,55,22,0.08)]">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-base font-bold text-[#13231a]">Admin Team</h2>
      <Link
        to="/admin/users"
        className="text-xs font-bold text-kassena-green hover:text-kassena-orange"
      >
        Manage Users
      </Link>
    </div>
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[40rem] text-left text-xs">
        <thead className="text-slate-500">
          <tr>
            <th className="py-2 pr-4 font-bold">Name</th>
            <th className="py-2 pr-4 font-bold">Email</th>
            <th className="py-2 pr-4 font-bold">Role</th>
            <th className="py-2 pr-4 font-bold">Status</th>
            <th className="py-2 font-bold">Last Login</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eadcc7]">
          {users.length ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={user.displayName} src={user.photoURL} size="sm" />
                    <span className="font-semibold text-slate-800">
                      {user.displayName || 'Unnamed user'}
                    </span>
                  </div>
                </td>
                <td className="py-2 pr-4 text-slate-600">{user.email || '-'}</td>
                <td className="py-2 pr-4 capitalize text-slate-700">{user.role}</td>
                <td className="py-2 pr-4">
                  <StatusPill status={user.status} />
                </td>
                <td className="py-2 text-slate-600">{toDateLabel(user.lastLoginAt)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-6 text-sm text-slate-500" colSpan={5}>
                No admin or validator accounts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
)

const AuditLogsPanel = ({ logs }: { logs: AuditLogRecord[] }) => (
  <section className="min-w-0 rounded-lg border border-[#eadcc7] bg-white p-4 shadow-[0_10px_32px_rgba(88,55,22,0.08)]">
    <h2 className="text-base font-bold text-[#13231a]">Audit Logs</h2>
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[42rem] text-left text-xs">
        <thead className="text-slate-500">
          <tr>
            <th className="py-2 pr-4 font-bold">Action</th>
            <th className="py-2 pr-4 font-bold">Actor</th>
            <th className="py-2 pr-4 font-bold">Target</th>
            <th className="py-2 font-bold">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eadcc7]">
          {logs.length ? (
            logs.map((log) => (
              <tr key={log.id}>
                <td className="py-2 pr-4 font-semibold text-slate-800">
                  {formatAuditAction(log.action)}
                </td>
                <td className="py-2 pr-4 text-slate-600">
                  {log.actorEmail || log.actorId || 'Unknown actor'}
                </td>
                <td className="py-2 pr-4 text-slate-600">
                  {log.targetCollection}/{log.targetId}
                </td>
                <td className="py-2 text-slate-600">{toDateLabel(log.createdAt)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-6 text-sm text-slate-500" colSpan={4}>
                No audit events found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
)

const EmptyPanel = ({ message }: { message: string }) => (
  <div className="mt-3 rounded-lg border border-dashed border-[#d8cbb8] bg-[#fffaf2] px-4 py-6 text-sm text-slate-500">
    {message}
  </div>
)

const Avatar = ({
  name,
  size = 'md',
  src,
}: {
  name?: string
  size?: 'md' | 'sm'
  src?: string
}) => {
  const classes = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-10 w-10 text-xs'

  return src ? (
    <img
      src={src}
      alt=""
      className={`${classes} shrink-0 rounded-full object-cover ring-2 ring-kassena-cream`}
      referrerPolicy="no-referrer"
    />
  ) : (
    <span
      className={`${classes} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-kassena-green to-[#2f7b4f] font-bold text-white ring-2 ring-kassena-cream`}
    >
      {getInitials(name)}
    </span>
  )
}

const RankBadge = ({ rank }: { rank: number }) => {
  const rankClass =
    rank === 1
      ? 'bg-amber-500 text-white'
      : rank === 2
        ? 'bg-slate-300 text-slate-800'
        : rank === 3
          ? 'bg-orange-600 text-white'
          : 'bg-white text-slate-700'

  return (
    <span
      className={`flex h-7 min-w-7 items-center justify-center rounded-full border border-[#eadcc7] px-2 text-xs font-bold ${rankClass}`}
    >
      {rank}
    </span>
  )
}

const StatusPill = ({ status }: { status: AdminUserSummary['status'] }) => (
  <span
    className={`inline-flex rounded-full px-2 py-1 text-[11px] font-bold capitalize ${
      status === 'active'
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-red-50 text-red-700'
    }`}
  >
    {status}
  </span>
)

const activityVerb = (status: Contribution['status']) => {
  if (status === 'approved') return 'approved'
  if (status === 'rejected') return 'rejected'
  return 'submitted'
}

const formatAuditAction = (action: AuditLogRecord['action']) =>
  action
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ')
