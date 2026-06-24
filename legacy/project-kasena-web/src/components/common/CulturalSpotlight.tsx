import { useState, useEffect, useCallback } from 'react'
import { EmptyState } from './EmptyState'
import { AppIcon } from './AppIcon'

interface CulturalItem {
  id: string
  type: 'proverb' | 'story' | 'fact' | 'expression'
  title: string
  content: string
  attribution?: string
}

interface CulturalSpotlightProps {
  items: CulturalItem[]
  isLoading?: boolean
}

const typeConfig: Record<
  CulturalItem['type'],
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  proverb: {
    label: 'Proverb of the Week',
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    icon: <AppIcon name="proverb" className="h-6 w-6" />,
  },
  story: {
    label: 'Story from an Elder',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    icon: <AppIcon name="book" className="h-6 w-6" />,
  },
  fact: {
    label: 'Cultural Fact',
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: <AppIcon name="spark" className="h-6 w-6" />,
  },
  expression: {
    label: 'Traditional Expression',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: <AppIcon name="words" className="h-6 w-6" />,
  },
}

export const CulturalSpotlight = ({ items, isLoading = false }: CulturalSpotlightProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextIndex = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  useEffect(() => {
    if (isPaused || items.length <= 1) return
    const timer = setInterval(nextIndex, 3000)
    return () => clearInterval(timer)
  }, [isPaused, items.length, nextIndex])

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
    setIsPaused(false)
  }

  if (isLoading) {
    return (
      <div className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-slate-100 animate-pulse sm:rounded-2xl sm:p-6">
        <div className="h-4 w-32 rounded bg-slate-200 mb-4" />
        <div className="h-6 w-48 rounded bg-slate-200 mb-2" />
        <div className="h-20 w-full rounded bg-slate-200" />
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-2xl sm:p-6">
        <h3 className="mb-3 text-base font-black text-kassena-green sm:mb-4 sm:text-lg">Cultural Spotlight</h3>
        <EmptyState message="Cultural content coming soon. Stay tuned!" />
      </div>
    )
  }

  const activeItem = items[activeIndex]
  const config = typeConfig[activeItem.type]

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-black text-kassena-green sm:text-2xl">
          Cultural Spotlight
        </h2>
        <span className="shrink-0 rounded-full bg-kassena-gold/10 px-2 py-1 text-[10px] font-bold text-kassena-gold sm:text-xs">
          Powered by Indigen World
        </span>
      </div>

      <div
        className="relative overflow-hidden rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-2xl sm:p-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2 sm:mb-4">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
              {config.icon}
              {config.label}
            </span>
          </div>

          <h3 className="mb-2 text-lg font-black text-kassena-green sm:mb-3 sm:text-xl">
            {activeItem.title}
          </h3>

          <blockquote className="border-l-4 border-kassena-gold/40 pl-3 text-sm italic leading-6 text-slate-700 sm:pl-4 sm:text-base sm:leading-relaxed">
            {activeItem.content}
          </blockquote>

          {activeItem.attribution && (
            <p className="mt-3 text-sm text-slate-500">
              — {activeItem.attribution}
            </p>
          )}
        </div>

        {items.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {items.map((_, index) => (
              <button
                key={items[index].id}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? 'w-6 bg-kassena-orange'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Show item ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
