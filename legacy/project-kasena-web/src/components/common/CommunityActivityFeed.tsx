import { EmptyState } from './EmptyState'
import { AppIcon } from './AppIcon'

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
    bg: '',
    icon: <AppIcon name="check" className="h-full w-full" />,
  },
  proverb: {
    bg: '',
    icon: <AppIcon name="proverb" className="h-full w-full" />,
  },
  points: {
    bg: '',
    icon: <AppIcon name="points" className="h-full w-full" />,
  },
  dialect: {
    bg: '',
    icon: <AppIcon name="globe" className="h-full w-full" />,
  },
  upload: {
    bg: '',
    icon: <AppIcon name="upload" className="h-full w-full" />,
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
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center ${iconStyle.bg}`}>
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
