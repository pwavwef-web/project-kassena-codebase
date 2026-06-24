import type { AchievementId, AchievementState } from '../../lib/achievements'
import { AppIcon } from './AppIcon'

interface AchievementBadgeArtworkProps {
  id: AchievementId
  title: string
  unlocked?: boolean
  className?: string
}

interface AchievementBadgeCardProps {
  state: AchievementState
  className?: string
  compact?: boolean
}

const getAchievementBadgeSrc = (id: AchievementId): string =>
  `/achievements/${id}.png`

export const AchievementBadgeArtwork = ({
  id,
  title,
  unlocked = true,
  className = 'h-20 w-20',
}: AchievementBadgeArtworkProps) => (
  <img
    src={getAchievementBadgeSrc(id)}
    alt={title}
    className={`${className} object-contain transition ${
      unlocked ? '' : 'grayscale'
    }`}
    loading="lazy"
  />
)

export const AchievementBadgeCard = ({
  state,
  className = '',
  compact = false,
}: AchievementBadgeCardProps) => {
  const locked = !state.unlocked

  return (
    <article
      className={`relative min-w-0 rounded-[18px] border p-3 text-center shadow-[0_10px_24px_rgba(71,44,18,0.07)] ${
        locked
          ? 'border-[#ddd8cd] bg-[#f7f7f4] text-slate-500'
          : 'border-[#e2bd5a] bg-[#fffaf0] text-[#143829]'
      } ${className}`}
    >
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
        <AchievementBadgeArtwork
          id={state.id}
          title={state.title}
          unlocked={state.unlocked}
          className={`h-20 w-20 ${locked ? 'opacity-45' : ''}`}
        />
        {locked ? (
          <span className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
            <AppIcon name="lock" className="h-full w-full" />
          </span>
        ) : null}
      </div>
      <h3
        className={`mt-3 font-black leading-4 ${
          compact ? 'text-xs' : 'text-sm'
        }`}
      >
        {state.title}
      </h3>
      {!compact ? (
        <p className="mt-2 min-h-10 text-xs font-semibold leading-5 text-slate-600">
          {state.unlockCondition}
        </p>
      ) : null}
      <p
        className={`mt-2 text-[11px] font-black ${
          state.unlocked ? 'text-kassena-green' : 'text-slate-500'
        }`}
      >
        {state.progressText}
      </p>
      {!state.unlocked ? (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e2ded5]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2d9749] to-[#d99a1b]"
            style={{ width: `${state.progress}%` }}
          />
        </div>
      ) : null}
      {state.hidden ? (
        <span className="mt-3 inline-flex rounded-full bg-[#172d23] px-2.5 py-1 text-[10px] font-black uppercase tracking-normal text-[#f0bf3d]">
          Hidden unlocked
        </span>
      ) : null}
    </article>
  )
}
