import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import {
  listDictionaryEntriesByIds,
  listUserFavorites,
} from '../../lib/firestore'
import { LoadingState } from '../common/LoadingState'
import { EmptyState } from '../common/EmptyState'
import type { DictionaryEntry } from '../../types'

export const FavoritesTab = () => {
  const { appUser, firebaseUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [entries, setEntries] = useState<DictionaryEntry[]>([])
  const userId = firebaseUser?.uid

  useEffect(() => {
    if (!appUser || !userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- guard clause: end loading when there is no signed-in user.
      setIsLoading(false)
      return
    }

    const load = async () => {
      try {
        const favorites = await listUserFavorites(userId)
        const favoriteEntries = await listDictionaryEntriesByIds(
          favorites.map((favorite) => favorite.entryId),
        )
        const entryMap = new Map(
          favoriteEntries.map((entry) => [entry.id, entry]),
        )

        setEntries(
          favorites
            .map((favorite) => entryMap.get(favorite.entryId))
            .filter((entry): entry is DictionaryEntry => Boolean(entry)),
        )
      } catch (error) {
        console.error('Failed to load favorites', error)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [appUser, userId])

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
