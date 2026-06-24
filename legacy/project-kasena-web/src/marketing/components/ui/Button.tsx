import type {
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold'
type Size = 'sm' | 'md' | 'lg'

const base =
  'pk-focus inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-200 ease-emphasized active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary:
    'bg-indigo-700 text-white shadow-card hover:bg-indigo-800 hover:shadow-lifted',
  secondary:
    'bg-terracotta-500 text-white shadow-card hover:bg-terracotta-600 hover:shadow-lifted',
  gold: 'bg-kente-500 text-charcoal shadow-card hover:bg-kente-400 hover:shadow-glow',
  outline:
    'border border-indigo-200 bg-white/70 text-indigo-700 backdrop-blur hover:border-indigo-300 hover:bg-white',
  ghost: 'text-indigo-700 hover:bg-indigo-50',
}

const sizes: Record<Size, string> = {
  sm: 'min-h-[40px] px-4 text-sm',
  md: 'min-h-[48px] px-6 text-[0.95rem]',
  lg: 'min-h-[56px] px-8 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  /** Right-aligned trailing element (e.g. an arrow). */
  trailing?: ReactNode
  /** Left-aligned leading element (e.g. an icon). */
  leading?: ReactNode
  fullWidth?: boolean
  /** Optional click handler (analytics, etc.) — works for all variants. */
  onClick?: MouseEventHandler<HTMLElement>
}

type LinkButtonProps = CommonProps & {
  to: string
  href?: never
}

type AnchorButtonProps = CommonProps & {
  href: string
  to?: never
  external?: boolean
}

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never
    href?: never
  }

export type ButtonProps =
  | LinkButtonProps
  | AnchorButtonProps
  | NativeButtonProps

const composeClass = (
  variant: Variant,
  size: Size,
  fullWidth: boolean,
  className?: string,
) =>
  [base, variants[variant], sizes[size], fullWidth ? 'w-full' : '', className]
    .filter(Boolean)
    .join(' ')

export const Button = (props: ButtonProps) => {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    trailing,
    leading,
    fullWidth = false,
  } = props
  const classes = composeClass(variant, size, fullWidth, className)
  const inner = (
    <>
      {leading}
      <span>{children}</span>
      {trailing}
    </>
  )

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes} onClick={props.onClick}>
        {inner}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    const { external = true } = props as AnchorButtonProps
    return (
      <a
        href={props.href}
        className={classes}
        onClick={props.onClick}
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {inner}
      </a>
    )
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    trailing: _t,
    leading: _l,
    fullWidth: _fw,
    ...buttonProps
  } = props as NativeButtonProps
  void _v
  void _s
  void _c
  void _ch
  void _t
  void _l
  void _fw
  return (
    <button className={classes} {...buttonProps}>
      {inner}
    </button>
  )
}

/** A small inline "text link with arrow" used throughout the marketing site. */
export const ArrowLink = ({
  to,
  href,
  children,
  className = '',
}: {
  to?: string
  href?: string
  children: ReactNode
  className?: string
}) => {
  const cls = `pk-focus group inline-flex items-center gap-1.5 font-semibold text-terracotta-600 transition-colors hover:text-terracotta-700 ${className}`
  const inner = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-1"
      >
        →
      </span>
    </>
  )
  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    )
  }
  return (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  )
}
