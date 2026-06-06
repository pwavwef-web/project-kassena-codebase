import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { listUserFavorites, listApprovedDictionaryEntries } from '../../lib/firestore'
import { LoadingState } from '../common/LoadingState'
import { EmptyState } from '../common/EmptyState'
import type { DictionaryEntry } from '../../types'

export const FavoritesTab = () => {
  const { appUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [entries, setEntries] = useState<DictionaryEntry[]>([])

  useEffect(() => {
    if (!appUser) return

    const load = async () => {
      try {
        const [favs, allEntries] = await Promise.all([
          listUserFavorites(appUser.uid),
          listApprovedDictionaryEntries(),
        ])
        const entryMap = new Map(allEntries.map((e) => [e.id, e]))
        setEntries(favs.map((f) => entryMap.get(f.entryId)).filter(Boolean) as DictionaryEntry[])
      } catch {
        console.error('Failed to load favorites')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [appUser])

  if (isLoading) return <LoadingState />
  if (entries.length === 0) return <EmptyState message="No favorite words yet. Tap the heart on any dictionary word to save it here." />

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">{entries.length} saved {entries.length === 1 ? 'word' : 'words'}</p>
      {entries.map((entry) => (
        <article key={entry.id} className="rounded-xl border border-kassena-cream bg-white p-3">
          <h3 className="font-semibold text-kassena-green">{entry.englishText} — {entry.kasemText}</h3>
          <p className="text-sm text-slate-600">{entry.partOfSpeech} • {entry.dialect}</p>
          {entry.pronunciation && <p className="text-xs text-slate-500">/{entry.pronunciation}/</p>}
        </article>
      ))}
    </div>
  )
}
