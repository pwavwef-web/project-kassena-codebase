import { useEffect, useState } from 'react'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import { useAuth } from '../../hooks/useAuth'
import {
  listApprovedDictionaryEntries,
  unpublishDictionaryEntry,
  upsertDictionaryEntry,
} from '../../lib/firestore'
import type { DictionaryEntry } from '../../types'

export const AdminDictionaryPage = () => {
  const { appUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [entries, setEntries] = useState<DictionaryEntry[]>([])

  const load = async () => {
    setEntries(await listApprovedDictionaryEntries())
  }

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      const dictionaryEntries = await listApprovedDictionaryEntries()
      if (active) {
        setEntries(dictionaryEntries)
        setIsLoading(false)
      }
    }

    hydrate().catch(() => {
      if (active) {
        setIsLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [])

  const actor = { id: appUser?.uid ?? '', email: appUser?.email ?? '' }

  const addManualEntry = async () => {
    if (appUser?.role !== 'admin') {
      return
    }

    const englishText = window.prompt('English text')
    const kasemText = window.prompt('Kasem text')

    if (!englishText || !kasemText) {
      return
    }

    const id = crypto.randomUUID()
    await upsertDictionaryEntry(
      id,
      {
        englishText,
        kasemText,
        englishExample: '',
        kasemExample: '',
        dialect: 'Other',
        partOfSpeech: 'Other',
        category: 'General vocabulary',
        isPublished: true,
      },
      actor,
    )
    await load()
  }

  const editEntry = async (entry: DictionaryEntry) => {
    if (appUser?.role !== 'admin') {
      return
    }

    const englishText = window.prompt('English text', entry.englishText)
    const kasemText = window.prompt('Kasem text', entry.kasemText)
    if (!englishText || !kasemText) {
      return
    }

    await upsertDictionaryEntry(
      entry.id,
      {
        englishText,
        kasemText,
        englishExample: entry.englishExample,
        kasemExample: entry.kasemExample,
        dialect: entry.dialect,
        partOfSpeech: entry.partOfSpeech,
        category: entry.category,
        sourceContributionId: entry.sourceContributionId,
        contributorId: entry.contributorId,
        approvedBy: entry.approvedBy,
        approvedAt: entry.approvedAt,
        isPublished: entry.isPublished,
      },
      actor,
    )
    await load()
  }

  const handleUnpublish = async (id: string) => {
    if (appUser?.role !== 'admin') {
      return
    }

    await unpublishDictionaryEntry(id, actor)
    await load()
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-kassena-green">
          Dictionary Management
        </h1>
        <button
          type="button"
          onClick={addManualEntry}
          disabled={appUser?.role !== 'admin'}
          className="rounded-lg bg-kassena-orange px-3 py-2 text-sm text-white disabled:opacity-60"
        >
          Add entry manually
        </button>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : entries.length ? (
        <div className="space-y-3">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-lg border border-kassena-cream p-3"
            >
              <h2 className="font-semibold text-kassena-green">
                {entry.englishText} — {entry.kasemText}
              </h2>
              <p className="text-sm text-slate-600">
                {entry.dialect} • {entry.partOfSpeech} • {entry.category}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => editEntry(entry)}
                  disabled={appUser?.role !== 'admin'}
                  className="rounded-lg border border-kassena-gold px-3 py-1 text-sm text-kassena-green disabled:opacity-60"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleUnpublish(entry.id)}
                  disabled={appUser?.role !== 'admin'}
                  className="rounded-lg bg-rose-600 px-3 py-1 text-sm text-white disabled:opacity-60"
                >
                  Unpublish
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState message="No approved dictionary entries available." />
      )}
    </section>
  )
}
