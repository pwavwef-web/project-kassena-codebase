import { useEffect, useState } from 'react'
import type { Variants } from 'framer-motion'

interface NetworkInformation {
  saveData?: boolean
}

/**
 * True when the user prefers reduced motion OR has Save-Data enabled OR is on a
 * low-capability device. Marketing animations should degrade to instant when
 * this returns true.
 */
export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (
      navigator as Navigator & { connection?: NetworkInformation }
    ).connection
    const saveData = Boolean(connection?.saveData)
    const lowMemory =
      typeof (navigator as Navigator & { deviceMemory?: number })
        .deviceMemory === 'number' &&
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 2

    const update = () => setReduced(motionQuery.matches || saveData || lowMemory)
    update()

    motionQuery.addEventListener('change', update)
    return () => motionQuery.removeEventListener('change', update)
  }, [])

  return reduced
}

/** Standard reveal-on-scroll variants. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

/** Container that staggers its children's reveal. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}
