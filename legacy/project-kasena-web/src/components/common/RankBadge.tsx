import type {
  RankIconName,
  RankRequirementStatus,
  RankState,
} from '../../lib/ranks'
import { getRankBadgeImageId } from '../../lib/rankAssets'

const RankIcon = ({
  name,
  className = 'h-5 w-5',
}: {
  name: RankIconName
  className?: string
}) => {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
  }

  switch (name) {
    case 'baobab':
      return (
        <svg {...common}>
          <path d="M12 21V9" />
          <path d="M8 21h8" />
          <path d="M9 12c-3.5.4-5.5-1.2-5.5-3.8C3.5 5.5 5.8 4 8 5.4" />
          <path d="M15 12c3.5.4 5.5-1.2 5.5-3.8 0-2.7-2.3-4.2-4.5-2.8" />
          <path d="M7.5 8.5C8 4.6 10 3 12 3s4 1.6 4.5 5.5" />
          <path d="M9 16 5 20" />
          <path d="m15 16 4 4" />
        </svg>
      )
    case 'book':
      return (
        <svg {...common}>
          <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5v-17Z" />
          <path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H20" />
          <path d="M9 6h7" />
          <path d="M9 9h5" />
        </svg>
      )
    case 'brickWall':
      return (
        <svg {...common}>
          <path d="M4 5h16v15H4z" />
          <path d="M4 10h16" />
          <path d="M4 15h16" />
          <path d="M9 5v5" />
          <path d="M14 10v5" />
          <path d="M9 15v5" />
        </svg>
      )
    case 'compass':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1Z" />
        </svg>
      )
    case 'crest':
      return (
        <svg {...common}>
          <path d="M12 3 5 6.2v5.5c0 4.4 2.8 7.4 7 9.3 4.2-1.9 7-4.9 7-9.3V6.2L12 3Z" />
          <path d="M8 9h8" />
          <path d="M9 13h6" />
        </svg>
      )
    case 'crown':
      return (
        <svg {...common}>
          <path d="M4 17h16" />
          <path d="M5 17 6.5 7l4 5 2.5-7 2.5 7 4-5L20 17" />
          <path d="M7 21h10" />
        </svg>
      )
    case 'drum':
      return (
        <svg {...common}>
          <path d="M8 4h8l1.5 4-1.5 12H8L6.5 8 8 4Z" />
          <path d="M7 8h10" />
          <path d="M7.5 16h9" />
          <path d="m5 6 3 2" />
          <path d="m19 6-3 2" />
        </svg>
      )
    case 'feather':
      return (
        <svg {...common}>
          <path d="M20 4c-7.5.5-12 4.6-12 12v4" />
          <path d="M20 4c.2 7.4-4 12-12 12" />
          <path d="M8 16 4 20" />
        </svg>
      )
    case 'footprints':
      return (
        <svg {...common}>
          <path d="M9 6.2c.5 1.8-.1 3.6-1.4 4S5 9.5 4.5 7.8s.1-3.6 1.4-4S8.5 4.4 9 6.2Z" />
          <path d="M16.4 13.8c.5 1.8-.1 3.6-1.4 4s-2.6-.7-3.1-2.5.1-3.6 1.4-4 2.6.7 3.1 2.5Z" />
          <path d="M7 13.5h.01" />
          <path d="M17.5 7h.01" />
        </svg>
      )
    case 'megaphone':
      return (
        <svg {...common}>
          <path d="M4 13h3l9 4V5L7 9H4v4Z" />
          <path d="M7 13v4a2 2 0 0 0 2 2h1" />
          <path d="M19 9.5v3" />
        </svg>
      )
    case 'monument':
      return (
        <svg {...common}>
          <path d="M4 21h16" />
          <path d="M6 18h12" />
          <path d="M8 18V9h8v9" />
          <path d="M7 9h10l-5-5-5 5Z" />
          <path d="M11 12h2" />
        </svg>
      )
    case 'scale':
      return (
        <svg {...common}>
          <path d="M12 4v17" />
          <path d="M5 7h14" />
          <path d="m6 7-3 6h6L6 7Z" />
          <path d="m18 7-3 6h6l-3-6Z" />
          <path d="M8 21h8" />
        </svg>
      )
    case 'scholarStaff':
      return (
        <svg {...common}>
          <path d="M12 3v18" />
          <path d="M8 7c0-2 1.5-3 4-3s4 1 4 3-1.5 3-4 3-4-1-4-3Z" />
          <path d="M8 14h8" />
          <path d="M9 18h6" />
        </svg>
      )
    case 'scroll':
      return (
        <svg {...common}>
          <path d="M7 5h11a2 2 0 0 1 0 4H7a2 2 0 0 0 0-4Z" />
          <path d="M7 5v14a2 2 0 0 0 2 2h9" />
          <path d="M9 9h9v12" />
          <path d="M11 13h5" />
          <path d="M11 16h4" />
        </svg>
      )
    case 'seal':
      return (
        <svg {...common}>
          <path d="m12 3 2.2 2 3-.2.3 3 2.1 2.2-2.1 2.2-.3 3-3-.2-2.2 2-2.2-2-3 .2-.3-3L4.4 10l2.1-2.2.3-3 3 .2L12 3Z" />
          <path d="m8.5 10 2.3 2.3 4.7-4.8" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 5 6.2v5.5c0 4.4 2.8 7.4 7 9.3 4.2-1.9 7-4.9 7-9.3V6.2L12 3Z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      )
    case 'staff':
      return (
        <svg {...common}>
          <path d="M12 3v18" />
          <path d="M9 6a3 3 0 1 1 3 3" />
          <path d="M8 14h8" />
          <path d="M10 18h4" />
        </svg>
      )
    case 'temple':
      return (
        <svg {...common}>
          <path d="M4 21h16" />
          <path d="M5 8h14" />
          <path d="M7 8v10" />
          <path d="M12 8v10" />
          <path d="M17 8v10" />
          <path d="M4 8 12 3l8 5" />
        </svg>
      )
    case 'huts':
    default:
      return (
        <svg {...common}>
          <path d="M3 12 7 8l4 4" />
          <path d="M5 12v6h4v-6" />
          <path d="m9 12 3-3 3 3" />
          <path d="M11 12v6h4v-6" />
          <path d="m15 12 2-2 4 4" />
          <path d="M17 14v4h3v-4" />
          <path d="M8 9.5 11 8" />
          <path d="m14 8 3 2" />
        </svg>
      )
  }
}

