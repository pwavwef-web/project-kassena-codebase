import { AchievementState } from '../lib/achievements'

interface AchievementBadgeCardProps {
  state: AchievementState
  compact?: boolean
}

export function AchievementBadgeCard({
  state,
  compact = false,
}: AchievementBadgeCardProps) {
  const locked = !state.unlocked
  const concealed = Boolean(state.hidden && locked)
  const title = concealed ? 'Hidden Achievement' : state.title
  const condition = concealed
    ? 'Unlock through a rare contribution path.'
    : state.unlockCondition
  const status = state.unlocked ? 'Unlocked' : 'Locked'

  return (
    <article
      className={`min-w-0 rounded-lg border p-4 shadow-sm transition ${
        locked
          ? 'border-ink/10 bg-surface text-ink/65'
          : 'border-emerald-200 bg-white text-ink shadow-emerald-900/5'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-white ring-1 ring-ink/10">
          <img
            src={state.asset}
            alt={state.title}
            className={`h-14 w-14 object-contain ${locked ? 'grayscale opacity-45' : ''}`}
            loading="lazy"
          />
          {locked ? (
            <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-white ring-1 ring-ink/10">
              <img src="/icons/ui/lock.png" alt="" className="h-4 w-4 opacity-65" loading="lazy" />
            </span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                state.unlocked
                  ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                  : 'bg-white text-ink/55 ring-1 ring-ink/10'
              }`}
            >
              {status}
            </span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-ink/50 ring-1 ring-ink/10">
              {state.category}
            </span>
          </div>
          <h3 className={`${compact ? 'mt-2 text-sm' : 'mt-3 text-base'} font-semibold text-ink`}>
            {title}
          </h3>
          {!compact ? (
            <p className="mt-1 text-sm leading-5 text-ink/60">{condition}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold">
          <span className={state.unlocked ? 'text-emerald-800' : 'text-ink/55'}>
            {concealed ? 'Locked' : state.progressText}
          </span>
          {!concealed ? <span className="text-ink/40">{Math.round(state.progress)}%</span> : null}
        </div>
        {!state.unlocked && !concealed ? (
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-terracotta"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        ) : null}
      </div>
    </article>
  )
}
