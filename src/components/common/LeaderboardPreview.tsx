import { Link } from 'react-router-dom'
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
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 animate-pulse">
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
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="text-lg font-bold text-kassena-green mb-4">Top Contributors This Month</h3>
        <EmptyState message="No contributions yet. Be the first!" />
      </div>
    )
  }

  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-kassena-green">Top Contributors This Month</h3>
        <div className="flex items-center gap-1 text-kassena-gold">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        {entries.slice(0, 5).map((entry) => (
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
              <span className="text-lg">
                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
              </span>
            )}
          </div>
        ))}
      </div>

      <Link
        to="/profile"
        className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-kassena-cream bg-kassena-cream/50 py-2 text-sm font-semibold text-kassena-green transition-all hover:bg-kassena-cream hover:text-kassena-orange"
      >
        View Full Leaderboard
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </article>
  )
}
