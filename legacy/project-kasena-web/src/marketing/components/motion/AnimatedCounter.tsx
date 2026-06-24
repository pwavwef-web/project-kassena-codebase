import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { usePrefersReducedMotion } from '../../lib/motion'

interface AnimatedCounterProps {
  value: number
  /** Render before the number, e.g. "₵". */
  prefix?: string
  /** Render after the number, e.g. "+" or "k". */
  suffix?: string
  /** Decimal places. */
  decimals?: number
  durationMs?: number
  className?: string
  /** Locale-aware grouping (e.g. 20,000). */
  grouping?: boolean
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/** Counts up from 0 to `value` when scrolled into view. */
export const AnimatedCounter = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationMs = 1600,
  className,
  grouping = true,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const reduced = usePrefersReducedMotion()
  const [animated, setAnimated] = useState(0)

  // Animate only when in view and motion is allowed; setState happens inside the
  // rAF callback (never synchronously in the effect body).
  const shouldAnimate = inView && !reduced

  useEffect(() => {
    if (!shouldAnimate) return
    let raf = 0
    let start: number | null = null
    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / durationMs, 1)
      setAnimated(value * easeOut(progress))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [shouldAnimate, value, durationMs])

  // Reduced motion / Save-Data → show the final value immediately; otherwise show
  // the animated value (0 until it scrolls into view).
  const display = reduced ? value : animated

  const formatted = display.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouping,
  })

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
