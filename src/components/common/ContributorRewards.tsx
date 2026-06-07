import { EmptyState } from './EmptyState'
import { AppIcon } from './AppIcon'

interface RewardsData {
  currentPoints: number
  pointsPerContribution: number
  threshold: number
  nextRewardName: string
}

interface ContributorRewardsProps {
  data: RewardsData | null
  isLoading?: boolean
}

export const ContributorRewards = ({ data, isLoading = false }: ContributorRewardsProps) => {
  if (isLoading) {
    return (
      <div className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-slate-100 animate-pulse sm:rounded-2xl sm:p-6">
        <div className="h-4 w-24 rounded bg-slate-200 mb-4" />
        <div className="h-8 w-32 rounded bg-slate-200 mb-4" />
        <div className="h-3 w-full rounded bg-slate-200" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-2xl sm:p-6">
        <EmptyState message="Sign in to start earning rewards!" />
      </div>
    )
  }

  const progress = Math.min(100, (data.currentPoints / data.threshold) * 100)
  const pointsNeeded = Math.max(0, data.threshold - data.currentPoints)

  return (
    <article className="group relative overflow-hidden rounded-[18px] bg-gradient-to-br from-kassena-gold/20 via-white to-kassena-orange/10 p-4 shadow-sm ring-1 ring-kassena-gold/20 transition-all hover:shadow-md sm:rounded-2xl sm:p-8">
      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2 sm:mb-4">
          <div className="rounded-xl bg-kassena-gold/10 p-2">
            <AppIcon name="star" className="h-5 w-5" />
          </div>
          <h2 className="text-base font-black text-kassena-green sm:text-lg">
            Earn Rewards
          </h2>
        </div>

        <div className="mb-1 flex items-baseline gap-2 sm:mb-2">
          <span className="text-3xl font-black text-kassena-orange sm:text-4xl">{data.currentPoints}</span>
          <span className="text-sm text-slate-500">points</span>
        </div>

        <p className="mb-3 text-xs text-slate-600 sm:mb-4 sm:text-sm">
          <span className="font-semibold text-kassena-green">{data.pointsPerContribution}</span> points per approved contribution
        </p>

        <div className="mb-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100 sm:mb-4 sm:p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-500">Next reward</span>
            <span className="shrink-0 text-xs font-bold text-kassena-green">
              {pointsNeeded} points to go
            </span>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-kassena-cream">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-kassena-gold to-kassena-orange transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {data.threshold} points = <span className="font-semibold text-kassena-orange">{data.nextRewardName}</span>
          </p>
        </div>

        <div className="flex items-start gap-2 text-xs leading-5 text-slate-500">
          <AppIcon name="info" className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>
            Earn points by contributing words, phrases, and cultural content. Rewards include airtime, data, and community recognition.
          </p>
        </div>
      </div>
    </article>
  )
}
