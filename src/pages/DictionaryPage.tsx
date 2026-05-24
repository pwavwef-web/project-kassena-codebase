import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingState } from '../components/common/LoadingState'
import { listApprovedDictionaryEntries } from '../lib/firestore'
import type { DictionaryEntry } from '../types'

export const DictionaryPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [entries, setEntries] = useState<DictionaryEntry[]>([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    english: '',
    kasem: '',
    dialect: '',
    partOfSpeech: '',
  })

  useEffect(() => {
    listApprovedDictionaryEntries()
      .then(setEntries)
      .finally(() => setIsLoading(false))
  }, [])

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const keyword = search.toLowerCase()
        const matchesSearch =
          !keyword ||
          entry.englishText.toLowerCase().includes(keyword) ||
          entry.kasemText.toLowerCase().includes(keyword) ||
          entry.alternateKasemTerms?.toLowerCase().includes(keyword)

        const matchesEnglish =
          !filters.english ||
          entry.englishText
            .toLowerCase()
            .includes(filters.english.toLowerCase())
        const matchesKasem =
          !filters.kasem ||
          entry.kasemText.toLowerCase().includes(filters.kasem.toLowerCase())
        const matchesDialect =
          !filters.dialect ||
          entry.dialect.toLowerCase().includes(filters.dialect.toLowerCase())
        const matchesPartOfSpeech =
          !filters.partOfSpeech ||
          entry.partOfSpeech
            .toLowerCase()
            .includes(filters.partOfSpeech.toLowerCase())

        return (
          matchesSearch &&
          matchesEnglish &&
          matchesKasem &&
          matchesDialect &&
          matchesPartOfSpeech
        )
      }),
    [
      entries,
      filters.dialect,
      filters.english,
      filters.kasem,
      filters.partOfSpeech,
      search,
    ],
  )

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-kassena-green">Dictionary</h1>
      <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-5">
        <input
          placeholder="Search approved entries"
          className="rounded-lg border border-kassena-cream px-3 py-2"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <input
          placeholder="Filter by English"
          className="rounded-lg border border-kassena-cream px-3 py-2"
          value={filters.english}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, english: event.target.value }))
          }
        />
        <input
          placeholder="Filter by Kasem"
          className="rounded-lg border border-kassena-cream px-3 py-2"
          value={filters.kasem}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, kasem: event.target.value }))
          }
        />
        <input
          placeholder="Filter by dialect"
          className="rounded-lg border border-kassena-cream px-3 py-2"
          value={filters.dialect}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, dialect: event.target.value }))
          }
        />
        <input
          placeholder="Filter by part of speech"
          className="rounded-lg border border-kassena-cream px-3 py-2"
          value={filters.partOfSpeech}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              partOfSpeech: event.target.value,
            }))
          }
        />
      </div>
      {isLoading ? (
        <LoadingState />
      ) : filteredEntries.length ? (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl bg-white p-4 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-kassena-green">
                {entry.englishText} — {entry.kasemText}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {entry.partOfSpeech} • {entry.dialect} • {entry.category}
              </p>
              {entry.alternateKasemTerms ? (
                <p className="mt-2 text-sm text-slate-700">
                  Also said as: {entry.alternateKasemTerms}
                </p>
              ) : null}
              {entry.englishExample || entry.kasemExample ? (
                <p className="mt-2 text-sm text-slate-700">
                  Example: {entry.englishExample} / {entry.kasemExample}
                </p>
              ) : null}
              <Link
                to="/submit"
                className="mt-3 inline-flex text-sm font-semibold text-kassena-orange"
              >
                Know a better translation? Submit a correction
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState message="No approved dictionary entries match your filters yet." />
      )}
    </section>
  )
}
