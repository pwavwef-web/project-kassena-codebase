import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppIcon } from '../../components/common/AppIcon'
import { LoadingState } from '../../components/common/LoadingState'
import { subscribeToDonationAdminDashboard } from '../../lib/firestore'
import { toDateLabel } from '../../lib/date'
import type { CampaignMetrics, Donation, SponsorLead } from '../../types'

const currencyFormatter = new Intl.NumberFormat('en-GH', {
  currency: 'GHS',
  maximumFractionDigits: 0,
  style: 'currency',
})

const numberFormatter = new Intl.NumberFormat('en-US')

const formatCurrency = (value: number) =>
  currencyFormatter.format(Math.max(0, value))

const formatNumber = (value: number) =>
  numberFormatter.format(Math.max(0, Math.round(value)))

const formatTier = (tier: string) =>
  tier
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const defaultMetrics: CampaignMetrics = {
  audioHoursRecorded: 0,
  communitiesReached: 0,
  contributorRewardsPaid: 0,
  contributors: 0,
  contributorsFunded: 0,
  entriesSupported: 0,
  goalAmount: 25000,
  schoolsReached: 0,
  storiesDocumented: 0,
  totalRaised: 0,
  validatedEntries: 0,
  validatorsFunded: 0,
  wordsCollected: 0,
}

