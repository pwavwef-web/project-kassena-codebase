import { Link } from 'react-router-dom'
import { AppIcon } from './AppIcon'
import { EmptyState } from './EmptyState'

interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  avatar?: string
}

interface LeaderboardPreviewProps {
  entries: LeaderboardEntry[]
  isLoading?: boolean
}

const rankColors: Record<number, string> = {
  1: 'bg-yellow-400 text-yellow-900',
  2: 'bg-slate-300 text-slate-700',
  3: 'bg-amber-600 text-amber-50',
}

export const LeaderboardPreview = ({
  entries,
  isLoading = false,
}: LeaderboardPreviewProps) => {
  if (isLoading) {
    return (
      <div className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-slate-100 animate-pulse sm:rounded-2xl sm:p-6">
        <div className="h-4 w-40 rounded bg-slate-200 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-slate-200" />
            <div className="flex-1">
              <div className="h-3 w-1/2 rounded bg-slate-200 mb-1" />
              <div className="h-2 w-1/4 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!entries.length) {
    return (
      <div className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-2xl sm:p-6">
        <h3 className="mb-3 text-base font-black text-kassena-green sm:mb-4 sm:text-lg">Top Contributors This Month</h3>
        <EmptyState message="No contributions yet. Be the first!" />
        <Link
          to="/leaderboard"
          className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-kassena-cream bg-kassena-cream/50 py-2 text-sm font-semibold text-kassena-green transition-all hover:bg-kassena-cream hover:text-kassena-orange"
        >
          View Full Leaderboard
          <AppIcon name="chevronRight" className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <article className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-2xl sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
        <h3 className="text-base font-black text-kassena-green sm:text-lg">Top Contributors This Month</h3>
        <div className="flex items-center gap-1 text-kassena-gold">
          <AppIcon name="star" className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-2">
        {entries.slice(0, 4).map((entry) => (
          <div
            key={entry.rank}
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50"
          >
            <span
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                rankColors[entry.rank] || 'bg-slate-100 text-slate-600'
              }`}
            >
              {entry.rank}
            </span>

            {entry.avatar ? (
              <img
                src={entry.avatar}
                alt=""
                className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-kassena-green to-kassena-dark text-xs font-bold text-white">
                {entry.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{entry.name}</p>
              <p className="text-xs text-slate-500">{entry.points} points</p>
            </div>

            {entry.rank <= 3 && (
              <AppIcon name="trophy" className="h-6 w-6" />
            )}
          </div>
        ))}
      </div>

      <Link
        to="/leaderboard"
        className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-kassena-cream bg-kassena-cream/50 py-2 text-sm font-semibold text-kassena-green transition-all hover:bg-kassena-cream hover:text-kassena-orange"
      >
        View Full Leaderboard
        <AppIcon name="chevronRight" className="h-4 w-4" />
      </Link>
    </article>
  )
}
