import { useState } from 'react'

interface ImageSource {
  srcSet: string
  type?: string
  media?: string
}

interface ResponsiveImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  imgClassName?: string
  /** <picture> sources for AVIF/WebP delivery. */
  sources?: ImageSource[]
  sizes?: string
  /** Above-the-fold images should set priority to disable lazy loading. */
  priority?: boolean
  /** Tailwind aspect ratio class, e.g. "aspect-[16/9]". */
  aspect?: string
}

/**
 * CLS-safe responsive image with AVIF/WebP <picture> support, lazy loading and
 * a soft skeleton until decode. `width`/`height` are required to reserve space.
 */
export const ResponsiveImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  imgClassName = '',
  sources = [],
  sizes,
  priority = false,
  aspect,
}: ResponsiveImageProps) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={`relative overflow-hidden bg-sand-100 ${aspect ?? ''} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-sand-100 to-sand-200 transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100 animate-pulse'
        }`}
      />
      <picture>
        {sources.map((source, i) => (
          <source
            key={i}
            srcSet={source.srcSet}
            type={source.type}
            media={source.media}
            sizes={sizes}
          />
        ))}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      </picture>
    </div>
  )
}
