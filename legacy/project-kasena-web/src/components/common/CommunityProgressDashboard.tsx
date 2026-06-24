import { DATA_COLLECTION_TARGET } from '../../lib/constants'
import { AppIcon } from './AppIcon'
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
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-kassena-green sm:text-2xl">
          Language Preservation Progress
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Approved Entries"
          value={approvedEntries}
          color="green"
          icon={<AppIcon name="check" className="h-full w-full" />}
        />
        <StatCard
          label="Pending Review"
          value={pendingReview}
          color="orange"
          icon={<AppIcon name="timeline" className="h-full w-full" />}
        />
        <StatCard
          label="Contributors"
          value={contributors}
          color="gold"
          icon={<AppIcon name="users" className="h-full w-full" />}
        />
        <StatCard
          label="Validation Rate"
          value={Math.round(validationRate)}
          suffix="%"
          color="blue"
          icon={<AppIcon name="analytics" className="h-full w-full" />}
        />
      </div>

      <div className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-2xl sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-slate-700 sm:text-sm">
            Progress toward {DATA_COLLECTION_TARGET.toLocaleString()} phrase goal
          </h3>
          <span className="shrink-0 text-xs font-black text-kassena-orange sm:text-sm">
            {goalProgress.toFixed(2)}%
          </span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-kassena-cream">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-kassena-orange to-[#e67e22] transition-all duration-1000 ease-out"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] font-medium text-slate-500 sm:text-xs">
          {approvedEntries.toLocaleString()} of {DATA_COLLECTION_TARGET.toLocaleString()} phrases collected
        </p>
      </div>
    </section>
  )
}
