import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingState } from '../components/common/LoadingState'
import { MediaPreview } from '../components/common/MediaPreview'
import { listApprovedUploads } from '../lib/firestore'
import type { UploadRecord } from '../types'

export const CulturePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [items, setItems] = useState<UploadRecord[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    let active = true

    listApprovedUploads()
      .then((result) => {
        if (active) {
          setItems(
            result.filter(
              (item) =>
                !item.culturalSensitivity ||
                item.culturalSensitivity === 'public',
            ),
          )
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))).sort(),
    [items],
  )

  const visibleItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return items.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category
      const matchesSearch =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.dialect?.toLowerCase().includes(keyword) ||
        item.tags?.toLowerCase().includes(keyword)

      return matchesCategory && matchesSearch
    })
  }, [category, items, search])

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-kassena-green">
          Explore Culture
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Approved songs, stories, poems, images and learning materials from the
          TribeStudio community.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, description, dialect or tags"
            aria-label="Search culture items"
            className="rounded-lg border border-kassena-cream px-3 py-2"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter culture items by category"
            className="rounded-lg border border-kassena-cream px-3 py-2"
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : visibleItems.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleItems.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl bg-white p-4 shadow-sm"
            >
              <MediaPreview
                file={{
                  name: item.fileName || item.title,
                  url: item.fileUrl,
                  contentType: item.contentType,
                }}
                title={item.title}
              />
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>{item.category}</span>
                {item.dialect ? <span>{item.dialect}</span> : null}
                {item.consentStatus === 'received' ? (
                  <span>Consent received</span>
                ) : null}
              </div>
              <h2 className="mt-2 text-lg font-semibold text-kassena-green">
                {item.title}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {item.description || 'Approved cultural archive item.'}
              </p>
              {item.tags ? (
                <p className="mt-2 text-xs text-slate-500">Tags: {item.tags}</p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState message="No approved public cultural items match this view yet." />
      )}
    </section>
  )
}
