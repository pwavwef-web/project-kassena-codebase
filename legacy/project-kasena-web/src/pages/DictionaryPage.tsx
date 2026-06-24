import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingState } from '../components/common/LoadingState'
import { SearchBar } from '../components/common/SearchBar'
import { WordOfTheDay } from '../components/common/WordOfTheDay'
import { ExpandableDictionaryCard } from '../components/common/ExpandableDictionaryCard'
import { useAuth } from '../hooks/useAuth'
import { listApprovedDictionaryEntries } from '../lib/firestore'
import type { DictionaryEntry } from '../types'

export const DictionaryPage = () => {
  const { appUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [entries, setEntries] = useState<DictionaryEntry[]>([])
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    dialect: '',
    partOfSpeech: '',
  })

  useEffect(() => {
    listApprovedDictionaryEntries()
      .then(setEntries)
      .finally(() => setIsLoading(false))
  }, [])

  const handleSearch = (query: string) => {
    setSearch(query)
    if (query) {
      setSearchParams({ search: query })
    } else {
      setSearchParams({})
    }
  }

  const wordOfDay = useMemo(() => {
    if (entries.length === 0) return null
    const today = new Date()
    const dayIndex = today.getDate() % entries.length
    const selected = entries[dayIndex]
    return {
      wordKey: selected.id,
      kasemWord: selected.kasemText,
      pronunciation: selected.pronunciation || `/${selected.kasemText.toLowerCase()}/`,
      englishMeaning: selected.englishText,
      exampleSentence: selected.kasemExample || selected.englishExample,
      culturalNote: selected.category !== 'General vocabulary' ? `Category: ${selected.category}` : undefined,
      audioUrl: selected.audioUrl,
    }
  }, [entries])

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const keyword = search.toLowerCase()
        const matchesSearch =
          !keyword ||
          entry.englishText.toLowerCase().includes(keyword) ||
          entry.kasemText.toLowerCase().includes(keyword) ||
          entry.alternateKasemTerms?.toLowerCase().includes(keyword)

        const matchesDialect =
          !filters.dialect ||
          entry.dialect.toLowerCase().includes(filters.dialect.toLowerCase())
        const matchesPartOfSpeech =
          !filters.partOfSpeech ||
          entry.partOfSpeech
            .toLowerCase()
            .includes(filters.partOfSpeech.toLowerCase())

        return matchesSearch && matchesDialect && matchesPartOfSpeech
      }),
    [entries, filters.dialect, filters.partOfSpeech, search],
  )

  return (
    <section className="space-y-6">
      <WordOfTheDay
        data={wordOfDay}
        isLoading={isLoading}
        viewerId={appUser?.uid}
      />

      <div className="space-y-3">
        <SearchBar
          onSearch={handleSearch}
          autoFocus={false}
        />

        <div className="flex flex-wrap gap-3">
          <select
            value={filters.dialect}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dialect: e.target.value }))
            }
            className="rounded-lg border border-kassena-cream bg-white px-3 py-2 text-sm"
          >
            <option value="">All Dialects</option>
            <option value="Navrongo">Navrongo</option>
            <option value="Paga">Paga</option>
            <option value="Chiana">Chiana</option>
            <option value="Chuchuliga">Chuchuliga</option>
            <option value="Sandema">Sandema</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.partOfSpeech}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, partOfSpeech: e.target.value }))
            }
            className="rounded-lg border border-kassena-cream bg-white px-3 py-2 text-sm"
          >
            <option value="">All Parts of Speech</option>
            <option value="Noun">Noun</option>
            <option value="Verb">Verb</option>
            <option value="Adjective">Adjective</option>
            <option value="Adverb">Adverb</option>
            <option value="Phrase">Phrase</option>
            <option value="Proverb">Proverb</option>
            <option value="Greeting">Greeting</option>
            <option value="Other">Other</option>
          </select>

          {(filters.dialect || filters.partOfSpeech) && (
            <button
              type="button"
              onClick={() => setFilters({ dialect: '', partOfSpeech: '' })}
              className="text-sm font-semibold text-kassena-orange hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {isLoading ? (
            'Loading...'
          ) : (
            <>
              {filteredEntries.length} {filteredEntries.length === 1 ? 'word' : 'words'} found
              {search && <span className="text-slate-400"> for &ldquo;{search}&rdquo;</span>}
            </>
          )}
        </p>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : filteredEntries.length ? (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <ExpandableDictionaryCard
              key={entry.id}
              entry={entry}
              isExpanded={expandedId === entry.id}
              onToggleExpand={() =>
                setExpandedId((prev) => (prev === entry.id ? null : entry.id))
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No approved dictionary entries match your filters yet." />
      )}
    </section>
  )
}
