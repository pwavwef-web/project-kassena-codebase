import type { ReactNode } from 'react'
import type { AchievementId, AchievementState } from '../../lib/achievements'

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

const palette = (unlocked: boolean) => ({
  amber: unlocked ? '#d99a1b' : '#a7a7a7',
  brown: unlocked ? '#7a3f19' : '#777777',
  cream: unlocked ? '#fff2c2' : '#e9e9e9',
  gold: unlocked ? '#f0bf3d' : '#c9c9c9',
  green: unlocked ? '#14532d' : '#8a8a8a',
  orange: unlocked ? '#c96a2d' : '#9a9a9a',
  slate: unlocked ? '#153528' : '#777777',
  teal: unlocked ? '#2c8f84' : '#a4a4a4',
  white: unlocked ? '#fffdf4' : '#f3f3f3',
})

const BadgeShell = ({
  children,
  title,
  unlocked,
  className = '',
}: {
  children: ReactNode
  title: string
  unlocked: boolean
  className?: string
}) => {
  const colors = palette(unlocked)

  return (
    <svg
      className={className}
      fill="none"
      role="img"
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <circle
        cx="64"
        cy="64"
        r="56"
        stroke={colors.gold}
        strokeDasharray="7 7"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <circle
        cx="64"
        cy="64"
        r="46"
        stroke={colors.green}
        strokeOpacity="0.45"
        strokeWidth="3"
      />
      {children}
    </svg>
  )
}

const LockIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
    <path
      d="M7 11V8a5 5 0 0 1 10 0v3"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M6 11h12v9H6z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)

