import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { listSearchHistory, deleteSearchHistoryEntry } from '../../lib/firestore'
import { LoadingState } from '../common/LoadingState'
import { EmptyState } from '../common/EmptyState'
import { AppIcon } from '../common/AppIcon'
import type { SearchHistoryEntry } from '../../types'

export const SearchHistoryTab = () => {
  const { appUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [history, setHistory] = useState<SearchHistoryEntry[]>([])

  useEffect(() => {
    if (!appUser) return

    listSearchHistory(appUser.uid)
      .then(setHistory)
      .catch(() => console.error('Failed to load search history'))
      .finally(() => setIsLoading(false))
  }, [appUser])

  const handleDelete = async (id: string) => {
    await deleteSearchHistoryEntry(id)
    setHistory((prev) => prev.filter((h) => h.id !== id))
  }

  if (isLoading) return <LoadingState />
  if (history.length === 0) return <EmptyState message="No search history yet. Search the dictionary to see your history here." />

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">{history.length} past searches</p>
      {history.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-xl border border-kassena-cream bg-white px-3 py-2"
        >
          <span className="text-sm text-slate-700">{item.query}</span>
          <button
            type="button"
            onClick={() => handleDelete(item.id)}
            className="transition-transform hover:scale-110"
            aria-label={`Delete search "${item.query}"`}
          >
            <AppIcon name="close" className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  )
}
