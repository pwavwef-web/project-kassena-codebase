import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { revealVariants, usePrefersReducedMotion } from '../../lib/motion'

/** Static map of motion tag components (avoids creating components at render). */
const motionTags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  span: motion.span,
  p: motion.p,
} as const

type MotionTagName = keyof typeof motionTags

interface RevealProps {
  children: ReactNode
  className?: string
  /** Delay in seconds before the reveal animation starts. */
  delay?: number
  as?: MotionTagName
  /** Slide distance in px (default 24). */
  y?: number
  once?: boolean
}

/**
 * Reveals its children when scrolled into view. Respects reduced-motion /
 * Save-Data by rendering immediately with no transform.
 */
export const Reveal = ({
  children,
  className,
  delay = 0,
  as = 'div',
  y = 24,
  once = true,
}: RevealProps) => {
  const reduced = usePrefersReducedMotion()
  const MotionTag = motionTags[as]

  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
        },
      }}
    >
      {children}
    </MotionTag>
  )
}

interface StaggerProps {
  children: ReactNode
  className?: string
  as?: MotionTagName
}

/** Wrap a group of <RevealItem> children to stagger their entrance. */
export const Stagger = ({ children, className, as = 'div' }: StaggerProps) => {
  const reduced = usePrefersReducedMotion()
  const MotionTag = motionTags[as]

  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.09 } },
      }}
    >
      {children}
    </MotionTag>
  )
}

interface RevealItemProps {
  children: ReactNode
  className?: string
  as?: MotionTagName
}

export const RevealItem = ({
  children,
  className,
  as = 'div',
}: RevealItemProps) => {
  const reduced = usePrefersReducedMotion()
  const MotionTag = motionTags[as]

  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag className={className} variants={revealVariants}>
      {children}
    </MotionTag>
  )
}