export const AchievementBadgeArtwork = ({
  id,
  title,
  unlocked = true,
  className = 'h-20 w-20',
}: AchievementBadgeArtworkProps) => {
  const colors = palette(unlocked)
  const stroke = {
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 5,
  }
  const thin = {
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 3.5,
  }

  const artwork = (() => {
    switch (id) {
      case 'first-word':
        return (
          <>
            <path d="M28 84c16-10 44-10 72 0" stroke={colors.brown} {...stroke} />
            <path d="M64 80V52" stroke={colors.green} {...stroke} />
            <path d="M64 62c-16-2-20-14-20-14 15-2 21 5 20 14Z" fill={colors.green} />
            <path d="M65 56c12-13 25-9 25-9-3 15-14 19-25 9Z" fill={colors.teal} />
            <circle cx="64" cy="42" r="5" fill={colors.gold} />
          </>
        )
      case 'rising-voice':
        return (
          <>
            <path d="M35 44h42c9 0 16 7 16 15s-7 15-16 15H58L43 87v-13h-8c-8 0-15-7-15-15s7-15 15-15Z" fill={colors.white} stroke={colors.green} {...thin} />
            <path d="M42 59h33M42 68h20" stroke={colors.orange} {...thin} />
            <path d="M91 24 86 39l-15 5 15 5 5 15 5-15 15-5-15-5-5-15Z" fill={colors.gold} />
          </>
        )
      case 'language-keeper':
        return (
          <>
            <path d="M31 39h28c8 0 12 5 12 12v37c-4-5-9-7-16-7H31V39Z" fill={colors.white} stroke={colors.green} {...thin} />
            <path d="M71 51c0-7 4-12 12-12h17v42H84c-7 0-12 2-13 7V51Z" fill={colors.cream} stroke={colors.green} {...thin} />
            <path d="M84 52 97 58v12c0 10-5 17-13 21-8-4-13-11-13-21V58l13-6Z" fill={colors.green} />
            <path d="m78 71 6 6 11-14" stroke={colors.gold} {...thin} />
          </>
        )
      case 'word-hunter':
        return (
          <>
            <circle cx="57" cy="57" r="24" stroke={colors.green} strokeWidth="7" />
            <path d="m75 75 24 24" stroke={colors.brown} {...stroke} />
            <text fill={colors.gold} fontFamily="serif" fontSize="22" fontWeight="700" x="43" y="64">
              KS
            </text>
            <path d="M39 37c8-7 23-8 33 1" stroke={colors.teal} {...thin} />
          </>
        )
      case 'story-weaver':
        return (
          <>
            <path d="M30 46h68l-8 43H38L30 46Z" fill={colors.cream} stroke={colors.brown} {...thin} />
            <path d="M38 46c6 16 15 30 27 43M55 46c5 16 12 30 22 43M72 46c3 15 7 29 13 43" stroke={colors.orange} {...thin} />
            <path d="M34 58h60M32 72h62M38 86h52" stroke={colors.green} {...thin} />
            <path d="M45 42c7-12 31-12 38 0" stroke={colors.gold} {...thin} />
          </>
        )
      case 'sentence-builder':
        return (
          <>
            <path d="M35 35h56c5 0 8 4 8 8v15H35c-6 0-10-4-10-10s4-13 10-13Z" fill={colors.cream} stroke={colors.green} {...thin} />
            <path d="M28 59h58c6 0 10 5 10 10s-4 10-10 10H28V59Z" fill={colors.white} stroke={colors.orange} {...thin} />
            <path d="M34 80h55c6 0 10 4 10 10s-4 10-10 10H34c-5 0-9-4-9-10s4-10 9-10Z" fill={colors.cream} stroke={colors.green} {...thin} />
            <path d="M44 47h32M43 69h40M43 91h31" stroke={colors.slate} {...thin} />
          </>
        )
      case 'dialect-guardian':
        return (
          <>
            <path d="M26 64 42 50l16 14v27H26V64ZM51 60l13-12 13 12v31H51V60ZM76 64l16-14 16 14v27H76V64Z" fill={colors.cream} stroke={colors.green} {...thin} />
            <path d="M42 74v17M64 72v19M92 74v17" stroke={colors.brown} {...thin} />
            <path d="M58 55c-5-7-15-7-20 0M76 55c6-7 16-7 21 0" stroke={colors.gold} {...thin} />
          </>
        )
      case 'audio-pioneer':
        return (
          <>
            <path d="M36 48h38v42c0 10-8 17-19 17S36 100 36 90V48Z" fill={colors.brown} stroke={colors.gold} {...thin} />
            <path d="M36 49c0-8 8-14 19-14s19 6 19 14-8 14-19 14-19-6-19-14Z" fill={colors.orange} stroke={colors.gold} {...thin} />
            <path d="M45 64h20M45 77h20M83 36a8 8 0 0 1 16 0v26a8 8 0 0 1-16 0V36Z" stroke={colors.green} {...thin} />
            <path d="M77 57c0 12 8 20 14 20s14-8 14-20M91 77v14" stroke={colors.green} {...thin} />
          </>
        )
      case 'cultural-archivist':
        return (
          <>
            <path d="M35 37h58c-7 7-7 17 0 24H35c-7-7-7-17 0-24Z" fill={colors.cream} stroke={colors.brown} {...thin} />
            <path d="M35 61h58c-7 7-7 17 0 24H35c-7-7-7-17 0-24Z" fill={colors.white} stroke={colors.brown} {...thin} />
            <path d="M45 49h36M45 73h36" stroke={colors.green} {...thin} />
            <path d="M29 38c-8 5-8 18 0 23M99 61c8 5 8 18 0 23" stroke={colors.gold} strokeDasharray="2 7" {...thin} />
          </>
        )
      case 'community-helper':
        return (
          <>
            <path d="M33 77c11-6 19-6 30 0M95 77c-11-6-19-6-30 0" stroke={colors.orange} {...stroke} />
            <path d="M34 72 20 58c-5-5 2-13 8-8l18 17M94 72l14-14c5-5-2-13-8-8L82 67" fill={colors.cream} stroke={colors.brown} {...thin} />
            <rect fill={colors.white} height="30" rx="8" stroke={colors.green} strokeWidth="4" width="52" x="38" y="48" />
            <text fill={colors.green} fontFamily="serif" fontSize="20" fontWeight="700" x="49" y="69">
              KA
            </text>
          </>
        )
      case 'knowledge-river':
        return (
          <>
            <path d="M25 86c20-30 42 8 62-22 7-10 13-15 20-17" stroke={colors.teal} strokeWidth="12" strokeLinecap="round" />
            <path d="M24 76c19-25 42 8 60-19 8-11 14-17 24-20" stroke={colors.gold} strokeWidth="4" strokeLinecap="round" />
            <text fill={colors.white} fontFamily="serif" fontSize="13" fontWeight="700" x="42" y="78">
              words
            </text>
            <circle cx="86" cy="44" r="5" fill={colors.gold} />
            <circle cx="98" cy="35" r="3" fill={colors.cream} />
          </>
        )
      case 'elders-trust':
        return (
          <>
            <path d="M58 26c9 6 13 15 8 27l-9 22c-5 12-2 21 9 27" stroke={colors.brown} strokeWidth="10" strokeLinecap="round" />
            <circle cx="68" cy="51" r="15" stroke={colors.gold} strokeWidth="7" />
            <path d="M47 100h31M50 89h26" stroke={colors.green} {...thin} />
          </>
        )
      case 'bounty-hunter':
        return (
          <>
            <path d="M31 100 96 35M97 100 32 35" stroke={colors.brown} strokeWidth="7" strokeLinecap="round" />
            <path d="m96 35 1-15 11 10-12 5ZM32 35l-1-15-11 10 12 5Z" fill={colors.gold} />
            <circle cx="64" cy="66" r="18" fill={colors.gold} stroke={colors.brown} strokeWidth="4" />
            <path d="M56 66h16M64 58v16" stroke={colors.white} {...thin} />
          </>
        )
      case 'school-champion':
        return (
          <>
            <path d="M64 28 94 41v25c0 20-13 31-30 39-17-8-30-19-30-39V41l30-13Z" fill={colors.white} stroke={colors.green} {...thin} />
            <path d="M50 56h28M50 68h28M64 43v48" stroke={colors.orange} {...thin} />
            <path d="M30 75c-9-12-7-28 6-36M98 75c9-12 7-28-6-36" stroke={colors.gold} {...thin} />
            <path d="M44 96c8 6 32 6 40 0" stroke={colors.gold} {...thin} />
          </>
        )
      case 'community-champion':
        return (
          <>
            <path d="M42 43 53 58l11-24 11 24 11-15 3 32H39l3-32Z" fill={colors.gold} stroke={colors.brown} {...thin} />
            <path d="M28 84h80M34 84V68l12-10 12 10v16M64 84V64l13-11 13 11v20" fill={colors.cream} stroke={colors.green} {...thin} />
            <path d="M44 84V73M77 84V72" stroke={colors.brown} {...thin} />
          </>
        )
      case 'consistency-master':
        return (
          <>
            <circle cx="37" cy="38" fill={colors.gold} r="18" />
            <path d="M30 88c14-12 49-12 64 0" stroke={colors.green} {...stroke} />
            <path d="M65 92V48M52 65c10 0 13-9 13-9s-10-3-17 5M66 71c15-1 19-13 19-13s-16-4-26 7" stroke={colors.brown} {...thin} />
            <path d="M55 91c0-15 7-25 18-32" stroke={colors.green} {...thin} />
          </>
        )
      case 'midnight-scholar':
        return (
          <>
            <path d="M48 30c-11 13-5 34 12 39 13 4 27-2 34-13-1 22-19 39-41 39-18 0-33-11-39-27 12 8 28 5 38-5 9-10 10-25-4-33Z" fill={colors.slate} />
            <path d="M45 76h48v25H45z" fill={colors.cream} stroke={colors.gold} {...thin} />
            <path d="M55 85h25M55 94h17M91 33l3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9Z" fill={colors.gold} />
          </>
        )
      case 'word-of-the-day-explorer':
        return (
          <>
            <path d="M34 48h32c8 0 12 5 12 12v35c-5-4-10-6-18-6H34V48Z" fill={colors.white} stroke={colors.green} {...thin} />
            <path d="M78 60c0-7 4-12 12-12h12v41H90c-7 0-12 2-12 6V60Z" fill={colors.cream} stroke={colors.green} {...thin} />
            <circle cx="63" cy="55" r="23" fill={colors.teal} fillOpacity="0.2" stroke={colors.gold} strokeWidth="4" />
            <path d="m64 41 7 18-18 7 7-18 4-7Z" fill={colors.orange} />
          </>
        )
      case 'knowledge-sharer':
        return (
          <>
            <path d="M24 61 105 31 80 98 63 73 24 61Z" fill={colors.white} stroke={colors.green} {...thin} />
            <path d="M63 73 105 31M39 60l22 7" stroke={colors.orange} {...thin} />
            <text fill={colors.gold} fontFamily="serif" fontSize="13" fontWeight="700" x="40" y="48">
              word
            </text>
            <path d="M83 36c8 3 14 9 18 17" stroke={colors.gold} strokeDasharray="3 6" {...thin} />
          </>
        )
      case 'verification-legend':
        return (
          <>
            <rect fill={colors.gold} height="42" rx="8" stroke={colors.brown} strokeWidth="4" width="58" x="35" y="50" />
            <path d="M47 70h36M51 81h28" stroke={colors.white} {...thin} />
            <path d="m49 35 15-12 15 12v15H49V35Z" fill={colors.green} stroke={colors.gold} {...thin} />
            <path d="m55 42 7 7 14-17" stroke={colors.white} {...thin} />
            <path d="M41 100h52" stroke={colors.brown} {...stroke} />
          </>
        )
      case 'corpus-builder':
        return (
          <>
            <path d="M35 88h58v13H35zM43 70h42v18H43zM51 52h26v18H51z" fill={colors.cream} stroke={colors.green} {...thin} />
            <text fill={colors.orange} fontFamily="serif" fontSize="12" fontWeight="700" x="53" y="64">
              KA
            </text>
            <text fill={colors.gold} fontFamily="serif" fontSize="12" fontWeight="700" x="46" y="82">
              words
            </text>
            <path d="M37 40h14M69 36h18M82 48h12" stroke={colors.gold} {...thin} />
          </>
        )
      case 'ai-trainer':
        return (
          <>
            <path d="M34 40h60v58H34z" fill={colors.slate} fillOpacity="0.08" stroke={colors.green} {...thin} />
            <path d="M44 51h16v16H44zM72 51h16v16H72zM44 77h16v16H44zM72 77h16v16H72z" fill={colors.teal} />
            <path d="M60 59h12M60 85h12M52 67v10M80 67v10M34 59H22M94 59h12M34 85H22M94 85h12" stroke={colors.gold} {...thin} />
            <path d="M64 31c13 12 13 22 0 34-13-12-13-22 0-34Z" fill={colors.orange} stroke={colors.brown} strokeWidth="3" />
          </>
        )
      case 'language-hero':
        return (
          <>
            <path d="M64 28a14 14 0 1 0 0 28 14 14 0 0 0 0-28Z" fill={colors.slate} />
            <path d="M38 101c4-24 15-37 26-37s22 13 26 37H38Z" fill={colors.green} />
            <path d="M44 70 27 86M84 70l17 16" stroke={colors.brown} strokeWidth="8" strokeLinecap="round" />
            <path d="M51 69h38v28H51z" fill={colors.gold} stroke={colors.white} {...thin} />
            <path d="M62 78h17M62 88h12" stroke={colors.white} {...thin} />
          </>
        )
      case 'kasena-legend':
        return (
          <>
            <path d="M34 49 48 68l16-34 16 34 14-19 5 44H29l5-44Z" fill={colors.gold} stroke={colors.brown} {...thin} />
            <circle cx="48" cy="68" r="5" fill={colors.white} />
            <circle cx="64" cy="42" r="5" fill={colors.white} />
            <circle cx="80" cy="68" r="5" fill={colors.white} />
            <text fill={colors.green} fontFamily="serif" fontSize="16" fontWeight="700" x="49" y="86">
              KA
            </text>
          </>
        )
      case 'living-archive':
        return (
          <>
            <path d="M60 94V48M48 92c9-15 16-23 32-34M74 93C66 76 58 66 42 55" stroke={colors.brown} strokeWidth="9" strokeLinecap="round" />
            <path d="M36 52c2-18 20-27 32-15 12-12 30-3 32 15-14 8-25 7-32-1-7 8-18 9-32 1Z" fill={colors.green} />
            <path d="M38 100c14-9 47-9 62 0M58 101l-12 12M69 101l8 12M80 100l18 10" stroke={colors.teal} {...thin} />
            <rect fill={colors.gold} height="6" rx="2" width="6" x="45" y="108" />
            <rect fill={colors.gold} height="6" rx="2" width="6" x="75" y="108" />
          </>
        )
      case 'last-word':
        return (
          <>
            <path d="M41 44h47c7 0 12 5 12 12v39H53c-8 0-14-6-14-14V46c0-1 1-2 2-2Z" fill={colors.cream} stroke={colors.brown} {...thin} />
            <path d="M54 57h29M54 68h22" stroke={colors.green} {...thin} />
            <circle cx="45" cy="82" r="13" stroke={colors.gold} strokeWidth="6" />
            <path d="M55 82h39l7 7M82 82v9M71 82v7" stroke={colors.gold} {...stroke} />
          </>
        )
      case 'revivalist':
        return (
          <>
            <path d="M64 29c15 19 7 28 21 42 8 8 6 24-3 32 0-15-12-18-18-31-5 12-18 18-18 31-10-9-12-24-3-35 10-12 8-25 21-39Z" fill={colors.orange} stroke={colors.gold} {...thin} />
            <path d="M54 86c8-8 17-8 25 0" stroke={colors.white} {...thin} />
            <text fill={colors.white} fontFamily="serif" fontSize="18" fontWeight="700" x="53" y="72">
              KS
            </text>
          </>
        )
      case 'perfect-scholar':
        return (
          <>
            <path d="M64 28 96 45 88 92 64 106 40 92 32 45l32-17Z" fill={colors.white} stroke={colors.teal} strokeWidth="5" />
            <path d="m48 63 8 8 17-20M49 84l6 6 13-13M72 84l6 6 13-13" stroke={colors.green} {...thin} />
            <path d="M42 45h44" stroke={colors.gold} {...thin} />
          </>
        )
      case 'triple-threat':
        return (
          <>
            <circle cx="53" cy="57" r="20" stroke={colors.gold} strokeWidth="8" />
            <circle cx="77" cy="57" r="20" stroke={colors.gold} strokeWidth="8" />
            <circle cx="65" cy="80" r="20" stroke={colors.gold} strokeWidth="8" />
            <path d="M53 57h.01M77 57h.01M65 80h.01" stroke={colors.green} strokeWidth="8" strokeLinecap="round" />
          </>
        )
      case 'cultural-bridge':
        return (
          <>
            <path d="M24 88c8-24 24-36 40-36s32 12 40 36" stroke={colors.brown} strokeWidth="9" strokeLinecap="round" />
            <path d="M34 88h94M42 88V68l12-10 12 10v20M82 88V63l13-11 13 11v25" stroke={colors.green} {...thin} />
            <path d="M51 88V75M95 88V73M54 58c13 8 25 8 39 0" stroke={colors.gold} {...thin} />
          </>
        )
      default:
        return (
          <>
            <path d="M64 27 78 50l26 6-18 20 3 27-25-11-25 11 3-27-18-20 26-6 14-23Z" fill={colors.gold} stroke={colors.green} {...thin} />
            <path d="m51 68 10 10 18-24" stroke={colors.white} {...thin} />
          </>
        )
    }
  })()

  return (
    <BadgeShell className={className} title={title} unlocked={unlocked}>
      {artwork}
    </BadgeShell>
  )
}

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
          className={`h-20 w-20 transition ${locked ? 'opacity-55 grayscale' : ''}`}
        />
        {locked ? (
          <span className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
            <LockIcon />
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
