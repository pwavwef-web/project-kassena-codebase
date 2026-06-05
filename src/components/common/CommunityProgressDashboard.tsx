import { DATA_COLLECTION_TARGET } from '../../lib/constants'
import { StatCard } from './StatCard'

interface ProgressDashboardProps {
  approvedEntries: number
  pendingReview: number
  contributors: number
  validationRate: number
}

export const CommunityProgressDashboard = ({
  approvedEntries,
  pendingReview,
  contributors,
  validationRate,
}: ProgressDashboardProps) => {
  const goalProgress = Math.min(100, (approvedEntries / DATA_COLLECTION_TARGET) * 100)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-kassena-green sm:text-2xl">
          Language Preservation Progress
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Approved Entries"
          value={approvedEntries}
          color="green"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Pending Review"
          value={pendingReview}
          color="orange"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Contributors"
          value={contributors}
          color="gold"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          label="Validation Rate"
          value={Math.round(validationRate)}
          suffix="%"
          color="blue"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">
            Progress toward {DATA_COLLECTION_TARGET.toLocaleString()} phrase goal
          </h3>
          <span className="text-sm font-bold text-kassena-orange">
            {goalProgress.toFixed(2)}%
          </span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-kassena-cream">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-kassena-orange to-[#e67e22] transition-all duration-1000 ease-out"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {approvedEntries.toLocaleString()} of {DATA_COLLECTION_TARGET.toLocaleString()} phrases collected
        </p>
      </div>
    </section>
  )
}