const RequirementIcon = ({ met }: { met: boolean }) => (
  <svg
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    {met ? (
      <path d="m6 12 4 4 8-8" />
    ) : (
      <>
        <path d="M7 11V8a5 5 0 0 1 10 0v3" />
        <path d="M6 11h12v9H6z" />
      </>
    )}
  </svg>
)

const RankBadgeImage = ({
  className,
  fallbackClassName,
  state,
}: {
  className: string
  fallbackClassName: string
  state: RankState
}) => {
  const rank = state.displayRank

  return (
    <span className={`relative flex shrink-0 items-center justify-center ${className}`}>
      <RankIcon name={rank.icon} className={fallbackClassName} />
      <img
        src={`/ranks/${getRankBadgeImageId(state)}.png`}
        alt=""
        className="absolute inset-0 h-full w-full object-contain"
        loading="lazy"
      />
    </span>
  )
}

export const RankBadge = ({
  className = '',
  compact = false,
  state,
}: {
  className?: string
  compact?: boolean
  state: RankState
}) => {
  const rank = state.displayRank
  const title = state.prestigeTitle ?? rank.title
  const subtitle = state.isStaffRank
    ? `Earned: ${state.coreRank.title}`
    : rank.description

  if (compact) {
    return (
      <span
        className={`inline-flex max-w-full items-center gap-1.5 rounded-full bg-gradient-to-br px-3 py-1 text-xs font-black ring-1 ${rank.tone} ${className}`}
      >
        <RankBadgeImage
          state={state}
          className="h-5 w-5"
          fallbackClassName="h-3.5 w-3.5 opacity-30"
        />
        <span className="truncate">{title}</span>
      </span>
    )
  }

  return (
    <div
      className={`overflow-hidden rounded-[18px] border border-[#ead9bd] bg-white shadow-sm ${className}`}
    >
      <div className={`bg-gradient-to-br p-4 ring-1 ring-inset ${rank.tone}`}>
        <div className="flex items-center gap-3">
          <RankBadgeImage
            state={state}
            className="h-16 w-16 rounded-[16px] bg-white/75 shadow-sm"
            fallbackClassName="h-7 w-7 opacity-30"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.12em] opacity-75">
              {state.isStaffRank ? 'Special rank' : rank.colorLabel}
            </p>
            <h3 className="truncate text-xl font-black leading-tight">
              {title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs font-bold opacity-80">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const TrustScoreMeter = ({
  className = '',
  value,
}: {
  className?: string
  value: number
}) => {
  const normalized = Math.max(0, Math.min(100, Math.round(value)))
  const label =
    normalized >= 90
      ? 'Exceptional trust'
      : normalized >= 75
        ? 'Strong trust'
        : normalized >= 50
          ? 'Building trust'
          : 'Trust forming'

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
            Trust Score
          </p>
          <p className="text-sm font-bold text-[#13271d]">{label}</p>
        </div>
        <p className="text-2xl font-black text-[#0b4b2b]">{normalized}%</p>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#eadcc4]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#c96a2d] via-[#caa54a] to-[#14532d] transition-all duration-700"
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  )
}

export const RankRequirementList = ({
  requirements,
}: {
  requirements: RankRequirementStatus[]
}) => {
  if (!requirements.length) {
    return (
      <p className="text-sm font-semibold text-slate-600">
        No extra quality gate for this rank.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {requirements.map((requirement) => (
        <div
          key={requirement.label}
          className={`flex items-center gap-2 text-sm font-bold ${
            requirement.met ? 'text-[#14532d]' : 'text-slate-500'
          }`}
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              requirement.met
                ? 'bg-[#e9f6e8] text-[#14532d]'
                : 'bg-[#f1eadf] text-slate-500'
            }`}
          >
            <RequirementIcon met={requirement.met} />
          </span>
          <span>{requirement.label}</span>
        </div>
      ))}
    </div>
  )
}
