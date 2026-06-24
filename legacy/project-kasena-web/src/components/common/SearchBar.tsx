import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { listSearchHistory, deleteSearchHistoryEntry, addSearchHistory } from '../../lib/firestore'
import { POPULAR_SEARCHES } from '../../lib/constants'
import type { SearchHistoryEntry } from '../../types'
import { KasemKeyboard } from '../KasemKeyboard'
import { AppIcon } from './AppIcon'

interface SearchBarProps {
  onSearch?: (query: string) => void
  autoFocus?: boolean
  onQueryChange?: (query: string) => void
}

export const SearchBar = ({ onSearch, autoFocus = false, onQueryChange }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { appUser } = useAuth()

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    if (!appUser || !isFocused) return
    listSearchHistory(appUser.uid).then(setSearchHistory).catch(() => {})
  }, [appUser, isFocused])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (appUser) {
        addSearchHistory(appUser.uid, query.trim()).catch(() => {})
      }
      if (onSearch) {
        onSearch(query.trim())
      } else {
        navigate(`/dictionary?search=${encodeURIComponent(query.trim())}`)
      }
      setIsFocused(false)
    }
  }

  const handleHistoryClick = (searchQuery: string) => {
    setQuery(searchQuery)
    onQueryChange?.(searchQuery)
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      navigate(`/dictionary?search=${encodeURIComponent(searchQuery)}`)
    }
    setIsFocused(false)
  }

  const handleDeleteHistory = async (e: React.MouseEvent, historyId: string) => {
    e.stopPropagation()
    await deleteSearchHistoryEntry(historyId)
    setSearchHistory((prev) => prev.filter((h) => h.id !== historyId))
  }

  const handlePopularClick = (term: string) => {
    setQuery(term)
    onQueryChange?.(term)
    if (onSearch) {
      onSearch(term)
    } else {
      navigate(`/dictionary?search=${encodeURIComponent(term)}`)
    }
    setIsFocused(false)
  }

  const handleClear = () => {
    setQuery('')
    onQueryChange?.('')
    inputRef.current?.focus()
  }

  const showDropdown = isFocused && !query

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <AppIcon name="search" className="h-5 w-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              onQueryChange?.(e.target.value)
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search English or Kasem..."
            className="w-full rounded-[16px] border border-kassena-cream bg-white py-3 pl-11 pr-12 text-sm text-slate-800 shadow-[0_10px_24px_rgba(71,44,18,0.08)] transition-all placeholder:text-slate-400 focus:border-kassena-orange focus:outline-none focus:ring-4 focus:ring-kassena-orange/10 sm:rounded-2xl sm:border-2 sm:py-4 sm:pl-12 sm:text-base sm:shadow-lg"
            aria-label="Search dictionary"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-14 flex items-center pr-2 transition-transform hover:scale-110"
              aria-label="Clear search"
            >
              <AppIcon name="close" className="h-5 w-5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center rounded-r-[16px] bg-kassena-orange px-4 text-white transition-all hover:bg-[#e67e22] active:scale-95 sm:rounded-r-2xl sm:px-5"
            aria-label="Search"
          >
            <AppIcon name="search" className="h-5 w-5" />
          </button>
        </div>
      </form>

      <KasemKeyboard
        inputRef={inputRef}
        context="dictionary_search"
        className="mt-1"
      />

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-kassena-cream bg-white p-4 shadow-xl">
          {searchHistory.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Recent Searches</h4>
              <div className="space-y-1">
                {searchHistory.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleHistoryClick(item.query)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-kassena-bg transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <AppIcon name="timeline" className="h-4 w-4" />
                      {item.query}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteHistory(e, item.id)}
                      className="transition-transform hover:scale-110"
                      aria-label={`Delete search "${item.query}"`}
                    >
                      <AppIcon name="close" className="h-5 w-5" />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Popular Searches</h4>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handlePopularClick(term)}
                  className="rounded-full bg-kassena-cream px-3 py-1.5 text-xs font-semibold text-kassena-green transition-all hover:bg-kassena-green hover:text-white"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
