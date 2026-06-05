import { EmptyState } from './EmptyState'

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
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 animate-pulse">
        <div className="h-4 w-24 rounded bg-slate-200 mb-4" />
        <div className="h-8 w-32 rounded bg-slate-200 mb-4" />
        <div className="h-3 w-full rounded bg-slate-200" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <EmptyState message="Sign in to start earning rewards!" />
      </div>
    )
  }

  const progress = Math.min(100, (data.currentPoints / data.threshold) * 100)
  const pointsNeeded = Math.max(0, data.threshold - data.currentPoints)

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-kassena-gold/20 via-white to-kassena-orange/10 p-6 shadow-sm ring-1 ring-kassena-gold/20 transition-all hover:shadow-md sm:p-8">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-kassena-gold/10 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-xl bg-kassena-gold/10 p-2">
            <svg className="h-5 w-5 text-kassena-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-kassena-green">Earn Rewards</h2>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-extrabold text-kassena-orange">{data.currentPoints}</span>
          <span className="text-sm text-slate-500">points</span>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          <span className="font-semibold text-kassena-green">{data.pointsPerContribution}</span> points per approved contribution
        </p>

        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Next reward</span>
            <span className="text-xs font-bold text-kassena-green">
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

        <div className="flex items-start gap-2 text-xs text-slate-500">
          <svg className="h-4 w-4 mt-0.5 text-kassena-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            Earn points by contributing words, phrases, and cultural content. Rewards include airtime, data, and community recognition.
          </p>
        </div>
      </div>
    </article>
  )
}
