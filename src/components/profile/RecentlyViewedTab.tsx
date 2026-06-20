import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import {
  listDictionaryEntriesByIds,
  listRecentlyViewed,
} from '../../lib/firestore'
import { LoadingState } from '../common/LoadingState'
import { EmptyState } from '../common/EmptyState'
import type { DictionaryEntry } from '../../types'

export const RecentlyViewedTab = () => {
  const { appUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [entries, setEntries] = useState<DictionaryEntry[]>([])

  useEffect(() => {
    if (!appUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- guard clause: end loading when there is no signed-in user.
      setIsLoading(false)
      return
    }

    const load = async () => {
      try {
        const views = await listRecentlyViewed(appUser.uid)
        const viewedEntries = await listDictionaryEntriesByIds(
          views.map((view) => view.entryId),
        )
        const entryMap = new Map(viewedEntries.map((entry) => [entry.id, entry]))

        setEntries(
          views
            .map((view) => entryMap.get(view.entryId))
            .filter((entry): entry is DictionaryEntry => Boolean(entry)),
        )
      } catch (error) {
        console.error('Failed to load recently viewed', error)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [appUser])

  if (isLoading) return <LoadingState />
  if (entries.length === 0) return <EmptyState message="No recently viewed words yet. Browse the dictionary to see your history here." />

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">{entries.length} words viewed recently</p>
      {entries.map((entry) => (
        <article key={entry.id} className="rounded-xl border border-kassena-cream bg-white p-3">
          <h3 className="font-semibold text-kassena-green">{entry.englishText} — {entry.kasemText}</h3>
          <p className="text-sm text-slate-600">{entry.partOfSpeech} • {entry.dialect}</p>
        </article>
      ))}
    </div>
  )
}
