import type { ReactNode } from 'react'
import { Reveal } from '../motion/Reveal'

type Tone = 'cream' | 'white' | 'indigo' | 'dark' | 'transparent'

const toneClasses: Record<Tone, string> = {
  cream: 'bg-cream-100 text-charcoal',
  white: 'bg-white text-charcoal',
  indigo: 'bg-indigo-700 text-cream-100',
  dark: 'bg-indigo-950 text-cream-100',
  transparent: 'text-charcoal',
}

interface SectionProps {
  children: ReactNode
  tone?: Tone
  className?: string
  /** Vertical padding density. */
  spacing?: 'sm' | 'md' | 'lg'
  id?: string
  /** Render the inner container, or pass-through full-bleed children. */
  bleed?: boolean
}

const spacingClasses = {
  sm: 'py-14 sm:py-16',
  md: 'py-16 sm:py-24',
  lg: 'py-20 sm:py-32',
}

export const Section = ({
  children,
  tone = 'transparent',
  className = '',
  spacing = 'md',
  id,
  bleed = false,
}: SectionProps) => (
  <section
    id={id}
    className={`relative ${toneClasses[tone]} ${spacingClasses[spacing]} ${className}`}
  >
    {bleed ? children : <div className="container">{children}</div>}
  </section>
)

export const Container = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => <div className={`container ${className}`}>{children}</div>

interface EyebrowProps {
  children: ReactNode
  className?: string
  icon?: ReactNode
}

export const Eyebrow = ({ children, className = '', icon }: EyebrowProps) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 ${className}`}
  >
    {icon}
    {children}
  </span>
)

interface SectionHeaderProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
  /** Constrain the description width for readability. */
  tone?: 'light' | 'dark'
}

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
  tone = 'light',
}: SectionHeaderProps) => {
  const isCenter = align === 'center'
  const descColor = tone === 'dark' ? 'text-cream-200/80' : 'text-charcoal-muted'
  const eyebrowColor =
    tone === 'dark' ? 'text-kente-300' : 'text-terracotta-600'
  return (
    <div
      className={`flex flex-col gap-4 ${isCenter ? 'items-center text-center' : 'items-start'} ${className}`}
    >
      {eyebrow ? (
        <Reveal>
          <span
            className={`text-xs font-bold uppercase tracking-[0.2em] ${eyebrowColor}`}
          >
            {eyebrow}
          </span>
        </Reveal>
      ) : null}
      <Reveal delay={0.05}>
        <h2 className="max-w-3xl text-balance font-display text-fluid-2xl font-bold leading-[1.1] tracking-tight">
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.1}>
          <p
            className={`max-w-2xl text-pretty text-fluid-base ${descColor} ${isCenter ? 'mx-auto' : ''}`}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  )
}
