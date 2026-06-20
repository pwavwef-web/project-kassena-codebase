type Variant = 'sirigu' | 'weave' | 'dots'

const variantClass: Record<Variant, string> = {
  sirigu: 'pk-pattern-sirigu',
  weave: 'pk-pattern-weave',
  dots: 'pk-pattern-dots',
}

/**
 * Subtle, decorative cultural-geometry layer (Sirigu / basketry / weave
 * inspired). Always aria-hidden and secondary to content. These are original
 * geometric motifs and are not labelled as authentic cultural artefacts.
 */
export const CulturalPatternLayer = ({
  variant = 'sirigu',
  className = '',
  opacity = 0.06,
  color = 'text-indigo-700',
}: {
  variant?: Variant
  className?: string
  opacity?: number
  /** Tailwind text-color class — drives `currentColor` of the pattern. */
  color?: string
}) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 ${color} ${variantClass[variant]} ${className}`}
    style={{ opacity }}
  />
)
