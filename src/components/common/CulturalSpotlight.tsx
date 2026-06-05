import { useState } from 'react'
import { EmptyState } from './EmptyState'

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
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
  story: {
    label: 'Story from an Elder',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  fact: {
    label: 'Cultural Fact',
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  expression: {
    label: 'Traditional Expression',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
}

export const CulturalSpotlight = ({ items, isLoading = false }: CulturalSpotlightProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 animate-pulse">
        <div className="h-4 w-32 rounded bg-slate-200 mb-4" />
        <div className="h-6 w-48 rounded bg-slate-200 mb-2" />
        <div className="h-20 w-full rounded bg-slate-200" />
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="text-lg font-bold text-kassena-green mb-4">Cultural Spotlight</h3>
        <EmptyState message="Cultural content coming soon. Stay tuned!" />
      </div>
    )
  }

  const activeItem = items[activeIndex]
  const config = typeConfig[activeItem.type]

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-kassena-green sm:text-2xl">
          Cultural Spotlight
        </h2>
        <span className="text-xs font-medium text-kassena-gold bg-kassena-gold/10 px-2 py-1 rounded-full">
          Powered by Indigen World
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-kassena-green/5 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
              {config.icon}
              {config.label}
            </span>
          </div>

          <h3 className="text-xl font-bold text-kassena-green mb-3">
            {activeItem.title}
          </h3>

          <blockquote className="border-l-4 border-kassena-gold/40 pl-4 text-slate-700 italic leading-relaxed">
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
                onClick={() => setActiveIndex(index)}
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