export const AdminDonationsPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [campaignMetrics, setCampaignMetrics] =
    useState<CampaignMetrics>(defaultMetrics)
  const [donations, setDonations] = useState<Donation[]>([])
  const [sponsors, setSponsors] = useState<SponsorLead[]>([])

  useEffect(
    () =>
      subscribeToDonationAdminDashboard(
        (payload) => {
          setCampaignMetrics(payload.metrics)
          setDonations(payload.donations)
          setSponsors(payload.sponsors)
          setLoadError('')
          setIsLoading(false)
        },
        (error) => {
          setLoadError(error.message || 'Donation data could not be loaded.')
          setIsLoading(false)
        },
      ),
    [],
  )

  const analytics = useMemo(() => {
    const paidDonations = donations.filter((item) => item.status === 'paid')
    const pendingDonations = donations.filter(
      (item) => item.status === 'pending',
    )
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const isMonth = (item: Donation, month: number, year: number) => {
      const date = item.createdAt?.toDate?.()
      return (
        item.status === 'paid' &&
        date?.getMonth() === month &&
        date.getFullYear() === year
      )
    }
    const monthlyRaised = paidDonations
      .filter((item) => isMonth(item, currentMonth, currentYear))
      .reduce((sum, item) => sum + item.amount, 0)
    const previousMonthlyRaised = paidDonations
      .filter((item) => isMonth(item, previousMonth, previousMonthYear))
      .reduce((sum, item) => sum + item.amount, 0)
    const paidTotal = paidDonations.reduce((sum, item) => sum + item.amount, 0)
    const totalRaised = Math.max(paidTotal, campaignMetrics.totalRaised)
    const tierCounts = paidDonations.reduce<Record<string, number>>(
      (counts, item) => ({
        ...counts,
        [item.tier]: (counts[item.tier] ?? 0) + 1,
      }),
      {},
    )
    const topTier =
      Object.entries(tierCounts).sort(
        (first, second) => second[1] - first[1],
      )[0]?.[0] ?? 'No paid donations yet'
    const donorCounts = paidDonations.reduce<Record<string, number>>(
      (counts, item) => {
        const key = item.email || item.name || item.reference
        return { ...counts, [key]: (counts[key] ?? 0) + 1 }
      },
      {},
    )
    const returningSupporters = Object.values(donorCounts).filter(
      (count) => count > 1,
    ).length
    const growth =
      previousMonthlyRaised > 0
        ? ((monthlyRaised - previousMonthlyRaised) / previousMonthlyRaised) *
          100
        : monthlyRaised > 0
          ? 100
          : 0

    return {
      averageDonation: paidDonations.length
        ? totalRaised / paidDonations.length
        : 0,
      conversionRate: donations.length
        ? (paidDonations.length / donations.length) * 100
        : 0,
      growth,
      monthlyRaised,
      paidDonations,
      pendingDonations,
      returningSupporters,
      sponsorLeads: sponsors.filter((item) => item.status === 'new').length,
      topSupporters: Object.values(
        paidDonations.reduce<
          Record<string, { amount: number; count: number; name: string }>
        >((groups, item) => {
          const key = item.email || item.name || item.reference
          const existing = groups[key] ?? {
            amount: 0,
            count: 0,
            name: item.anonymous ? 'Anonymous Supporter' : item.name,
          }
          return {
            ...groups,
            [key]: {
              amount: existing.amount + item.amount,
              count: existing.count + 1,
              name: existing.name,
            },
          }
        }, {}),
      )
        .sort((first, second) => second.amount - first.amount)
        .slice(0, 6),
      topTier:
        topTier === 'No paid donations yet' ? topTier : formatTier(topTier),
      totalRaised,
    }
  }, [campaignMetrics.totalRaised, donations, sponsors])

  const goalAmount = campaignMetrics.goalAmount || 25000
  const progress = Math.min(100, (analytics.totalRaised / goalAmount) * 100)

  const exportCsv = () => {
    const headers = [
      'Reference',
      'Name',
      'Email',
      'Country',
      'Amount',
      'Tier',
      'Status',
      'Anonymous',
      'Created At',
    ]
    const rows = donations.map((item) => [
      item.reference,
      item.name,
      item.email,
      item.country,
      item.amount,
      item.tier,
      item.status,
      item.anonymous ? 'Yes' : 'No',
      toDateLabel(item.createdAt),
    ])
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','),
      )
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'project-kasena-donations.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

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
          <div>
            <Link
              to="/admin"
              className="mb-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d8cbb8] bg-white px-3 text-sm font-bold text-kassena-green shadow-sm transition hover:bg-kassena-cream/60"
            >
              <AppIcon name="arrow-left" className="h-4 w-4" />
              Admin dashboard
            </Link>
            <h1 className="text-2xl font-bold text-[#13231a] sm:text-3xl">
              Donation Management
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Fundraising, sponsorship, and preservation campaign reporting
            </p>
            {loadError ? (
              <p className="mt-2 text-sm font-semibold text-red-700">
                {loadError}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-kassena-green px-4 text-sm font-black text-white shadow-sm transition hover:bg-[#0f4325]"
          >
            <AppIcon name="download" className="h-5 w-5" />
            Export CSV
          </button>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard
            icon="heart"
            label="Total Raised"
            value={formatCurrency(analytics.totalRaised)}
          />
          <MetricCard
            icon="calendar"
            label="Monthly Raised"
            value={formatCurrency(analytics.monthlyRaised)}
          />
          <MetricCard
            icon="target"
            label="Campaign Progress"
            value={`${progress.toFixed(0)}%`}
          />
          <MetricCard
            icon="activity"
            label="Recent Donations"
            value={formatNumber(donations.length)}
          />
          <MetricCard
            icon="trophy"
            label="Top Supporters"
            value={formatNumber(analytics.topSupporters.length)}
          />
          <MetricCard
            icon="community"
            label="Sponsor Leads"
            value={formatNumber(analytics.sponsorLeads)}
          />
        </section>

        <section className="rounded-lg border border-[#eadcc7] bg-white p-4 shadow-[0_10px_32px_rgba(88,55,22,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-bold text-[#13231a]">
                Kasem Language Preservation Fund
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {formatCurrency(analytics.totalRaised)} raised of{' '}
                {formatCurrency(goalAmount)}
              </p>
            </div>
            <span className="text-sm font-black text-kassena-green">
              {formatCurrency(Math.max(0, goalAmount - analytics.totalRaised))}{' '}
              remaining
            </span>
          </div>
          <div className="mt-4 h-4 overflow-hidden rounded-full bg-[#f4ebd7]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-kassena-orange to-kassena-green"
              style={{ width: `${Math.max(progress ? 2 : 0, progress)}%` }}
            />
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,.85fr)]">
          <Panel title="Recent Donations">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] text-left text-xs">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-2 pr-4 font-bold">Donor</th>
                    <th className="py-2 pr-4 font-bold">Amount</th>
                    <th className="py-2 pr-4 font-bold">Tier</th>
                    <th className="py-2 pr-4 font-bold">Status</th>
                    <th className="py-2 pr-4 font-bold">Reference</th>
                    <th className="py-2 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eadcc7]">
                  {donations.slice(0, 12).map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-4">
                        <p className="font-bold text-[#13231a]">
                          {item.anonymous ? 'Anonymous Supporter' : item.name}
                        </p>
                        <p className="text-slate-500">{item.email || '-'}</p>
                      </td>
                      <td className="py-3 pr-4 font-black text-kassena-green">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {formatTier(item.tier)}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusPill status={item.status} />
                      </td>
                      <td className="py-3 pr-4 text-slate-500">
                        {item.reference}
                      </td>
                      <td className="py-3 text-slate-500">
                        {toDateLabel(item.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!donations.length ? (
                <EmptyPanel message="No donations found." />
              ) : null}
            </div>
          </Panel>

          <Panel title="Top Supporters">
            <div className="space-y-3">
              {analytics.topSupporters.length ? (
                analytics.topSupporters.map((supporter, index) => (
                  <div
                    key={`${supporter.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-lg bg-[#fffaf0] px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#13231a]">
                        {supporter.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {supporter.count} donation
                        {supporter.count === 1 ? '' : 's'}
                      </p>
                    </div>
                    <span className="text-sm font-black text-kassena-green">
                      {formatCurrency(supporter.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <EmptyPanel message="No paid supporters yet." />
              )}
            </div>
          </Panel>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,.85fr)_minmax(0,1fr)]">
          <Panel title="Donation Analytics">
            <div className="grid gap-3 sm:grid-cols-2">
              <AnalyticsTile
                label="Donation Conversion Rate"
                value={`${analytics.conversionRate.toFixed(1)}%`}
              />
              <AnalyticsTile
                label="Average Donation Size"
                value={formatCurrency(analytics.averageDonation)}
              />
              <AnalyticsTile
                label="Top Donation Tier"
                value={analytics.topTier}
              />
              <AnalyticsTile
                label="Returning Supporters"
                value={formatNumber(analytics.returningSupporters)}
              />
              <AnalyticsTile
                label="Funding Growth"
                value={`${analytics.growth.toFixed(1)}%`}
              />
              <AnalyticsTile
                label="Pending Payments"
                value={formatNumber(analytics.pendingDonations.length)}
              />
            </div>
          </Panel>

          <Panel title="Sponsor Leads">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] text-left text-xs">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-2 pr-4 font-bold">Organization</th>
                    <th className="py-2 pr-4 font-bold">Package</th>
                    <th className="py-2 pr-4 font-bold">Amount</th>
                    <th className="py-2 pr-4 font-bold">Contact</th>
                    <th className="py-2 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eadcc7]">
                  {sponsors.slice(0, 10).map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-4 font-bold text-[#13231a]">
                        {item.organization}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {formatTier(item.package)}
                      </td>
                      <td className="py-3 pr-4 font-black text-kassena-green">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        <p>{item.contactName || '-'}</p>
                        <p>{item.contactEmail || '-'}</p>
                      </td>
                      <td className="py-3 capitalize text-slate-700">
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!sponsors.length ? (
                <EmptyPanel message="No sponsor inquiries found." />
              ) : null}
            </div>
          </Panel>
        </section>
      </div>
    </div>
  )
}

const MetricCard = ({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: string
}) => (
  <article className="rounded-lg border border-[#eadcc7] bg-white p-4 shadow-[0_10px_28px_rgba(88,55,22,0.08)]">
    <div className="flex items-center gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fffaf0]">
        <AppIcon name={icon} className="h-8 w-8" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-1 truncate text-xl font-black text-[#13231a]">
          {value}
        </p>
      </div>
    </div>
  </article>
)

const Panel = ({ children, title }: { children: ReactNode; title: string }) => (
  <section className="rounded-lg border border-[#eadcc7] bg-white p-4 shadow-[0_10px_32px_rgba(88,55,22,0.08)]">
    <h2 className="text-base font-bold text-[#13231a]">{title}</h2>
    <div className="mt-3">{children}</div>
  </section>
)

const AnalyticsTile = ({ label, value }: { label: string; value: string }) => (
  <article className="rounded-lg bg-[#fffaf0] p-4">
    <p className="text-xs font-bold text-slate-500">{label}</p>
    <p className="mt-2 text-xl font-black text-[#13231a]">{value}</p>
  </article>
)

const StatusPill = ({ status }: { status: Donation['status'] }) => (
  <span
    className={`inline-flex rounded-full px-2 py-1 text-[11px] font-black capitalize ${
      status === 'paid'
        ? 'bg-emerald-50 text-emerald-700'
        : status === 'failed'
          ? 'bg-red-50 text-red-700'
          : 'bg-amber-50 text-amber-700'
    }`}
  >
    {status}
  </span>
)

const EmptyPanel = ({ message }: { message: string }) => (
  <div className="mt-3 rounded-lg border border-dashed border-[#d8cbb8] bg-[#fffaf0] px-4 py-6 text-sm text-slate-500">
    {message}
  </div>
)
