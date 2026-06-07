import { EmptyState } from './EmptyState'

interface ActivityItem {
  id: string
  type: 'contribution' | 'proverb' | 'points' | 'dialect' | 'upload'
  message: string
  timestamp: string
}

interface CommunityActivityFeedProps {
  activities: ActivityItem[]
  isLoading?: boolean
}

const activityIcons: Record<ActivityItem['type'], { bg: string; icon: React.ReactNode }> = {
  contribution: {
    bg: 'bg-green-100 text-green-600',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  proverb: {
    bg: 'bg-purple-100 text-purple-600',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
  points: {
    bg: 'bg-yellow-100 text-yellow-600',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  dialect: {
    bg: 'bg-blue-100 text-blue-600',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
  },
  upload: {
    bg: 'bg-orange-100 text-orange-600',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
}

export const CommunityActivityFeed = ({
  activities,
  isLoading = false,
}: CommunityActivityFeedProps) => {
  if (isLoading) {
    return (
      <div className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-slate-100 animate-pulse sm:rounded-2xl sm:p-6">
        <div className="h-4 w-32 rounded bg-slate-200 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-slate-200" />
            <div className="flex-1">
              <div className="h-3 w-3/4 rounded bg-slate-200 mb-1" />
              <div className="h-2 w-1/4 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!activities.length) {
    return (
      <div className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-2xl sm:p-6">
        <h3 className="mb-3 text-base font-black text-kassena-green sm:mb-4 sm:text-lg">Community Activity</h3>
        <EmptyState message="No recent activity. Be the first to contribute!" />
      </div>
    )
  }

  return (
    <article className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-2xl sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
        <h3 className="text-base font-black text-kassena-green sm:text-lg">Community Activity</h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse-soft" />
          Live
        </span>
      </div>

      <div className="max-h-64 space-y-2 overflow-y-auto scrollbar-hide sm:max-h-80 sm:space-y-3">
        {activities.map((activity) => {
          const iconStyle = activityIcons[activity.type]
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50"
            >
              <div className={`flex-shrink-0 rounded-full p-1.5 ${iconStyle.bg}`}>
                {iconStyle.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-snug text-slate-700 sm:text-sm">{activity.message}</p>
                <p className="mt-0.5 text-xs text-slate-400">{activity.timestamp}</p>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}
